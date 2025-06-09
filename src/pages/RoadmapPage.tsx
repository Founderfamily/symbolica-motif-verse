
import React, { useState } from 'react';
import { CheckCircle, Clock, Calendar, Target, Code, Users, Smartphone, Zap, Brain, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned' | 'research';
  category: 'platform' | 'ai' | 'mobile' | 'community' | 'analysis' | 'api';
  quarter: 'Q1 2025' | 'Q2 2025' | 'Q3 2025' | 'Q4 2025';
  progress: number;
  impact: 'high' | 'medium' | 'low';
  features?: string[];
}

const RoadmapPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const roadmapItems: RoadmapItem[] = [
    // Q1 2025 - Completed
    {
      id: 'core-platform',
      title: 'Core Platform Stabilization',
      description: 'Complete authentication system, collections management, and admin dashboard with 500+ commits',
      status: 'completed',
      category: 'platform',
      quarter: 'Q1 2025',
      progress: 100,
      impact: 'high',
      features: [
        'Authentication system with Supabase',
        'User management and profiles',
        'Admin dashboard with full CRUD operations',
        'Collections and symbols management',
        'Multilingual support (FR/EN)',
        'Error handling and monitoring'
      ]
    },
    {
      id: 'gamification',
      title: 'Gamification System',
      description: 'Complete achievement, badges, and ranking system to engage users',
      status: 'completed',
      category: 'community',
      quarter: 'Q1 2025',
      progress: 100,
      impact: 'high',
      features: [
        'User level progression',
        'Achievement system',
        'Badge collection',
        'Leaderboards and rankings',
        'Activity tracking',
        'Notification system'
      ]
    },
    {
      id: 'ui-stabilization',
      title: 'UI/UX Stabilization',
      description: 'Error boundaries, safe image loading, and responsive design optimization',
      status: 'completed',
      category: 'platform',
      quarter: 'Q1 2025',
      progress: 100,
      impact: 'medium',
      features: [
        'ErrorBoundary system',
        'SafeImage component',
        'Performance monitoring',
        'Responsive design',
        'Translation system v2.0',
        'TypeScript optimization'
      ]
    },

    // Q2 2025 - In Progress
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      description: 'Enhanced loading speeds, caching, and responsive design improvements',
      status: 'in-progress',
      category: 'platform',
      quarter: 'Q2 2025',
      progress: 30,
      impact: 'high',
      features: [
        'React Query optimization',
        'Lazy loading components',
        'Image optimization',
        'Bundle size reduction',
        'CDN integration'
      ]
    },
    {
      id: 'multilingual-expansion',
      title: 'Multilingual Expansion',
      description: 'Support for Spanish, German, and Italian languages',
      status: 'in-progress',
      category: 'platform',
      quarter: 'Q2 2025',
      progress: 15,
      impact: 'medium',
      features: [
        'Spanish translation',
        'German translation',
        'Italian translation',
        'RTL language support',
        'Cultural adaptation'
      ]
    },
    {
      id: 'advanced-search',
      title: 'Advanced Search & Filtering',
      description: 'AI-powered search with cultural and geographical filters',
      status: 'planned',
      category: 'analysis',
      quarter: 'Q2 2025',
      progress: 5,
      impact: 'high',
      features: [
        'Semantic search',
        'Cultural filters',
        'Geographical search',
        'Symbol similarity',
        'Advanced faceting'
      ]
    },

    // Q3 2025 - Planned
    {
      id: 'public-api',
      title: 'Public API Platform',
      description: 'RESTful API for researchers and third-party integrations',
      status: 'planned',
      category: 'api',
      quarter: 'Q3 2025',
      progress: 0,
      impact: 'high',
      features: [
        'REST API endpoints',
        'GraphQL support',
        'API documentation',
        'Rate limiting',
        'Developer portal'
      ]
    },
    {
      id: 'realtime-collaboration',
      title: 'Real-time Collaboration',
      description: 'Live editing, comments, and collaborative research tools',
      status: 'planned',
      category: 'community',
      quarter: 'Q3 2025',
      progress: 0,
      impact: 'high',
      features: [
        'Live editing',
        'Real-time comments',
        'Collaborative annotations',
        'Shared workspaces',
        'Version control'
      ]
    },

    // Q4 2025 - Research
    {
      id: 'ai-pattern-recognition',
      title: 'AI Pattern Recognition',
      description: 'Advanced AI to automatically identify and categorize cultural patterns',
      status: 'research',
      category: 'ai',
      quarter: 'Q4 2025',
      progress: 0,
      impact: 'high',
      features: [
        'Computer vision models',
        'Pattern classification',
        'Similarity detection',
        'Automated tagging',
        'Cultural context analysis'
      ]
    },
    {
      id: 'mobile-app',
      title: 'Native Mobile Application',
      description: 'iOS and Android apps for field research and symbol discovery',
      status: 'research',
      category: 'mobile',
      quarter: 'Q4 2025',
      progress: 0,
      impact: 'medium',
      features: [
        'iOS native app',
        'Android native app',
        'Offline functionality',
        'Camera integration',
        'GPS tracking'
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'platform', name: 'Platform', icon: Code },
    { id: 'ai', name: 'AI & ML', icon: Brain },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'analysis', name: 'Analysis', icon: Target },
    { id: 'api', name: 'API', icon: Zap }
  ];

  const statusConfig = {
    completed: { color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', icon: CheckCircle },
    'in-progress': { color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', icon: Clock },
    planned: { color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: Calendar },
    research: { color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', icon: Target }
  };

  const impactConfig = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-green-200 bg-green-50'
  };

  const filteredItems = selectedCategory === 'all' 
    ? roadmapItems 
    : roadmapItems.filter(item => item.category === selectedCategory);

  const stats = {
    completed: roadmapItems.filter(item => item.status === 'completed').length,
    inProgress: roadmapItems.filter(item => item.status === 'in-progress').length,
    planned: roadmapItems.filter(item => item.status === 'planned').length,
    research: roadmapItems.filter(item => item.status === 'research').length,
    totalProgress: Math.round(roadmapItems.reduce((sum, item) => sum + item.progress, 0) / roadmapItems.length)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
            <I18nText translationKey="title" ns="roadmap">Roadmap</I18nText>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            <I18nText translationKey="description" ns="roadmap">
              Follow our development progress and upcoming features
            </I18nText>
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-slate-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-slate-600">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.planned}</div>
                <div className="text-sm text-slate-600">Planned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.research}</div>
                <div className="text-sm text-slate-600">Research</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-slate-800">{stats.totalProgress}%</div>
                <div className="text-sm text-slate-600">Overall</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Roadmap Timeline */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="quarters">Quarterly View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="space-y-6">
            {filteredItems.map((item) => {
              const statusInfo = statusConfig[item.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={item.id} className={`border-l-4 ${statusInfo.color} ${impactConfig[item.impact]}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-6 w-6 ${statusInfo.textColor}`} />
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{item.quarter}</Badge>
                            <Badge 
                              variant="secondary" 
                              className={`${statusInfo.textColor} ${statusInfo.bgColor}`}
                            >
                              {item.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {item.impact} Impact
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-700">{item.progress}%</div>
                        <Progress value={item.progress} className="w-20 mt-1" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{item.description}</p>
                    {item.features && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Key Features:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {item.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-slate-600">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="quarters" className="space-y-8">
            {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((quarter) => {
              const quarterItems = filteredItems.filter(item => item.quarter === quarter);
              if (quarterItems.length === 0) return null;
              
              return (
                <div key={quarter}>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{quarter}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quarterItems.map((item) => {
                      const statusInfo = statusConfig[item.status];
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <Card key={item.id} className={`${impactConfig[item.impact]}`}>
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <StatusIcon className={`h-5 w-5 ${statusInfo.textColor}`} />
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="secondary" 
                                className={`${statusInfo.textColor} ${statusInfo.bgColor}`}
                              >
                                {item.status.replace('-', ' ')}
                              </Badge>
                              <div className="text-right">
                                <span className="text-lg font-bold text-slate-700">{item.progress}%</span>
                                <Progress value={item.progress} className="w-16 mt-1" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-600 text-sm">{item.description}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Achievement Section */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              🎉 Major Milestone: 500+ Commits Achieved!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-slate-700">
                Symbolica has reached a major development milestone with over 500 commits, 
                representing hundreds of hours of development and a mature, stable platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-slate-600">Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">20+</div>
                  <div className="text-sm text-slate-600">Features</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">100+</div>
                  <div className="text-sm text-slate-600">Components</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoadmapPage;
