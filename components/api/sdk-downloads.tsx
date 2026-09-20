'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Github, Star, Package, ExternalLink } from 'lucide-react';

const sdks = [
  {
    language: 'Node.js / TypeScript',
    package: '@fileconverter/sdk',
    version: '2.4.1',
    description: 'Official Node.js SDK with full TypeScript support, streaming uploads, and webhook helpers.',
    install: 'npm install @fileconverter/sdk',
    stars: '1.2k',
    color: 'bg-green-500/10 text-green-700',
    badge: 'Official',
    badgeColor: 'bg-green-100 text-green-800',
    docs: '#',
    github: '#',
    example: `import { FileConverterClient } from '@fileconverter/sdk';

const client = new FileConverterClient({
  apiKey: process.env.FILECONVERTER_API_KEY,
});

const result = await client.convert({
  file: fs.createReadStream('document.pdf'),
  targetFormat: 'docx',
});

await result.download('./output.docx');`,
  },
  {
    language: 'Python',
    package: 'fileconverter-sdk',
    version: '2.3.0',
    description: 'Python SDK with async support (asyncio), type hints, and automatic retry logic.',
    install: 'pip install fileconverter-sdk',
    stars: '890',
    color: 'bg-blue-500/10 text-blue-700',
    badge: 'Official',
    badgeColor: 'bg-blue-100 text-blue-800',
    docs: '#',
    github: '#',
    example: `from fileconverter import FileConverterClient

client = FileConverterClient(api_key="your_api_key")

result = client.convert(
    file=open("document.pdf", "rb"),
    target_format="docx",
)

result.download("output.docx")`,
  },
  {
    language: 'PHP',
    package: 'fileconverter/sdk',
    version: '1.8.2',
    description: 'PHP SDK compatible with Laravel and Symfony. PSR-18 HTTP client compatible.',
    install: 'composer require fileconverter/sdk',
    stars: '420',
    color: 'bg-purple-500/10 text-purple-700',
    badge: 'Official',
    badgeColor: 'bg-purple-100 text-purple-800',
    docs: '#',
    github: '#',
    example: `use FileConverter\\FileConverterClient;

$client = new FileConverterClient(['api_key' => 'your_api_key']);

$result = $client->convert([
    'file'          => fopen('document.pdf', 'r'),
    'target_format' => 'docx',
]);

$result->download('output.docx');`,
  },
  {
    language: 'Go',
    package: 'github.com/fileconverter/go-sdk',
    version: '1.2.0',
    description: 'Lightweight Go SDK with context support, retry logic, and zero non-stdlib dependencies.',
    install: 'go get github.com/fileconverter/go-sdk',
    stars: '310',
    color: 'bg-cyan-500/10 text-cyan-700',
    badge: 'Official',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    docs: '#',
    github: '#',
    example: `client := fileconverter.New(os.Getenv("FILECONVERTER_API_KEY"))

f, _ := os.Open("document.pdf")
result, err := client.Convert(ctx, &fileconverter.ConvertOptions{
    File:         f,
    TargetFormat: "docx",
})

result.Download(ctx, "output.docx")`,
  },
  {
    language: 'Ruby',
    package: 'fileconverter',
    version: '1.5.1',
    description: 'Ruby gem for FileConverter Pro. Supports Ruby 3.0+ with Faraday under the hood.',
    install: 'gem install fileconverter',
    stars: '195',
    color: 'bg-red-500/10 text-red-700',
    badge: 'Community',
    badgeColor: 'bg-orange-100 text-orange-800',
    docs: '#',
    github: '#',
    example: `require 'fileconverter'

client = FileConverter::Client.new(api_key: ENV['FILECONVERTER_API_KEY'])

result = client.convert(
  file: File.open('document.pdf'),
  target_format: 'docx'
)

result.download('output.docx')`,
  },
  {
    language: 'Java',
    package: 'com.fileconverter:sdk',
    version: '1.3.0',
    description: 'Java SDK for Spring Boot and Jakarta EE applications. Supports Java 11+.',
    install: 'implementation "com.fileconverter:sdk:1.3.0"',
    stars: '275',
    color: 'bg-orange-500/10 text-orange-700',
    badge: 'Official',
    badgeColor: 'bg-orange-100 text-orange-800',
    docs: '#',
    github: '#',
    example: `FileConverterClient client = FileConverterClient.builder()
    .apiKey(System.getenv("FILECONVERTER_API_KEY"))
    .build();

ConvertResult result = client.convert(ConvertRequest.builder()
    .file(new FileInputStream("document.pdf"))
    .targetFormat("docx")
    .build());

result.download(Path.of("output.docx"));`,
  },
];

export function SdkDownloads() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">SDKs & Libraries</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Official SDKs
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Native libraries for your preferred language. All SDKs are open-source,
            actively maintained, and include full TypeScript / type definitions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {sdks.map((sdk) => (
            <Card key={sdk.language} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sdk.color}`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{sdk.language}</CardTitle>
                      <code className="text-xs text-muted-foreground font-mono">{sdk.package}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sdk.badgeColor}`}>
                      {sdk.badge}
                    </span>
                    <Badge variant="outline" className="text-xs">v{sdk.version}</Badge>
                  </div>
                </div>
                <CardDescription className="text-sm mt-2">{sdk.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Install command */}
                <div className="bg-muted rounded-md p-3 flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-foreground truncate">{sdk.install}</code>
                </div>

                {/* Code example */}
                <div className="bg-slate-950 dark:bg-slate-900 rounded-md p-4 overflow-x-auto">
                  <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre">{sdk.example}</pre>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" asChild>
                    <a href={sdk.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3.5 w-3.5" />
                      GitHub
                      <div className="flex items-center gap-0.5 ml-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{sdk.stars}</span>
                      </div>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" asChild>
                    <a href={sdk.docs} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Docs
                    </a>
                  </Button>
                  <Button size="sm" className="flex-1 gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Install
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Postman collection */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-900">
            <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
              <Download className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Postman Collection</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import our pre-built Postman collection with all endpoints, example requests,
              and environment variables pre-configured.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Collection
              </Button>
              <Button className="gap-2" asChild>
                <a href="https://app.getpostman.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Run in Postman
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
