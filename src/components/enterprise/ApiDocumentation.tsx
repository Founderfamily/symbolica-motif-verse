
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Code, 
  Key, 
  Zap, 
  Globe, 
  Download,
  Copy,
  CheckCircle,
  Terminal
} from 'lucide-react';
import { enterpriseApiService, ApiEndpoint } from '@/services/enterpriseApiService';

const ApiDocumentation: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const endpoints = enterpriseApiService.generateApiDocs();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCurlExample = (endpoint: ApiEndpoint) => {
    const baseUrl = 'https://api.symbolica.ai';
    const url = endpoint.path.replace('{id}', 'example-id-123');
    
    let curl = `curl -X ${endpoint.method} "${baseUrl}${url}"`;
    
    if (endpoint.requiresAuth) {
      curl += ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
    }
    
    curl += ` \\\n  -H "Content-Type: application/json"`;
    
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      curl += ` \\\n  -d '{"example": "data"}'`;
    }
    
    return curl;
  };

  const generatePythonExample = (endpoint: ApiEndpoint) => {
    const url = endpoint.path.replace('{id}', 'example-id-123');
    
    return `import requests

# Initialize SDK
from symbolica_sdk import SymbolicaClient

client = SymbolicaClient(api_key="YOUR_API_KEY")

# Method 1: Using SDK
${endpoint.method.toLowerCase() === 'get' ? 
  `response = client.${endpoint.path.split('/')[3] || 'get'}()` :
  `response = client.${endpoint.path.split('/')[3] || 'post'}(data={"example": "data"})`
}

# Method 2: Direct API call
headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.${endpoint.method.toLowerCase()}(
    "https://api.symbolica.ai${url}",
    headers=headers
)

print(response.json())`;
  };

  const generateJavaScriptExample = (endpoint: ApiEndpoint) => {
    const url = endpoint.path.replace('{id}', 'example-id-123');
    
    return `// Using Symbolica SDK
import { SymbolicaClient } from '@symbolica/sdk';

const client = new SymbolicaClient({
  apiKey: 'YOUR_API_KEY'
});

// SDK method
const response = await client.${endpoint.path.split('/')[3] || 'get'}();

// Or direct fetch
const response = await fetch('https://api.symbolica.ai${url}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }${endpoint.method !== 'GET' ? `,\n  body: JSON.stringify({ example: 'data' })` : ''}
});

const data = await response.json();
console.log(data);`;
  };

  const methodColors = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
          <p className="text-slate-600 mt-2">
            Enterprise-grade API for cultural symbol analysis and research
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50">
            v1.0
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            REST API
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="testing">API Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="h-6 w-6 text-blue-500" />
                  <h3 className="font-semibold">Base URL</h3>
                </div>
                <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                  https://api.symbolica.ai
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Key className="h-6 w-6 text-green-500" />
                  <h3 className="font-semibold">Authentication</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Bearer token in Authorization header
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="h-6 w-6 text-purple-500" />
                  <h3 className="font-semibold">Rate Limits</h3>
                </div>
                <p className="text-sm text-slate-600">
                  1000 requests/minute for standard tier
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Get your API key</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Generate an API key from your dashboard
                </p>
                <Button size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Generate API Key
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Make your first request</h4>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400"># Fetch all Celtic symbols</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(`curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  "https://api.symbolica.ai/api/v1/symbols?culture=Celtic"`)}
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code>
                    curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
                    &nbsp;&nbsp;"https://api.symbolica.ai/api/v1/symbols?culture=Celtic"
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Available Endpoints</h3>
              {endpoints.map((endpoint, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${selectedEndpoint === endpoint ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedEndpoint(endpoint)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={methodColors[endpoint.method]}>
                        {endpoint.method}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {endpoint.rateLimit}/min
                      </Badge>
                    </div>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                    <p className="text-xs text-slate-600 mt-2">{endpoint.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedEndpoint && (
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={methodColors[selectedEndpoint.method]}>
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg">{selectedEndpoint.path}</code>
                    </CardTitle>
                    <p className="text-slate-600">{selectedEndpoint.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Parameters</h4>
                      <div className="space-y-2">
                        {selectedEndpoint.parameters.map((param, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-sm font-mono">{param.name}</code>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{param.description}</p>
                            {param.example && (
                              <code className="text-xs text-slate-500">
                                Example: {JSON.stringify(param.example)}
                              </code>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Code Examples</h4>
                      <Tabs defaultValue="curl">
                        <TabsList>
                          <TabsTrigger value="curl">cURL</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="curl">
                          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleCopyCode(generateCurlExample(selectedEndpoint))}
                            >
                              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <pre>{generateCurlExample(selectedEndpoint)}</pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="python">
                          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleCopyCode(generatePythonExample(selectedEndpoint))}
                            >
                              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <pre>{generatePythonExample(selectedEndpoint)}</pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="javascript">
                          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleCopyCode(generateJavaScriptExample(selectedEndpoint))}
                            >
                              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <pre>{generateJavaScriptExample(selectedEndpoint)}</pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Python SDK
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Complete Python SDK for researchers and data scientists
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-sm">
                  pip install symbolica-sdk
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  R Package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Statistical analysis package for R users
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-sm">
                  install.packages("symbolica")
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Package
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  JavaScript SDK
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Modern JavaScript SDK for web developers
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-sm">
                  npm install @symbolica/sdk
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SDK Usage Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="python-sdk">
                <TabsList>
                  <TabsTrigger value="python-sdk">Python</TabsTrigger>
                  <TabsTrigger value="r-sdk">R</TabsTrigger>
                  <TabsTrigger value="js-sdk">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="python-sdk">
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                    <pre>{`from symbolica_sdk import SymbolicaClient
import pandas as pd

# Initialize client
client = SymbolicaClient(api_key="your_api_key")

# Fetch symbols
symbols = client.symbols.list(culture="Celtic", limit=100)

# Convert to DataFrame for analysis
df = pd.DataFrame(symbols)

# Advanced analysis
comparison = client.analysis.compare_symbols([
    "symbol_id_1", 
    "symbol_id_2"
])

# Batch processing
results = client.batch.process_symbols(
    symbol_ids=df['id'].tolist(),
    analysis_types=['pattern', 'cultural', 'temporal']
)`}</pre>
                  </div>
                </TabsContent>

                <TabsContent value="r-sdk">
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                    <pre>{`library(symbolica)

# Setup client
client <- symbolica_client(api_key = "your_api_key")

# Fetch data
symbols <- get_symbols(client, culture = "Celtic")

# Statistical analysis
cultural_stats <- symbols %>%
  group_by(period) %>%
  summarise(
    count = n(),
    complexity_mean = mean(complexity_score),
    diversity_index = calculate_diversity(symbol_types)
  )

# Correlation analysis
correlations <- cor_analysis(
  symbols$geographic_spread,
  symbols$cultural_influence
)

# Visualization
plot_temporal_evolution(symbols, facet_by = "culture")`}</pre>
                  </div>
                </TabsContent>

                <TabsContent value="js-sdk">
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                    <pre>{`import { SymbolicaClient } from '@symbolica/sdk';

// Initialize client
const client = new SymbolicaClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Reactive data fetching
const symbols = await client.symbols.list({
  culture: 'Celtic',
  include: ['analysis', 'relations']
});

// Real-time updates
const subscription = client.realtime.subscribe('symbols', {
  onInsert: (symbol) => console.log('New symbol:', symbol),
  onUpdate: (symbol) => console.log('Updated:', symbol)
});

// Batch operations
const batchResults = await client.batch.analyze({
  symbolIds: symbols.map(s => s.id),
  operations: ['pattern-recognition', 'cultural-classification']
});`}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <p className="text-slate-600">
                Receive real-time notifications when events occur in your data
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook URL</label>
                  <Input placeholder="https://your-app.com/webhooks/symbolica" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Events to Subscribe</label>
                  <div className="space-y-2">
                    {[
                      'symbol.created',
                      'symbol.updated',
                      'analysis.completed',
                      'collection.shared'
                    ].map(event => (
                      <label key={event} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Button>Create Webhook</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Payload Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                <pre>{JSON.stringify({
                  event: "symbol.created",
                  timestamp: "2024-01-15T10:30:00Z",
                  data: {
                    id: "abc123-def456",
                    name: "Celtic Knotwork Pattern",
                    culture: "Celtic",
                    created_by: "user_789",
                    analysis_status: "pending"
                  },
                  webhook_id: "wh_123456"
                }, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                API Testing Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Endpoint</label>
                  <select className="w-full p-2 border rounded">
                    <option value="/api/v1/symbols">GET /api/v1/symbols</option>
                    <option value="/api/v1/symbols/{id}">GET /api/v1/symbols/{id}</option>
                    <option value="/api/v1/analysis/compare">POST /api/v1/analysis/compare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Parameters</label>
                  <Input placeholder='{"culture": "Celtic", "limit": 10}' />
                </div>
              </div>

              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Send Test Request
              </Button>

              {testResponse && (
                <div>
                  <h4 className="font-medium mb-2">Response</h4>
                  <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                    <pre>{JSON.stringify(testResponse, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocumentation;
