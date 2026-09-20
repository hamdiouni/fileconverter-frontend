'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Webhook, Shield, RefreshCw, CheckCircle, XCircle, Clock, Copy, Check } from 'lucide-react';

const events = [
  {
    name: 'conversion.completed',
    description: 'Fired when a conversion job finishes successfully. Includes the result file ID and download URL.',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'conversion.failed',
    description: 'Fired when a conversion job fails after all retry attempts. Includes error details.',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: 'conversion.processing',
    description: 'Fired when a queued job begins processing. Includes estimated completion time.',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: 'upload.completed',
    description: 'Fired after a file upload is confirmed and virus scanning completes.',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    name: 'upload.infected',
    description: 'Fired when an uploaded file is detected as malicious. File is automatically deleted.',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: 'subscription.changed',
    description: 'Fired when a user\'s subscription tier changes (upgrade, downgrade, or cancellation).',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
];

const payloadExample = `{
  "id": "evt_01J8K2M3N4P5Q6R7S8T9U0V",
  "type": "conversion.completed",
  "created": "2024-09-15T14:23:11Z",
  "data": {
    "jobId": "job_01J8K2M3N4P5Q6R7S8T9",
    "userId": "usr_01HXYZ123456789ABCDEF",
    "sourceFormat": "pdf",
    "targetFormat": "docx",
    "status": "completed",
    "resultFileId": "file_01J8K2ABC",
    "downloadUrl": "https://api.fileconverterpro.com/v1/uploads/file_01J8K2ABC/download",
    "downloadUrlExpiresAt": "2024-09-15T15:23:11Z",
    "processingTimeMs": 1842,
    "outputSizeBytes": 102400
  }
}`;

const verifyExample = `import crypto from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex'),
  );
}

// Express handler example
app.post('/webhooks/fileconverter', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-fileconverter-signature'] as string;

  if (!verifyWebhookSignature(req.body.toString(), sig, process.env.WEBHOOK_SECRET!)) {
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());

  switch (event.type) {
    case 'conversion.completed':
      await handleConversionCompleted(event.data);
      break;
    case 'conversion.failed':
      await handleConversionFailed(event.data);
      break;
  }

  res.json({ received: true });
});`;

const pythonVerifyExample = `import hmac, hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

# FastAPI handler example
@app.post("/webhooks/fileconverter")
async def handle_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("X-FileConverter-Signature", "")

    if not verify_webhook(body, sig, os.environ["WEBHOOK_SECRET"]):
        raise HTTPException(status_code=400, detail="Invalid signature")

    event = json.loads(body)

    if event["type"] == "conversion.completed":
        await handle_conversion_completed(event["data"])

    return {"received": True}`;

export function WebhookDocs() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Webhooks</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Webhook Notifications
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Receive real-time notifications when events occur in your account.
            Register a HTTPS endpoint and we&apos;ll deliver signed payloads instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Webhook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Instant Delivery</h3>
            <p className="text-sm text-muted-foreground">Webhooks fire within 500ms of the triggering event.</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">HMAC-SHA256 Signed</h3>
            <p className="text-sm text-muted-foreground">Every payload is signed. Verify authenticity before processing.</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Automatic Retry</h3>
            <p className="text-sm text-muted-foreground">Failed deliveries are retried up to 5 times with exponential back-off.</p>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Events table */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Supported Events
            </h3>
            <div className="space-y-3">
              {events.map((event) => (
                <Card key={event.name} className="p-4">
                  <div className="flex items-start gap-4">
                    <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${event.color} flex-shrink-0 mt-0.5`}>
                      {event.name}
                    </span>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Payload example */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Example Payload
            </h3>
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-700">
                <span className="text-xs text-slate-400 font-mono">conversion.completed</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-slate-400 hover:text-white"
                  onClick={() => copy(payloadExample, 'payload')}
                >
                  {copied === 'payload' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <pre className="bg-slate-950 text-slate-300 text-xs font-mono leading-relaxed p-4 overflow-x-auto">
                {payloadExample}
              </pre>
            </Card>
          </div>

          {/* Signature verification */}
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Verifying Signatures
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Every webhook request includes an{' '}
              <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">X-FileConverter-Signature</code>{' '}
              header containing an HMAC-SHA256 hex digest of the raw request body, signed with your webhook secret.
            </p>

            <Tabs defaultValue="node">
              <TabsList className="mb-4">
                <TabsTrigger value="node">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>

              <TabsContent value="node">
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-700">
                    <span className="text-xs text-slate-400 font-mono">webhook-handler.ts</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-slate-400 hover:text-white"
                      onClick={() => copy(verifyExample, 'node')}
                    >
                      {copied === 'node' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <pre className="bg-slate-950 text-slate-300 text-xs font-mono leading-relaxed p-4 overflow-x-auto">
                    {verifyExample}
                  </pre>
                </Card>
              </TabsContent>

              <TabsContent value="python">
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-700">
                    <span className="text-xs text-slate-400 font-mono">webhook_handler.py</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-slate-400 hover:text-white"
                      onClick={() => copy(pythonVerifyExample, 'python')}
                    >
                      {copied === 'python' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <pre className="bg-slate-950 text-slate-300 text-xs font-mono leading-relaxed p-4 overflow-x-auto">
                    {pythonVerifyExample}
                  </pre>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Retry schedule */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry Schedule
              </CardTitle>
              <CardDescription className="text-sm">
                When your endpoint returns a non-2xx status code or times out (&gt;10s), we retry delivery:
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-5 gap-3">
                {[
                  { attempt: '1st retry', delay: 'after 1s' },
                  { attempt: '2nd retry', delay: 'after 4s' },
                  { attempt: '3rd retry', delay: 'after 16s' },
                  { attempt: '4th retry', delay: 'after 64s' },
                  { attempt: '5th retry', delay: 'after 256s' },
                ].map((r) => (
                  <div key={r.attempt} className="text-center bg-muted rounded-lg p-3">
                    <div className="text-xs font-medium">{r.attempt}</div>
                    <div className="text-xs text-muted-foreground mt-1">{r.delay}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                After 5 failed attempts the event is marked <span className="text-red-600 font-medium">failed</span> and
                visible in the dashboard for manual replay.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
