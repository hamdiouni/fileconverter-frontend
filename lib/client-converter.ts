/**
 * Client-Side Instant Conversion Engine
 *
 * Provides immediate in-browser conversions using HTML5 Canvas and browser Web APIs.
 * This runs locally on the user's device, ensuring that:
 * 1. Image conversions (PNG, JPG, WEBP, BMP, SVG, ICO) work instantly without server roundtrips.
 * 2. Conversions work out-of-the-box on Vercel deployments even without a remote backend deployed.
 * 3. Guest users never get blocked or forced to log in for common conversions.
 * 4. Offline mode / mobile devices work seamlessly.
 */

export interface ClientConversionResult {
  blob: Blob;
  filename: string;
  url: string;
  sourceFormat: string;
  targetFormat: string;
  isClientSide: true;
}

export interface ClientConversionOptions {
  quality?: number; // 1 - 100
  preserveMetadata?: boolean;
}

import { jsPDF } from 'jspdf';
import { createZipBlob } from './archive-helper';

const SUPPORTED_IMAGE_FORMATS = new Set(['png', 'jpg', 'jpeg', 'webp', 'bmp', 'ico', 'svg', 'gif']);
const TARGET_IMAGE_FORMATS = new Set(['png', 'jpg', 'jpeg', 'webp', 'bmp', 'ico', 'pdf', 'zip']);

const SUPPORTED_DATA_PAIRS = new Set([
  'json:csv',
  'csv:json',
  'md:html',
  'markdown:html',
  'html:txt',
  'txt:base64',
  'base64:txt',
]);

/**
 * Check whether a conversion between two format extensions can be handled directly in the browser.
 */
export function canConvertClientSide(sourceExt: string, targetExt: string): boolean {
  const s = sourceExt.toLowerCase().trim();
  const t = targetExt.toLowerCase().trim();

  if (s === t) return true;

  // Any file can be converted/compressed into a ZIP archive
  if (t === 'zip') {
    return true;
  }

  // Images to supported image targets (including PDF)
  if (SUPPORTED_IMAGE_FORMATS.has(s) && TARGET_IMAGE_FORMATS.has(t)) {
    return true;
  }

  // Data / Text conversions
  if (SUPPORTED_DATA_PAIRS.has(`${s}:${t}`)) {
    return true;
  }

  return false;
}

/**
 * Execute client-side file conversion.
 */
export async function convertClientSide(
  file: File,
  targetFormat: string,
  options: ClientConversionOptions = {},
): Promise<ClientConversionResult> {
  const sourceExt = file.name.split('.').pop()?.toLowerCase() ?? '';
  const targetExt = targetFormat.toLowerCase().trim();
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const outputFilename = `${baseName}.${targetExt}`;

  // ── Any File to ZIP Archive ────────────────────────────────────────────────────
  if (targetExt === 'zip') {
    const arrayBuffer = await file.arrayBuffer();
    const blob = await createZipBlob([
      {
        name: file.name,
        data: new Uint8Array(arrayBuffer),
        date: new Date(),
      },
    ]);
    const url = URL.createObjectURL(blob);
    return {
      blob,
      filename: outputFilename,
      url,
      sourceFormat: sourceExt,
      targetFormat: targetExt,
      isClientSide: true,
    };
  }

  // ── Image to PDF Conversion (100% valid PDF 1.4 document) ──────────────────────
  if (SUPPORTED_IMAGE_FORMATS.has(sourceExt) && targetExt === 'pdf') {
    const blob = await convertImageToPdf(file);
    const url = URL.createObjectURL(blob);
    return {
      blob,
      filename: outputFilename,
      url,
      sourceFormat: sourceExt,
      targetFormat: targetExt,
      isClientSide: true,
    };
  }

  // ── Image Conversions via HTML5 Canvas ─────────────────────────────────────────
  if (SUPPORTED_IMAGE_FORMATS.has(sourceExt) && TARGET_IMAGE_FORMATS.has(targetExt)) {
    const blob = await convertImageViaCanvas(file, targetExt, options.quality ?? 85);
    const url = URL.createObjectURL(blob);
    return {
      blob,
      filename: outputFilename,
      url,
      sourceFormat: sourceExt,
      targetFormat: targetExt,
      isClientSide: true,
    };
  }

  // ── JSON to CSV ────────────────────────────────────────────────────────────────
  if (sourceExt === 'json' && targetExt === 'csv') {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    if (rows.length === 0) throw new Error('JSON array is empty.');

    const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
    const csvLines = [headers.join(',')];

    for (const row of rows) {
      const line = headers.map((h) => {
        const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvLines.push(line.join(','));
    }

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    return {
      blob,
      filename: outputFilename,
      url: URL.createObjectURL(blob),
      sourceFormat: 'json',
      targetFormat: 'csv',
      isClientSide: true,
    };
  }

  // ── CSV to JSON ────────────────────────────────────────────────────────────────
  if (sourceExt === 'csv' && targetExt === 'json') {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) throw new Error('CSV is empty.');

    const headers = parseCsvLine(lines[0]);
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] ?? '';
      });
      data.push(obj);
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    return {
      blob,
      filename: outputFilename,
      url: URL.createObjectURL(blob),
      sourceFormat: 'csv',
      targetFormat: 'json',
      isClientSide: true,
    };
  }

  // ── Markdown to HTML ───────────────────────────────────────────────────────────
  if ((sourceExt === 'md' || sourceExt === 'markdown') && targetExt === 'html') {
    const text = await file.text();
    const html = markdownToHtml(text);
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${baseName}</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6}</style></head><body>${html}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    return {
      blob,
      filename: outputFilename,
      url: URL.createObjectURL(blob),
      sourceFormat: sourceExt,
      targetFormat: 'html',
      isClientSide: true,
    };
  }

  // ── HTML to Plain Text ────────────────────────────────────────────────────────
  if (sourceExt === 'html' && targetExt === 'txt') {
    const text = await file.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const plainText = doc.body.textContent || '';
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8;' });
    return {
      blob,
      filename: outputFilename,
      url: URL.createObjectURL(blob),
      sourceFormat: 'html',
      targetFormat: 'txt',
      isClientSide: true,
    };
  }

  // ── TXT to Base64 ──────────────────────────────────────────────────────────────
  if (sourceExt === 'txt' && targetExt === 'base64') {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(binary);
    const blob = new Blob([b64], { type: 'text/plain;charset=utf-8;' });
    return {
      blob,
      filename: outputFilename,
      url: URL.createObjectURL(blob),
      sourceFormat: 'txt',
      targetFormat: 'base64',
      isClientSide: true,
    };
  }

  // ── Base64 to TXT ──────────────────────────────────────────────────────────────
  if (sourceExt === 'base64' && targetExt === 'txt') {
    const b64 = await file.text();
    const decoded = atob(b64.trim());
    const blob = new Blob([decoded], { type: 'text/plain;charset=utf-8;' });
    return {
      blob,
      filename: outputFilename,
      url: URL.createObjectURL(blob),
      sourceFormat: 'base64',
      targetFormat: 'txt',
      isClientSide: true,
    };
  }

  throw new Error(`Direct browser conversion from .${sourceExt} to .${targetExt} is not supported. Please ensure backend services are running.`);
}

/**
 * Convert images using HTML5 Canvas.
 */
function convertImageViaCanvas(file: File, targetExt: string, qualityPct: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context is not available.'));
          return;
        }

        const isJpg = targetExt === 'jpg' || targetExt === 'jpeg';

        // JPEG has no alpha channel; render white background for transparency
        if (isJpg) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        let mimeType = 'image/png';
        if (isJpg) mimeType = 'image/jpeg';
        else if (targetExt === 'webp') mimeType = 'image/webp';
        else if (targetExt === 'bmp') mimeType = 'image/bmp';
        else if (targetExt === 'ico') mimeType = 'image/x-icon';

        const quality = Math.min(Math.max(qualityPct / 100, 0.1), 1.0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Fallback for types not natively exported by toBlob
              try {
                const dataUrl = canvas.toDataURL(mimeType, quality);
                const byteString = atob(dataUrl.split(',')[1]);
                const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                resolve(new Blob([ab], { type: mimeString }));
              } catch (e: any) {
                reject(new Error(`Failed to encode image to ${targetExt}: ${e.message}`));
              }
            }
          },
          mimeType,
          quality,
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load source image "${file.name}". Format may be corrupted or unreadable by the browser.`));
    };

    img.src = objectUrl;
  });
}

function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let curr = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        curr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(curr.trim());
      curr = '';
    } else {
      curr += char;
    }
  }
  result.push(curr.trim());
  return result;
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br />');
}

/**
 * Converts an image file (PNG, JPG, WEBP, BMP, etc.) into a 100% standard PDF document.
 * This guarantees the PDF opens in Chrome, Adobe Acrobat, Edge, and macOS Preview.
 */
async function convertImageToPdf(file: File): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to decode image "${file.name}" for PDF creation.`));
    };
    img.src = objectUrl;
  });

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  // Draw to canvas to extract clean JPEG data stream
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Canvas 2D context unavailable.');
  }

  // White background for transparent PNGs so PDF doesn't render black
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(objectUrl);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

  // Standard PDF with dimensions matching image aspect ratio 1:1
  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling'],
  });

  pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height);
  return pdf.output('blob');
}

