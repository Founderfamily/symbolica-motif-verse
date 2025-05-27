import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  BarChart3,
  GitCompare,
  Clock,
  Zap,
  Code,
  Shield,
  Users,
  Database,
  Share2,
  Search,
  Camera,
  MapPin,
  WifiOff,
  FileText,
  Smartphone,
  Mic,
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const EnterprisePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center gap-3">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                <Brain className="h-4 w-4 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                <Zap className="h-4 w-4 mr-1" />
                Research Grade
              </Badge>
            </div>
            <h1 className="text-4xl font-bold">
              Symbolica for Enterprise
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Custom solutions, enhanced security, and dedicated support for
              large-scale cultural heritage projects
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="features" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Fonctionnalités
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              App Mobile
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              API & SDK
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Scalable Infrastructure</CardTitle>
                  <CardDescription>
                    Robust servers and databases to handle massive datasets and
                    high traffic
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    Our enterprise-grade infrastructure ensures your projects
                    remain accessible and performant, regardless of scale.
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>99.99% uptime guarantee</li>
                    <li>Automatic scaling</li>
                    <li>Global CDN</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom AI Models</CardTitle>
                  <CardDescription>
                    Train AI on your proprietary data for unparalleled accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    Leverage our AI expertise to build custom models tailored to
                    your specific research needs.
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Data preprocessing</li>
                    <li>Model training</li>
                    <li>Ongoing optimization</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Application Mobile Native
                  </CardTitle>
                  <CardDescription>
                    Application mobile complète pour la recherche de terrain et la collaboration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Recherche vocale</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Recherche par image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Géolocalisation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <WifiOff className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mode hors ligne</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Carnet de terrain</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Collaboration temps réel</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <a href="/mobile" target="_blank">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Tester l'App Mobile
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fonctionnalités Terrain</CardTitle>
                  <CardDescription>
                    Outils optimisés pour les missions de recherche sur le terrain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mic className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Notes vocales</div>
                        <div className="text-sm text-muted-foreground">
                          Enregistrement et transcription automatique des observations
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Synchronisation intelligente</div>
                        <div className="text-sm text-muted-foreground">
                          Sauvegarde hors ligne avec sync automatique
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Share2 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Partage d'équipe</div>
                        <div className="text-sm text-muted-foreground">
                          Collaboration en temps réel entre chercheurs
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>RESTful API</CardTitle>
                  <CardDescription>
                    Integrate Symbolica data and AI models into your existing
                    systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    Our comprehensive API allows you to programmatically access
                    Symbolica's vast knowledge base and powerful AI tools.
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Authentication</li>
                    <li>Rate limiting</li>
                    <li>Detailed documentation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Software Development Kit (SDK)</CardTitle>
                  <CardDescription>
                    Build custom applications with our easy-to-use SDK
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    Our SDK provides a simplified interface for interacting with
                    Symbolica's core functionalities.
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Multiple languages</li>
                    <li>Code samples</li>
                    <li>Community support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid lg:grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Security Measures</CardTitle>
                  <CardDescription>
                    Protect your sensitive data with our robust security
                    infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    We employ industry-leading security practices to ensure the
                    confidentiality, integrity, and availability of your data.
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Encryption at rest and in transit</li>
                    <li>Regular security audits</li>
                    <li>Compliance certifications</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support">
            <div className="grid lg:grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Dedicated Support Team</CardTitle>
                  <CardDescription>
                    Get personalized assistance from our team of experts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    Our dedicated support team is available to assist you with
                    any questions or issues you may encounter.
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>24/7 availability</li>
                    <li>Priority response times</li>
                    <li>Onboarding assistance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnterprisePage;
