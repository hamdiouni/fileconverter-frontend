'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Lock, AlertTriangle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const authMethods = [
  {
    name: 'API Key',
    description: 'Simple and secure authentication using your unique API key',
    icon: Key,
    color: 'bg-blue-500/10 text-blue-600',
    recommended: true
  },
  {
    name: 'OAuth 2.0',
    description: 'Enterprise-grade authentication with refresh tokens and scopes',
    icon: Lock,
    color: 'bg-green-500/10 text-green-600',
    recommended: false
  },
  {
    name: 'JWT',
    description: 'Token-based authentication for custom integrations',
    icon: Shield,
    color: 'bg-purple-500/10 text-purple-600',
    recommended: false
  }
];

const securityFeatures = [
  'HTTPS encryption for all API calls',
  'API key rotation and management',
  'Rate limiting and abuse prevention',
  'IP whitelisting for enterprise customers',
  'Audit logging for compliance',
  'SOC 2 Type II & ISO 27001 certified'
];

export function AuthenticationDocs() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Authentication
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Secure your API calls with industry-standard authentication methods. 
            Choose the method that best fits your security requirements.
          </p>
        </div>

        {/* Authentication Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {authMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card key={index} className={`relative ${method.recommended ? 'border-primary shadow-lg' : ''}`}>
                {method.recommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Recommended
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${method.color} mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`#${method.name.toLowerCase().replace(' ', '-')}`}>
                      Learn More
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Documentation */}
        <Tabs defaultValue="api-key" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="api-key">API Key</TabsTrigger>
            <TabsTrigger value="oauth">OAuth 2.0</TabsTrigger>
            <TabsTrigger value="jwt">JWT</TabsTrigger>
          </TabsList>

          {/* API Key Tab */}
          <TabsContent value="api-key" className="space-y-8">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  API Key Authentication
                </CardTitle>
                <CardDescription>
                  The simplest way to authenticate your API requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">How it works</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Include your API key in the Authorization header of every request. 
                    Your API key is unique to your account and should be kept secure.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Example Request Header</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'header')}
                      >
                        {copied === 'header' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <code className="text-sm font-mono text-primary">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Getting Your API Key</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Sign up for a FileConverter Pro account</li>
                    <li>Navigate to your Dashboard → API Keys</li>
                    <li>Click "Generate New API Key"</li>
                    <li>Copy and securely store your key</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Security Best Practices</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Never expose your API key in client-side code</li>
                    <li>Rotate your API key regularly</li>
                    <li>Use environment variables to store keys</li>
                    <li>Monitor your API usage for suspicious activity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OAuth Tab */}
          <TabsContent value="oauth" className="space-y-8">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  OAuth 2.0 Authentication
                </CardTitle>
                <CardDescription>
                  Enterprise-grade authentication with fine-grained permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">OAuth 2.0 Flow</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    OAuth 2.0 provides secure, delegated access to your account with 
                    refresh tokens and configurable scopes for different permission levels.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Authorization URL</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('https://api.fileconverterpro.com/oauth/authorize', 'oauth')}
                      >
                        {copied === 'oauth' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <code className="text-sm font-mono text-primary">
                      https://api.fileconverterpro.com/oauth/authorize
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Available Scopes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge variant="outline">read:conversions</Badge>
                      <Badge variant="outline">write:conversions</Badge>
                      <Badge variant="outline">read:files</Badge>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">write:files</Badge>
                      <Badge variant="outline">read:analytics</Badge>
                      <Badge variant="outline">admin:users</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* JWT Tab */}
          <TabsContent value="jwt" className="space-y-8">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  JWT Authentication
                </CardTitle>
                <CardDescription>
                  Token-based authentication for custom integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">JWT Tokens</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    JSON Web Tokens provide stateless authentication with built-in 
                    expiration and payload verification capabilities.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">JWT Structure</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('header.payload.signature', 'jwt')}
                      >
                        {copied === 'jwt' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <code className="text-sm font-mono text-primary">
                      header.payload.signature
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Token Claims</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><strong>iss:</strong> Token issuer (FileConverter Pro)</li>
                    <li><strong>sub:</strong> Subject (your user ID)</li>
                    <li><strong>exp:</strong> Expiration time</li>
                    <li><strong>iat:</strong> Issued at time</li>
                    <li><strong>scope:</strong> Permission scopes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Security Features */}
        <div className="mt-16">
          <Card className="p-8 bg-background">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Features
              </CardTitle>
              <CardDescription>
                Enterprise-grade security measures to protect your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-yellow-50 border-yellow-200">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  <strong>Important:</strong> Never commit API keys to version control. Use environment variables or secure secret management.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
