'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const endpoints = [
  {
    category: 'File Management',
    endpoints: [
      {
        method: 'POST',
        path: '/upload',
        description: 'Upload a file for conversion',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X POST https://api.fileconverterpro.com/v1/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@document.pdf" \\
  -F "metadata={\\"name\\": \\"My Document\\"}"`,
          python: `import requests

url = "https://api.fileconverterpro.com/v1/upload"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
files = {"file": open("document.pdf", "rb")}
data = {"metadata": '{"name": "My Document"}'}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`,
          nodejs: `const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('file', fs.createReadStream('document.pdf'));
form.append('metadata', JSON.stringify({name: 'My Document'}));

fetch('https://api.fileconverterpro.com/v1/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    ...form.getHeaders()
  },
  body: form
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      },
      {
        method: 'GET',
        path: '/files/{file_id}',
        description: 'Get file information and metadata',
        auth: 'Required',
        rateLimit: '1000/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/v1/files/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = f"https://api.fileconverterpro.com/v1/files/{file_id}"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
          nodejs: `fetch(\`https://api.fileconverterpro.com/v1/files/\${file_id}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      },
      {
        method: 'DELETE',
        path: '/files/{file_id}',
        description: 'Delete a file from the system',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X DELETE https://api.fileconverterpro.com/v1/files/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = f"https://api.fileconverterpro.com/v1/files/{file_id}"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.delete(url, headers=headers)
print(response.status_code)`,
          nodejs: `fetch(\`https://api.fileconverterpro.com/v1/files/\${file_id}\`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => console.log(response.status));`
        }
      }
    ]
  },
  {
    category: 'Conversions',
    endpoints: [
      {
        method: 'POST',
        path: '/convert',
        description: 'Convert a file to a different format',
        auth: 'Required',
        rateLimit: '50/hour',
        examples: {
          curl: `curl -X POST https://api.fileconverterpro.com/v1/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "file_id": "FILE_ID",
    "output_format": "docx",
    "options": {
      "quality": "high",
      "ocr": true
    }
  }'`,
          python: `import requests

url = "https://api.fileconverterpro.com/v1/convert"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
data = {
    "file_id": file_id,
    "output_format": "docx",
    "options": {
        "quality": "high",
        "ocr": True
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/v1/convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    file_id: file_id,
    output_format: 'docx',
    options: {
      quality: 'high',
      ocr: true
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      },
      {
        method: 'GET',
        path: '/conversions/{conversion_id}',
        description: 'Get conversion status and download link',
        auth: 'Required',
        rateLimit: '1000/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/v1/conversions/CONVERSION_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = f"https://api.fileconverterpro.com/v1/conversions/{conversion_id}"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
          nodejs: `fetch(\`https://api.fileconverterpro.com/v1/conversions/\${conversion_id}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      },
      {
        method: 'POST',
        path: '/convert/batch',
        description: 'Convert multiple files in batch',
        auth: 'Required',
        rateLimit: '10/hour',
        examples: {
          curl: `curl -X POST https://api.fileconverterpro.com/v1/convert/batch \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversions": [
      {
        "file_id": "FILE_ID_1",
        "output_format": "pdf"
      },
      {
        "file_id": "FILE_ID_2",
        "output_format": "docx"
      }
    ]
  }'`,
          python: `import requests

url = "https://api.fileconverterpro.com/v1/convert/batch"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
data = {
    "conversions": [
        {"file_id": file_id_1, "output_format": "pdf"},
        {"file_id": file_id_2, "output_format": "docx"}
    ]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/v1/convert/batch', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    conversions: [
      {file_id: file_id_1, output_format: 'pdf'},
      {file_id: file_id_2, output_format: 'docx'}
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      }
    ]
  },
  {
    category: 'Account & Usage',
    endpoints: [
      {
        method: 'GET',
        path: '/account',
        description: 'Get account information and limits',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/v1/account \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = "https://api.fileconverterpro.com/v1/account"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/v1/account', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      },
      {
        method: 'GET',
        path: '/usage',
        description: 'Get API usage statistics',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/v1/usage?period=month \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = "https://api.fileconverterpro.com/v1/usage"
params = {"period": "month"}
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers, params=params)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/v1/usage?period=month', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      }
    ]
  }
];

export function EndpointReference() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'POST': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'PUT': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            API Endpoint Reference
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Complete reference for all available API endpoints. 
            Each endpoint includes examples in multiple programming languages.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {endpoints.map((category) => (
            <div key={category.category} className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">
                {category.category}
              </h3>
              
              <div className="space-y-6">
                {category.endpoints.map((endpoint, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-muted/30">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Badge className={`px-3 py-1 text-sm font-mono border ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-lg font-mono bg-background px-3 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Auth: {endpoint.auth}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {endpoint.rateLimit}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {endpoint.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                      <Tabs defaultValue="curl" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
                          <TabsTrigger value="curl" className="rounded-none">cURL</TabsTrigger>
                          <TabsTrigger value="python" className="rounded-none">Python</TabsTrigger>
                          <TabsTrigger value="nodejs" className="rounded-none">Node.js</TabsTrigger>
                        </TabsList>

                        <TabsContent value="curl" className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">cURL Example</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(endpoint.examples.curl, `curl-${index}`)}
                            >
                              {copied === `curl-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{endpoint.examples.curl}</code>
                          </pre>
                        </TabsContent>

                        <TabsContent value="python" className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Python Example</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(endpoint.examples.python, `python-${index}`)}
                            >
                              {copied === `python-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{endpoint.examples.python}</code>
                          </pre>
                        </TabsContent>

                        <TabsContent value="nodejs" className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Node.js Example</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(endpoint.examples.nodejs, `nodejs-${index}`)}
                            >
                              {copied === `nodejs-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{endpoint.examples.nodejs}</code>
                          </pre>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold mb-4">
                Need More Examples?
              </h3>
              <p className="text-muted-foreground mb-6">
                Check out our comprehensive API documentation with more examples, 
                error handling, and best practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/api/examples">
                    View More Examples
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/fileconverterpro/api-examples" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    GitHub Examples
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
