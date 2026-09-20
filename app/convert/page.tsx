'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Upload, X, FileText, CheckCircle, AlertCircle, Download,
  ArrowRight, Loader2, RefreshCw, Zap, Settings2, Info,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';

import { uploads, conversions, ApiClientError, type ConversionJob } from '@/lib/api-client';
import { getCategoryData, getAllCategoryIds } from '@/lib/conversions';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

interface ConversionOptions {
  quality: number;
  preserveMetadata: boolean;
}

interface ConversionState {
  stage: Stage;
  uploadPct: number;
  job: ConversionJob | null;
  downloadUrl: string | null;
  error: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTargetFormats(sourceExt: string): string[] {
  const ext = sourceExt.toUpperCase();
  const targets = new Set<string>();
  for (const id of getAllCategoryIds()) {
    const cat = getCategoryData(id);
    if (!cat) continue;
    const entry = cat.formats.find((f) => f.name === ext);
    if (entry) entry.conversions.forEach((c) => targets.add(c.targetFormat));
  }
  return [...targets].sort();
}

function extOf(f: string) {
  const p = f.split('.');
  return p.length > 1 ? (p.pop() ?? '').toUpperCase() : '';
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 ** 2).toFixed(1)} MB`;
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function DropZone({ file, onFile, onClear }: { file: File | null; onFile: (f: File) => void; onClear: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [onFile]);

  if (file) {
    return (
      <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl p-8 bg-green-50/50 dark:bg-green-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClear} aria-label="Remove file">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button" tabIndex={0} aria-label="Drop zone"
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors select-none
        ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/60 hover:bg-muted/40'}`}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <Upload className={`h-10 w-10 mx-auto mb-4 transition-colors ${dragging ? 'text-primary' : 'text-muted-foreground/50'}`} />
      <p className="font-medium mb-1">{dragging ? 'Drop to upload' : 'Drag & drop your file here'}</p>
      <p className="text-sm text-muted-foreground">or click to browse</p>
      <p className="text-xs text-muted-foreground mt-3">Max 100 MB · 2,000+ formats supported</p>
      <input ref={inputRef} type="file" className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </div>
  );
}

// ─── Options panel ────────────────────────────────────────────────────────────

function OptionsPanel({ options, onChange, targetFormat }: {
  options: ConversionOptions;
  onChange: (o: ConversionOptions) => void;
  targetFormat: string;
}) {
  const [open, setOpen] = useState(false);
  const isImage = ['JPG','JPEG','PNG','WEBP','TIFF','BMP','GIF','AVIF'].includes(targetFormat);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground h-8 px-2">
          <Settings2 className="h-3.5 w-3.5" />
          Advanced options
          <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2">
          <CardContent className="pt-5 space-y-5">
            {/* Quality slider — only for lossy image/video formats */}
            {isImage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Quality</Label>
                  <span className="text-sm font-semibold tabular-nums">{options.quality}%</span>
                </div>
                <Slider
                  min={1} max={100} step={1}
                  value={[options.quality]}
                  onValueChange={([v]) => onChange({ ...options, quality: v ?? options.quality })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}

            {/* Preserve metadata */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="preserve-meta" className="text-sm">Preserve metadata</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keep EXIF, author, and document properties
                </p>
              </div>
              <Switch
                id="preserve-meta"
                checked={options.preserveMetadata}
                onCheckedChange={(v) => onChange({ ...options, preserveMetadata: v })}
              />
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Status card ──────────────────────────────────────────────────────────────

function StatusCard({ state }: { state: ConversionState }) {
  const { stage, uploadPct, job, downloadUrl, error } = state;
  if (stage === 'idle') return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {stage === 'uploading'  && <><Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Uploading…</>}
          {stage === 'processing' && <><Loader2 className="h-4 w-4 animate-spin text-purple-500" /> Converting…</>}
          {stage === 'completed'  && <><CheckCircle className="h-4 w-4 text-green-500" /> Done!</>}
          {stage === 'error'      && <><AlertCircle className="h-4 w-4 text-destructive" /> Failed</>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stage === 'uploading' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Uploading…</span><span>{uploadPct}%</span>
            </div>
            <Progress value={uploadPct} className="h-2" />
          </div>
        )}

        {stage === 'processing' && job && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing…</span><span>{job.progress ?? 0}%</span>
              </div>
              <Progress value={job.progress ?? 0} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-muted-foreground mb-0.5">Job ID</div>
                <code className="font-mono truncate block">{job.id.slice(0, 16)}…</code>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-muted-foreground mb-0.5">Status</div>
                <Badge variant="outline" className="text-xs capitalize">{job.status}</Badge>
              </div>
            </div>
          </div>
        )}

        {stage === 'completed' && downloadUrl && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-green-800 dark:text-green-300">File ready</p>
                {job && <p className="text-green-700 dark:text-green-400">{job.sourceFormat.toUpperCase()} → {job.targetFormat.toUpperCase()}</p>}
              </div>
            </div>
            <Button className="w-full gap-2" asChild>
              <a href={downloadUrl} download><Download className="h-4 w-4" /> Download converted file</a>
            </Button>
          </div>
        )}

        {stage === 'error' && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function ConvertContent() {
  const searchParams = useSearchParams();
  const presetFrom = searchParams.get('from')?.toUpperCase() ?? '';
  const presetTo   = searchParams.get('to')?.toUpperCase() ?? '';

  const [file, setFile]         = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>(presetTo);
  const [options, setOptions]   = useState<ConversionOptions>({ quality: 85, preserveMetadata: true });
  const [state, setState]       = useState<ConversionState>({
    stage: 'idle', uploadPct: 0, job: null, downloadUrl: null, error: null,
  });

  const sourceExt    = file ? extOf(file.name) : presetFrom;
  const targetFormats = sourceExt ? getTargetFormats(sourceExt) : [];

  useEffect(() => {
    if (targetFormat && targetFormats.length > 0 && !targetFormats.includes(targetFormat)) {
      setTargetFormat('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceExt]);

  const handleClear = () => {
    setFile(null);
    setTargetFormat('');
    setState({ stage: 'idle', uploadPct: 0, job: null, downloadUrl: null, error: null });
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;

    setState({ stage: 'uploading', uploadPct: 0, job: null, downloadUrl: null, error: null });
    const toastId = toast.loading('Uploading file…');

    try {
      // 1 — request presigned URL
      const { uploadId, presignedUrl, fields } = await uploads.requestPresignedUrl(
        file.name, file.type || 'application/octet-stream', file.size,
      );

      // 2 — upload to S3
      await uploads.uploadToStorage(presignedUrl, file, fields, (pct) => {
        setState((s) => ({ ...s, uploadPct: pct }));
      });

      // 3 — confirm
      await uploads.confirmUpload(uploadId);

      toast.loading('Converting…', { id: toastId });
      setState((s) => ({ ...s, stage: 'processing', uploadPct: 100 }));

      // 4 — submit conversion with options
      const { jobId } = await conversions.submit({
        sourceFileId: uploadId,
        targetFormat: targetFormat.toLowerCase(),
        options: {
          quality: options.quality,
          preserveMetadata: options.preserveMetadata,
        },
      });

      // 5 — poll
      const finalJob = await conversions.poll(jobId, {
        intervalMs: 2_000,
        timeoutMs: 300_000,
        onProgress: (j) => setState((s) => ({ ...s, job: j })),
      });

      if (finalJob.status === 'completed' && finalJob.resultFileId) {
        const { url } = await uploads.getDownloadUrl(finalJob.resultFileId);
        setState({ stage: 'completed', uploadPct: 100, job: finalJob, downloadUrl: url, error: null });
        toast.success(`Converted to ${targetFormat} — ready to download!`, { id: toastId });
      } else {
        const msg = finalJob.errorMessage ?? 'Conversion failed. Please try again.';
        setState({ stage: 'error', uploadPct: 0, job: finalJob, downloadUrl: null, error: msg });
        toast.error(msg, { id: toastId });
      }
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : (err as Error).message ?? 'Unexpected error.';
      setState({ stage: 'error', uploadPct: 0, job: null, downloadUrl: null, error: msg });
      toast.error(msg, { id: toastId });
    }
  };

  const isConverting = state.stage === 'uploading' || state.stage === 'processing';
  const canConvert   = !!file && !!targetFormat && !isConverting;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-14 border-b bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">Free converter</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Convert Your Files</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any file, choose your output format, and download in seconds.
            2,000+ conversion types supported.
          </p>
        </div>
      </section>

      {/* Converter */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">

            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</div>
                <span className="font-medium">Select your file</span>
              </div>
              <DropZone
                file={file}
                onFile={(f) => {
                  setFile(f);
                  setState({ stage: 'idle', uploadPct: 0, job: null, downloadUrl: null, error: null });
                }}
                onClear={handleClear}
              />
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold
                  ${sourceExt ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <span className={`font-medium ${!sourceExt ? 'text-muted-foreground' : ''}`}>
                  Choose output format
                </span>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 h-10 rounded-md border bg-muted text-sm font-mono font-semibold min-w-[100px] justify-center">
                  {sourceExt || <span className="text-muted-foreground text-xs">source</span>}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <Select
                  value={targetFormat}
                  onValueChange={setTargetFormat}
                  disabled={!sourceExt || targetFormats.length === 0}
                >
                  <SelectTrigger className="flex-1 h-10 font-mono font-semibold">
                    <SelectValue placeholder={
                      !sourceExt ? 'Upload a file first'
                      : targetFormats.length === 0 ? 'No conversions available'
                      : 'Select format…'
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {targetFormats.map((fmt) => (
                      <SelectItem key={fmt} value={fmt} className="font-mono">{fmt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {sourceExt && targetFormats.length > 0 && (
                <p className="text-xs text-muted-foreground pl-0.5">
                  {targetFormats.length} output formats available for{' '}
                  <span className="font-mono font-semibold">{sourceExt}</span>
                </p>
              )}

              {/* Options panel — shown only when a target is selected */}
              {targetFormat && (
                <OptionsPanel
                  options={options}
                  onChange={setOptions}
                  targetFormat={targetFormat}
                />
              )}
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold
                  ${canConvert ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  3
                </div>
                <span className={`font-medium ${!canConvert && !isConverting ? 'text-muted-foreground' : ''}`}>
                  Convert &amp; download
                </span>
              </div>

              <Button
                className="w-full h-12 text-base gap-2"
                disabled={!canConvert || isConverting}
                onClick={handleConvert}
              >
                {isConverting
                  ? <><Loader2 className="h-5 w-5 animate-spin" />{state.stage === 'uploading' ? 'Uploading…' : 'Converting…'}</>
                  : <><Zap className="h-5 w-5" />{targetFormat ? `Convert to ${targetFormat}` : 'Convert'}</>}
              </Button>

              {state.stage === 'error' && (
                <Button variant="outline" className="w-full gap-2"
                  onClick={() => setState({ stage: 'idle', uploadPct: 0, job: null, downloadUrl: null, error: null })}>
                  <RefreshCw className="h-4 w-4" /> Try again
                </Button>
              )}
            </div>

            <StatusCard state={state} />

            {state.stage === 'idle' && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-4 py-3">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Free plan: 50 conversions/month, max 10 MB per file.{' '}
                  <Link href="/pricing" className="text-primary hover:underline">Upgrade for higher limits.</Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: '🔒', title: 'Secure', desc: 'Files deleted after 24 hours' },
              { icon: '⚡', title: 'Fast',   desc: 'Average under 5 seconds' },
              { icon: '🌐', title: 'Any format', desc: '2,000+ supported' },
            ].map((f) => (
              <div key={f.title} className="space-y-1.5">
                <div className="text-2xl">{f.icon}</div>
                <div className="font-semibold text-sm">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ConvertPage() {
  return (
    <Suspense>
      <TooltipProvider>
        <ConvertContent />
      </TooltipProvider>
    </Suspense>
  );
}
