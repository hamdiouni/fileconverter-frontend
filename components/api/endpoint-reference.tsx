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
        path: '/api/v1/uploads',
        description: 'Initiate file upload and request a secure presigned URL',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X POST https://api.fileconverterpro.com/api/v1/uploads \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "filename": "document.pdf",
    "contentType": "application/pdf",
    "fileSize": 1048576
  }'`,
          python: `import requests

url = "https://api.fileconverterpro.com/api/v1/uploads"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "filename": "document.pdf",
    "contentType": "application/pdf",
    "fileSize": 1048576
}

response = requests.post(url, headers=headers, json=data)
upload_info = response.json()
print("Upload URL:", upload_info["uploadUrl"])`,
          nodejs: `fetch('https://api.fileconverterpro.com/api/v1/uploads', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    filename: 'document.pdf',
    contentType: 'application/pdf',
    fileSize: 1048576
  })
})
.then(response => response.json())
.then(data => console.log('Upload details:', data));`
        }
      },
      {
        method: 'GET',
        path: '/api/v1/uploads/{id}',
        description: 'Retrieve uploaded file metadata and scanning status',
        auth: 'Required',
        rateLimit: '1000/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/api/v1/uploads/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = f"https://api.fileconverterpro.com/api/v1/uploads/{file_id}"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
          nodejs: `fetch(\`https://api.fileconverterpro.com/api/v1/uploads/\${file_id}\`, {
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
        path: '/api/v1/uploads/{id}',
        description: 'Permanently delete an uploaded file from storage',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X DELETE https://api.fileconverterpro.com/api/v1/uploads/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = f"https://api.fileconverterpro.com/api/v1/uploads/{file_id}"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.delete(url, headers=headers)
print(response.status_code)`,
          nodejs: `fetch(\`https://api.fileconverterpro.com/api/v1/uploads/\${file_id}\`, {
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
        path: '/api/v1/conversions',
        description: 'Queue a file conversion job for processing',
        auth: 'Required',
        rateLimit: '50/hour',
        examples: {
          curl: `curl -X POST https://api.fileconverterpro.com/api/v1/conversions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sourceFileId": "SOURCE_FILE_ID",
    "targetFormat": "docx",
    "options": {
      "quality": "high"
    }
  }'`,
          python: `import requests

url = "https://api.fileconverterpro.com/api/v1/conversions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "sourceFileId": source_file_id,
    "targetFormat": "docx",
    "options": {
        "quality": "high"
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/api/v1/conversions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sourceFileId: source_file_id,
    targetFormat: 'docx',
    options: {
      quality: 'high'
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      },
      {
        method: 'GET',
        path: '/api/v1/conversions/{id}',
        description: 'Get conversion status, progress, and result download info',
        auth: 'Required',
        rateLimit: '1000/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/api/v1/conversions/JOB_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = f"https://api.fileconverterpro.com/api/v1/conversions/{job_id}"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
          nodejs: `fetch(\`https://api.fileconverterpro.com/api/v1/conversions/\${job_id}\`, {
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
        path: '/api/v1/conversions',
        description: 'List user conversion jobs with optional status filter and pagination',
        auth: 'Required',
        rateLimit: '200/hour',
        examples: {
          curl: `curl -X GET "https://api.fileconverterpro.com/api/v1/conversions?status=completed&page=1&pageSize=20" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = "https://api.fileconverterpro.com/api/v1/conversions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
params = {"status": "completed", "page": 1, "pageSize": 20}

response = requests.get(url, headers=headers, params=params)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/api/v1/conversions?status=completed&page=1&pageSize=20', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
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
        path: '/api/v1/users/me',
        description: 'Get authenticated user profile and subscription tier',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/api/v1/users/me \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = "https://api.fileconverterpro.com/api/v1/users/me"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/api/v1/users/me', {
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
        path: '/api/v1/users/me/usage',
        description: 'Get current period conversion and quota usage statistics',
        auth: 'Required',
        rateLimit: '100/hour',
        examples: {
          curl: `curl -X GET https://api.fileconverterpro.com/api/v1/users/me/usage \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          python: `import requests

url = "https://api.fileconverterpro.com/api/v1/users/me/usage"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
          nodejs: `fetch('https://api.fileconverterpro.com/api/v1/users/me/usage', {
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
