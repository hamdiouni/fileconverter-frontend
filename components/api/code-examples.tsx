'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const examples = [
  {
    title: 'File Upload & Conversion',
    description: 'Complete workflow for uploading a file and converting it to a different format',
    difficulty: 'Beginner',
    category: 'Core Workflow',
    examples: {
      python: `import requests
import time

# Configuration
API_KEY = "your_api_key_here"
BASE_URL = "https://api.fileconverterpro.com/v1"

def upload_and_convert(input_file_path, output_format):
    # Step 1: Upload file
    upload_url = f"{BASE_URL}/upload"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    with open(input_file_path, "rb") as file:
        files = {"file": file}
        response = requests.post(upload_url, headers=headers, files=files)
    
    if response.status_code != 200:
        raise Exception(f"Upload failed: {response.text}")
    
    file_data = response.json()
    file_id = file_data["file_id"]
    print(f"File uploaded successfully. File ID: {file_id}")
    
    # Step 2: Start conversion
    convert_url = f"{BASE_URL}/convert"
    convert_data = {
        "file_id": file_id,
        "output_format": output_format,
        "options": {
            "quality": "high",
            "ocr": True
        }
    }
    
    response = requests.post(convert_url, headers=headers, json=convert_data)
    
    if response.status_code != 200:
        raise Exception(f"Conversion failed: {response.text}")
    
    conversion_data = response.json()
    conversion_id = conversion_data["conversion_id"]
    print(f"Conversion started. Conversion ID: {conversion_id}")
    
    # Step 3: Poll for completion
    while True:
        status_url = f"{BASE_URL}/conversions/{conversion_id}"
        response = requests.get(status_url, headers=headers)
        status_data = response.json()
        
        if status_data["status"] == "completed":
            download_url = status_data["download_url"]
            print(f"Conversion completed! Download URL: {download_url}")
            return download_url
        elif status_data["status"] == "failed":
            raise Exception(f"Conversion failed: {status_data.get('error', 'Unknown error')}")
        else:
            print(f"Status: {status_data['status']}, Progress: {status_data.get('progress', 0)}%")
            time.sleep(5)

# Usage example
try:
    download_url = upload_and_convert("document.pdf", "docx")
    print(f"Success! Download your file from: {download_url}")
except Exception as e:
    print(f"Error: {e}")`,
      
      nodejs: `const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.fileconverterpro.com/v1';

async function uploadAndConvert(inputFilePath, outputFormat) {
    try {
        // Step 1: Upload file
        const uploadUrl = \`\${BASE_URL}/upload\`;
        const form = new FormData();
        form.append('file', fs.createReadStream(inputFilePath));
        
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': \`Bearer \${API_KEY}\`,
                ...form.getHeaders()
            },
            body: form
        });
        
        if (!uploadResponse.ok) {
            throw new Error(\`Upload failed: \${uploadResponse.statusText}\`);
        }
        
        const fileData = await uploadResponse.json();
        const fileId = fileData.file_id;
        console.log(\`File uploaded successfully. File ID: \${fileId}\`);
        
        // Step 2: Start conversion
        const convertUrl = \`\${BASE_URL}/convert\`;
        const convertData = {
            file_id: fileId,
            output_format: outputFormat,
            options: {
                quality: 'high',
                ocr: true
            }
        };
        
        const convertResponse = await fetch(convertUrl, {
            method: 'POST',
            headers: {
                'Authorization': \`Bearer \${API_KEY}\`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(convertData)
        });
        
        if (!convertResponse.ok) {
            throw new Error(\`Conversion failed: \${convertResponse.statusText}\`);
        }
        
        const conversionData = await convertResponse.json();
        const conversionId = conversionData.conversion_id;
        console.log(\`Conversion started. Conversion ID: \${conversionId}\`);
        
        // Step 3: Poll for completion
        while (true) {
            const statusUrl = \`\${BASE_URL}/conversions/\${conversionId}\`;
            const statusResponse = await fetch(statusUrl, {
                headers: {
                    'Authorization': \`Bearer \${API_KEY}\`
                }
            });
            
            const statusData = await statusResponse.json();
            
            if (statusData.status === 'completed') {
                const downloadUrl = statusData.download_url;
                console.log(\`Conversion completed! Download URL: \${downloadUrl}\`);
                return downloadUrl;
            } else if (statusData.status === 'failed') {
                throw new Error(\`Conversion failed: \${statusData.error || 'Unknown error'}\`);
            } else {
                console.log(\`Status: \${statusData.status}, Progress: \${statusData.progress || 0}%\`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Usage example
uploadAndConvert('document.pdf', 'docx')
    .then(downloadUrl => {
        console.log(\`Success! Download your file from: \${downloadUrl}\`);
    })
    .catch(error => {
        console.error(\`Error: \${error}\`);
    });`,
      
      php: `<?php

// Configuration
$apiKey = 'your_api_key_here';
$baseUrl = 'https://api.fileconverterpro.com/v1';

function uploadAndConvert($inputFilePath, $outputFormat) {
    global $apiKey, $baseUrl;
    
    try {
        // Step 1: Upload file
        $uploadUrl = $baseUrl . '/upload';
        $headers = [
            'Authorization: Bearer ' . $apiKey
        ];
        
        $postData = [
            'file' => new CURLFile($inputFilePath)
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $uploadUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Upload failed: HTTP $httpCode");
        }
        
        $fileData = json_decode($response, true);
        $fileId = $fileData['file_id'];
        echo "File uploaded successfully. File ID: $fileId\\n";
        
        // Step 2: Start conversion
        $convertUrl = $baseUrl . '/convert';
        $convertData = [
            'file_id' => $fileId,
            'output_format' => $outputFormat,
            'options' => [
                'quality' => 'high',
                'ocr' => true
            ]
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $convertUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($convertData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge($headers, ['Content-Type: application/json']));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Conversion failed: HTTP $httpCode");
        }
        
        $conversionData = json_decode($response, true);
        $conversionId = $conversionData['conversion_id'];
        echo "Conversion started. Conversion ID: $conversionId\\n";
        
        // Step 3: Poll for completion
        while (true) {
            $statusUrl = $baseUrl . "/conversions/$conversionId";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $statusUrl);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode !== 200) {
                throw new Exception("Status check failed: HTTP $httpCode");
            }
            
            $statusData = json_decode($response, true);
            
            if ($statusData['status'] === 'completed') {
                $downloadUrl = $statusData['download_url'];
                echo "Conversion completed! Download URL: $downloadUrl\\n";
                return $downloadUrl;
            } elseif ($statusData['status'] === 'failed') {
                $error = $statusData['error'] ?? 'Unknown error';
                throw new Exception("Conversion failed: $error");
            } else {
                $progress = $statusData['progress'] ?? 0;
                echo "Status: {$statusData['status']}, Progress: {$progress}%\\n";
                sleep(5);
            }
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\\n";
        throw $e;
    }
}

// Usage example
try {
    $downloadUrl = uploadAndConvert('document.pdf', 'docx');
    echo "Success! Download your file from: $downloadUrl\\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}

?>`
    }
  },
  {
    title: 'Batch Processing',
    description: 'Convert multiple files simultaneously with progress tracking',
    difficulty: 'Intermediate',
    category: 'Advanced Features',
    examples: {
      python: `import requests
import asyncio
import aiohttp
from typing import List, Dict

class BatchConverter:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.fileconverterpro.com/v1"
        self.headers = {"Authorization": f"Bearer {api_key}"}
    
    async def upload_file(self, session: aiohttp.ClientSession, file_path: str) -> str:
        """Upload a single file and return file ID"""
        with open(file_path, "rb") as file:
            data = aiohttp.FormData()
            data.add_field('file', file, filename=file_path.split('/')[-1])
            
            async with session.post(f"{self.base_url}/upload", 
                                  headers=self.headers, 
                                  data=data) as response:
                if response.status != 200:
                    raise Exception(f"Upload failed for {file_path}")
                
                result = await response.json()
                return result["file_id"]
    
    async def start_conversion(self, session: aiohttp.ClientSession, 
                             file_id: str, output_format: str) -> str:
        """Start conversion for a single file and return conversion ID"""
        convert_data = {
            "file_id": file_id,
            "output_format": output_format,
            "options": {"quality": "medium"}
        }
        
        async with session.post(f"{self.base_url}/convert", 
                              headers={**self.headers, 'Content-Type': 'application/json'}, 
                              json=convert_data) as response:
            if response.status != 200:
                raise Exception(f"Conversion failed for file {file_id}")
            
            result = await response.json()
            return result["conversion_id"]
    
    async def monitor_conversion(self, session: aiohttp.ClientSession, 
                               conversion_id: str) -> Dict:
        """Monitor conversion progress and return result"""
        while True:
            async with session.get(f"{self.base_url}/conversions/{conversion_id}", 
                                 headers=self.headers) as response:
                if response.status != 200:
                    raise Exception(f"Status check failed for {conversion_id}")
                
                status_data = await response.json()
                
                if status_data["status"] == "completed":
                    return status_data
                elif status_data["status"] == "failed":
                    raise Exception(f"Conversion failed: {status_data.get('error', 'Unknown error')}")
                
                await asyncio.sleep(2)
    
    async def process_batch(self, files: List[Dict]) -> List[Dict]:
        """Process multiple files in parallel"""
        async with aiohttp.ClientSession() as session:
            # Upload all files
            upload_tasks = [
                self.upload_file(session, file_info["path"]) 
                for file_info in files
            ]
            file_ids = await asyncio.gather(*upload_tasks)
            
            # Start all conversions
            conversion_tasks = [
                self.start_conversion(session, file_id, file_info["output_format"])
                for file_id, file_info in zip(file_ids, files)
            ]
            conversion_ids = await asyncio.gather(*conversion_tasks)
            
            # Monitor all conversions
            monitor_tasks = [
                self.monitor_conversion(session, conv_id)
                for conv_id in conversion_ids
            ]
            results = await asyncio.gather(*monitor_tasks)
            
            return results

# Usage example
async def main():
    converter = BatchConverter("your_api_key_here")
    
    files_to_convert = [
        {"path": "document1.pdf", "output_format": "docx"},
        {"path": "image1.jpg", "output_format": "png"},
        {"path": "audio1.mp3", "output_format": "wav"}
    ]
    
    try:
        results = await converter.process_batch(files_to_convert)
        for i, result in enumerate(results):
            print(f"File {i+1} completed: {result['download_url']}")
    except Exception as e:
        print(f"Batch processing failed: {e}")

# Run the example
if __name__ == "__main__":
    asyncio.run(main())`,
      
      nodejs: `const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

class BatchConverter {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.fileconverterpro.com/v1';
        this.headers = { 'Authorization': \`Bearer \${apiKey}\` };
    }
    
    async uploadFile(filePath) {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        
        const response = await fetch(\`\${this.baseUrl}/upload\`, {
            method: 'POST',
            headers: {
                ...this.headers,
                ...form.getHeaders()
            },
            body: form
        });
        
        if (!response.ok) {
            throw new Error(\`Upload failed for \${filePath}\`);
        }
        
        const result = await response.json();
        return result.file_id;
    }
    
    async startConversion(fileId, outputFormat) {
        const convertData = {
            file_id: fileId,
            output_format: outputFormat,
            options: { quality: 'medium' }
        };
        
        const response = await fetch(\`\${this.baseUrl}/convert\`, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(convertData)
        });
        
        if (!response.ok) {
            throw new Error(\`Conversion failed for file \${fileId}\`);
        }
        
        const result = await response.json();
        return result.conversion_id;
    }
    
    async monitorConversion(conversionId) {
        while (true) {
            const response = await fetch(\`\${this.baseUrl}/conversions/\${conversionId}\`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(\`Status check failed for \${conversionId}\`);
            }
            
            const statusData = await response.json();
            
            if (statusData.status === 'completed') {
                return statusData;
            } else if (statusData.status === 'failed') {
                throw new Error(\`Conversion failed: \${statusData.error || 'Unknown error'}\`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    async processBatch(files) {
        try {
            // Upload all files
            const uploadPromises = files.map(fileInfo => 
                this.uploadFile(fileInfo.path)
            );
            const fileIds = await Promise.all(uploadPromises);
            
            // Start all conversions
            const conversionPromises = files.map((fileInfo, index) => 
                this.startConversion(fileIds[index], fileInfo.outputFormat)
            );
            const conversionIds = await Promise.all(conversionPromises);
            
            // Monitor all conversions
            const monitorPromises = conversionIds.map(convId => 
                this.monitorConversion(convId)
            );
            const results = await Promise.all(monitorPromises);
            
            return results;
        } catch (error) {
            throw new Error(\`Batch processing failed: \${error.message}\`);
        }
    }
}

// Usage example
async function main() {
    const converter = new BatchConverter('your_api_key_here');
    
    const filesToConvert = [
        { path: 'document1.pdf', outputFormat: 'docx' },
        { path: 'image1.jpg', outputFormat: 'png' },
        { path: 'audio1.mp3', outputFormat: 'wav' }
    ];
    
    try {
        const results = await converter.processBatch(filesToConvert);
        results.forEach((result, index) => {
            console.log(\`File \${index + 1} completed: \${result.download_url}\`);
        });
    } catch (error) {
        console.error(\`Batch processing failed: \${error.message}\`);
    }
}

main();`,
      
      php: `<?php

class BatchConverter {
    private $apiKey;
    private $baseUrl;
    private $headers;
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
        $this->baseUrl = 'https://api.fileconverterpro.com/v1';
        $this->headers = ['Authorization: Bearer ' . $apiKey];
    }
    
    public function uploadFile($filePath) {
        $postData = ['file' => new CURLFile($filePath)];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/upload');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Upload failed for $filePath");
        }
        
        $result = json_decode($response, true);
        return $result['file_id'];
    }
    
    public function startConversion($fileId, $outputFormat) {
        $convertData = [
            'file_id' => $fileId,
            'output_format' => $outputFormat,
            'options' => ['quality' => 'medium']
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/convert');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($convertData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge($this->headers, ['Content-Type: application/json']));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Conversion failed for file $fileId");
        }
        
        $result = json_decode($response, true);
        return $result['conversion_id'];
    }
    
    public function monitorConversion($conversionId) {
        while (true) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this->baseUrl . "/conversions/$conversionId");
            curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode !== 200) {
                throw new Exception("Status check failed for $conversionId");
            }
            
            $statusData = json_decode($response, true);
            
            if ($statusData['status'] === 'completed') {
                return $statusData;
            } elseif ($statusData['status'] === 'failed') {
                $error = $statusData['error'] ?? 'Unknown error';
                throw new Exception("Conversion failed: $error");
            }
            
            sleep(2);
        }
    }
    
    public function processBatch($files) {
        try {
            // Upload all files
            $fileIds = [];
            foreach ($files as $fileInfo) {
                $fileIds[] = $this->uploadFile($fileInfo['path']);
            }
            
            // Start all conversions
            $conversionIds = [];
            foreach ($files as $index => $fileInfo) {
                $conversionIds[] = $this->startConversion($fileIds[$index], $fileInfo['outputFormat']);
            }
            
            // Monitor all conversions
            $results = [];
            foreach ($conversionIds as $convId) {
                $results[] = $this->monitorConversion($convId);
            }
            
            return $results;
        } catch (Exception $e) {
            throw new Exception("Batch processing failed: " . $e->getMessage());
        }
    }
}

// Usage example
try {
    $converter = new BatchConverter('your_api_key_here');
    
    $filesToConvert = [
        ['path' => 'document1.pdf', 'outputFormat' => 'docx'],
        ['path' => 'image1.jpg', 'outputFormat' => 'png'],
        ['path' => 'audio1.mp3', 'outputFormat' => 'wav']
    ];
    
    $results = $converter->processBatch($filesToConvert);
    
    foreach ($results as $index => $result) {
        echo "File " . ($index + 1) . " completed: " . $result['download_url'] . "\\n";
    }
} catch (Exception $e) {
    echo "Batch processing failed: " . $e->getMessage() . "\\n";
}

?>`
    }
  }
];

export function CodeExamples() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-600';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-600';
      case 'Advanced': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code Examples
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ready-to-use code examples in multiple programming languages. 
            Copy, customize, and integrate into your applications.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-12">
          {examples.map((example, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-background">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{example.title}</CardTitle>
                    <CardDescription className="text-base">
                      {example.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(example.difficulty)}>
                      {example.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {example.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs defaultValue="python" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
                    <TabsTrigger value="python" className="rounded-none">Python</TabsTrigger>
                    <TabsTrigger value="nodejs" className="rounded-none">Node.js</TabsTrigger>
                    <TabsTrigger value="php" className="rounded-none">PHP</TabsTrigger>
                  </TabsList>

                  <TabsContent value="python" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Python Example</span>
                        <Badge variant="outline" className="text-xs">Python 3.7+</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example.examples.python, `python-${index}`)}
                        >
                          {copied === `python-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(example.examples.python)}`} download={`${example.title.toLowerCase().replace(/\s+/g, '-')}-python.py`}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{example.examples.python}</code>
                    </pre>
                  </TabsContent>

                  <TabsContent value="nodejs" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Node.js Example</span>
                        <Badge variant="outline" className="text-xs">Node.js 14+</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example.examples.nodejs, `nodejs-${index}`)}
                        >
                          {copied === `nodejs-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(example.examples.nodejs)}`} download={`${example.title.toLowerCase().replace(/\s+/g, '-')}-nodejs.js`}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{example.examples.nodejs}</code>
                    </pre>
                  </TabsContent>

                  <TabsContent value="php" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">PHP Example</span>
                        <Badge variant="outline" className="text-xs">PHP 7.4+</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example.examples.php, `php-${index}`)}
                        >
                          {copied === `php-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(example.examples.php)}`} download={`${example.title.toLowerCase().replace(/\s+/g, '-')}-php.php`}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{example.examples.php}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
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
                Explore our comprehensive collection of code examples, 
                tutorials, and integration guides.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="https://github.com/fileconverterpro/api-examples" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    GitHub Repository
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/api/tutorials">
                    View Tutorials
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
