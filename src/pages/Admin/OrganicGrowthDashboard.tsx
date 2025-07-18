import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollectionManagement } from '@/components/admin/CollectionManagement';
import { CommunityManagement } from '@/components/admin/CommunityManagement';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Hash, Target } from 'lucide-react';

export const OrganicGrowthDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organic Growth Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage the organic growth of collections and communities
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <TrendingUp className="h-3 w-3 mr-1" />
          Organic Growth Active
        </Badge>
      </div>

      {/* Growth Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Collections Strategy</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Minimum 15 symbols per new collection</p>
              <p>• User community validation required</p>
              <p>• Admin approval for creation</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="font-medium">Communities Strategy</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Minimum 10 member requests</p>
              <p>• Proven activity requirement</p>
              <p>• Organic demand-driven creation</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Growth Targets</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• 8-12 active collections max</p>
              <p>• 5-7 engaged communities</p>
              <p>• 10+ symbols per collection</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="collections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collections">Collection Management</TabsTrigger>
          <TabsTrigger value="communities">Community Management</TabsTrigger>
        </TabsList>

        <TabsContent value="collections">
          <CollectionManagement />
        </TabsContent>

        <TabsContent value="communities">
          <CommunityManagement />
        </TabsContent>
      </Tabs>

      {/* Growth Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Organic Growth Guidelines</CardTitle>
          <CardDescription>
            Key principles for maintaining healthy platform growth
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-700">✅ Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li>• Monitor collection health regularly</li>
                <li>• Encourage community engagement before creating new groups</li>
                <li>• Consolidate similar collections when appropriate</li>
                <li>• Focus on quality over quantity</li>
                <li>• Link new collections to quest achievements</li>
                <li>• Validate user demand before expansion</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-red-700">❌ Avoid</h3>
              <ul className="space-y-2 text-sm">
                <li>• Creating collections with fewer than 10 symbols</li>
                <li>• Allowing communities with inactive members</li>
                <li>• Duplicating similar cultural themes</li>
                <li>• Ignoring user engagement metrics</li>
                <li>• Creating collections without community input</li>
                <li>• Proliferating empty or low-activity groups</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};