
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Download, 
  Camera, 
  MapPin, 
  Wifi, 
  WifiOff,
  Share2,
  Bell,
  ScanLine,
  Globe,
  Users,
  Star
} from 'lucide-react';

const MobileApp: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('ar-scanner');

  const features = [
    {
      id: 'ar-scanner',
      name: 'AR Symbol Scanner',
      description: 'Recognize symbols in real-time using augmented reality',
      icon: <ScanLine className="h-6 w-6" />,
      status: 'Beta',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'offline-mode',
      name: 'Offline Mode',
      description: 'Access your collections without internet connection',
      icon: <WifiOff className="h-6 w-6" />,
      status: 'Available',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'geo-discovery',
      name: 'Geo Discovery',
      description: 'Find symbols near your location',
      icon: <MapPin className="h-6 w-6" />,
      status: 'Available',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'social-sharing',
      name: 'Social Sharing',
      description: 'Share discoveries with the community',
      icon: <Share2 className="h-6 w-6" />,
      status: 'Available',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const screenshots = [
    {
      title: 'AR Scanner Interface',
      description: 'Point your camera at any symbol for instant recognition',
      image: '/placeholder.svg'
    },
    {
      title: 'Interactive Map',
      description: 'Explore symbols around the world',
      image: '/placeholder.svg'
    },
    {
      title: 'Detailed Analysis',
      description: 'Access comprehensive symbol information',
      image: '/placeholder.svg'
    },
    {
      title: 'Collection Manager',
      description: 'Organize your discoveries',
      image: '/placeholder.svg'
    }
  ];

  const capabilities = [
    {
      category: 'Recognition & Analysis',
      features: [
        'Real-time symbol recognition with 94% accuracy',
        'AI-powered cultural classification',
        'Historical context and meaning',
        'Pattern matching across cultures',
        'Offline symbol database (10,000+ symbols)'
      ]
    },
    {
      category: 'Discovery & Exploration',
      features: [
        'GPS-based symbol discovery',
        'Augmented reality overlay',
        'Walking tour recommendations',
        'Historical site integration',
        'Community-contributed locations'
      ]
    },
    {
      category: 'Collaboration & Sharing',
      features: [
        'Real-time collaborative annotation',
        'Social discovery feed',
        'Expert verification system',
        'Multi-language support',
        'Cross-platform synchronization'
      ]
    },
    {
      category: 'Advanced Features',
      features: [
        'Voice notes and audio guides',
        'Biometric authentication',
        'Background processing',
        'Smart notifications',
        'Academic citation export'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">
          Symbolica Mobile App
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Experience cultural heritage on the go with advanced AR recognition, 
          offline capabilities, and collaborative research tools
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-black text-white hover:bg-gray-800">
            <Download className="h-5 w-5 mr-2" />
            Download for iOS
          </Button>
          <Button size="lg" variant="outline">
            <Download className="h-5 w-5 mr-2" />
            Download for Android
          </Button>
        </div>
      </div>

      {/* App Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
            <div className="text-sm text-slate-600">Downloads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
            <div className="text-sm text-slate-600">App Store Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
            <div className="text-sm text-slate-600">Symbols Recognized</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
            <div className="text-sm text-slate-600">Countries</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedFeature === feature.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedFeature(feature.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{feature.description}</p>
                  <Badge variant={feature.status === 'Beta' ? 'secondary' : 'outline'}>
                    {feature.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Details */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Spotlight: AR Symbol Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">How it works:</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                      Point your camera at any symbol or pattern
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                      AI processes the image in real-time
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                      Get instant cultural and historical context
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                      Save to collections or share with community
                    </li>
                  </ol>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-lg">
                  <div className="aspect-video bg-white rounded-lg shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">AR Scanner Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screenshots" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {screenshots.map((screenshot, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <div className="aspect-[9/16] bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg flex items-center justify-center">
                    <Smartphone className="h-16 w-16 text-slate-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{screenshot.title}</h3>
                    <p className="text-sm text-slate-600">{screenshot.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Interface Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ScanLine className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Intuitive Design</h4>
                  <p className="text-sm text-slate-600">
                    Clean, minimal interface designed for field research
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wifi className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Offline First</h4>
                  <p className="text-sm text-slate-600">
                    Full functionality without internet connection
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Collaborative</h4>
                  <p className="text-sm text-slate-600">
                    Real-time sharing and community features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">System Requirements</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>iOS:</strong> iOS 14.0 or later, iPhone 8 or newer</li>
                    <li><strong>Android:</strong> Android 8.0 (API 26) or higher</li>
                    <li><strong>Storage:</strong> 2GB free space (includes offline database)</li>
                    <li><strong>RAM:</strong> 3GB minimum for AR features</li>
                    <li><strong>Camera:</strong> Required for symbol recognition</li>
                    <li><strong>GPS:</strong> Required for location features</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Recognition Speed:</strong> &lt;2 seconds average</li>
                    <li><strong>Accuracy:</strong> 94% on known symbols</li>
                    <li><strong>Battery Usage:</strong> Optimized for all-day use</li>
                    <li><strong>Offline Database:</strong> 10,000+ symbols</li>
                    <li><strong>Sync Speed:</strong> Background updates</li>
                    <li><strong>Language Support:</strong> 25+ languages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Download Symbolica Mobile</h2>
              <p className="text-slate-600 mb-6">
                Available on iOS and Android. Start exploring cultural heritage today.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                <Download className="h-5 w-5 mr-2" />
                App Store
              </Button>
              <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">
                <Download className="h-5 w-5 mr-2" />
                Google Play
              </Button>
            </div>

            <div className="max-w-2xl mx-auto">
              <h3 className="font-semibold mb-4">What's New in Version 2.1</h3>
              <div className="text-left bg-slate-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li>• Enhanced AR recognition with 15% better accuracy</li>
                  <li>• New collaborative annotation features</li>
                  <li>• Improved offline mode with better sync</li>
                  <li>• Support for 5 additional languages</li>
                  <li>• Performance optimizations and bug fixes</li>
                </ul>
              </div>
            </div>

            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Get Notified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Sign up for updates about new features and releases
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <Button size="sm">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileApp;
