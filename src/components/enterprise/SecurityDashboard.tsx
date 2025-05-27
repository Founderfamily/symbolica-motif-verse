
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Users,
  Globe,
  Database,
  Eye,
  Clock,
  Zap,
  FileText
} from 'lucide-react';

interface SecurityMetric {
  name: string;
  value: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'data_access' | 'api_call' | 'permission_change' | 'security_scan';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  user: string;
  description: string;
  location?: string;
  ip_address?: string;
}

interface ComplianceStatus {
  framework: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  score: number;
  requirements_met: number;
  total_requirements: number;
  last_audit: Date;
}

const SecurityDashboard: React.FC = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([]);
  const [activeThreats, setActiveThreats] = useState(0);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = () => {
    // Mock security metrics
    setSecurityMetrics([
      {
        name: 'Authentication Security',
        value: 97,
        status: 'excellent',
        trend: 'up',
        description: 'MFA enabled, strong password policies'
      },
      {
        name: 'Data Encryption',
        value: 100,
        status: 'excellent',
        trend: 'stable',
        description: 'AES-256 encryption for all data'
      },
      {
        name: 'Access Control',
        value: 94,
        status: 'excellent',
        trend: 'up',
        description: 'RBAC with granular permissions'
      },
      {
        name: 'API Security',
        value: 89,
        status: 'good',
        trend: 'stable',
        description: 'Rate limiting and token validation'
      },
      {
        name: 'Network Security',
        value: 92,
        status: 'excellent',
        trend: 'up',
        description: 'WAF, DDoS protection, SSL/TLS'
      },
      {
        name: 'Audit Coverage',
        value: 87,
        status: 'good',
        trend: 'up',
        description: 'Comprehensive logging and monitoring'
      }
    ]);

    // Mock security events
    setSecurityEvents([
      {
        id: 'evt_001',
        type: 'login',
        severity: 'low',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: 'researcher@university.edu',
        description: 'Successful login from new device',
        location: 'London, UK',
        ip_address: '192.168.1.100'
      },
      {
        id: 'evt_002',
        type: 'api_call',
        severity: 'medium',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: 'api_user_123',
        description: 'High-volume API requests detected',
        ip_address: '10.0.0.50'
      },
      {
        id: 'evt_003',
        type: 'data_access',
        severity: 'low',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: 'admin@symbolica.ai',
        description: 'Bulk export of symbol data',
        location: 'San Francisco, CA'
      }
    ]);

    // Mock compliance status
    setComplianceStatus([
      {
        framework: 'GDPR',
        status: 'compliant',
        score: 98,
        requirements_met: 147,
        total_requirements: 150,
        last_audit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        framework: 'SOC 2 Type II',
        status: 'compliant',
        score: 95,
        requirements_met: 285,
        total_requirements: 300,
        last_audit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        framework: 'ISO 27001',
        status: 'partial',
        score: 82,
        requirements_met: 164,
        total_requirements: 200,
        last_audit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      }
    ]);

    setActiveThreats(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      case 'non_compliant': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Enterprise Security</h1>
          <p className="text-slate-600 mt-2">
            Advanced security monitoring and compliance management
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Security Score: 94/100
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            All Systems Secure
          </Badge>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold">94</div>
            </div>
            <div className="text-sm text-slate-600">Security Score</div>
            <div className="text-xs text-green-600 mt-1">↑ +2 this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="text-2xl font-bold">{activeThreats}</div>
            </div>
            <div className="text-sm text-slate-600">Active Threats</div>
            <div className="text-xs text-green-600 mt-1">↓ -3 this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold">99.9%</div>
            </div>
            <div className="text-sm text-slate-600">Uptime</div>
            <div className="text-xs text-green-600 mt-1">SLA compliant</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold">24/7</div>
            </div>
            <div className="text-sm text-slate-600">Monitoring</div>
            <div className="text-xs text-blue-600 mt-1">Real-time alerts</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {metric.name}
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score</span>
                        <span>{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                    <p className="text-sm text-slate-600">{metric.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        metric.trend === 'up' ? 'bg-green-100 text-green-700' :
                        metric.trend === 'down' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {metric.trend}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Enable Advanced Threat Detection</h4>
                    <p className="text-sm text-blue-700">
                      Upgrade to AI-powered threat detection for better anomaly identification
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Schedule Security Audit</h4>
                    <p className="text-sm text-yellow-700">
                      Next quarterly security audit due in 2 weeks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">All Critical Updates Applied</h4>
                    <p className="text-sm text-green-700">
                      System is up to date with latest security patches
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.type === 'login' && <Users className="h-4 w-4" />}
                      {event.type === 'api_call' && <Globe className="h-4 w-4" />}
                      {event.type === 'data_access' && <Database className="h-4 w-4" />}
                      {event.type === 'permission_change' && <Key className="h-4 w-4" />}
                      {event.type === 'security_scan' && <Shield className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.description}</h4>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>User: {event.user}</div>
                        <div>Time: {event.timestamp.toLocaleString()}</div>
                        {event.location && <div>Location: {event.location}</div>}
                        {event.ip_address && <div>IP: {event.ip_address}</div>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                  <div className="text-sm text-slate-600">Events Today</div>
                  <div className="text-xs text-green-600">↓ 15% vs yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
                  <div className="text-sm text-slate-600">Normal Events</div>
                  <div className="text-xs text-green-600">↑ 2% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">18</div>
                  <div className="text-sm text-slate-600">Anomalies Detected</div>
                  <div className="text-xs text-red-600">↑ 3 vs yesterday</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {complianceStatus.map((compliance, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {compliance.framework}
                    <Badge className={getComplianceColor(compliance.status)}>
                      {compliance.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Compliance Score</span>
                        <span>{compliance.score}%</span>
                      </div>
                      <Progress value={compliance.score} className="h-2" />
                    </div>
                    <div className="text-sm text-slate-600">
                      <div>Requirements: {compliance.requirements_met}/{compliance.total_requirements}</div>
                      <div>Last Audit: {compliance.last_audit.toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Actions Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">ISO 27001 Documentation Update</h4>
                    <p className="text-sm text-yellow-700">
                      Update security policies documentation by March 15, 2024
                    </p>
                    <Button size="sm" className="mt-2">Update Documentation</Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">SOC 2 Type II Review</h4>
                    <p className="text-sm text-blue-700">
                      Annual SOC 2 review scheduled for next month
                    </p>
                    <Button size="sm" className="mt-2">Schedule Review</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Control Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-slate-600">Active Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Key className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-slate-600">MFA Enabled</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-slate-600">Role Groups</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Lock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">456</div>
                  <div className="text-sm text-slate-600">Permissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { role: 'Administrator', users: 5, permissions: 45 },
                    { role: 'Researcher', users: 234, permissions: 23 },
                    { role: 'Contributor', users: 567, permissions: 12 },
                    { role: 'Viewer', users: 441, permissions: 5 }
                  ].map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <div>
                        <div className="font-medium">{role.role}</div>
                        <div className="text-sm text-slate-600">{role.users} users</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{role.permissions} permissions</div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Single Sign-On (SSO)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div>
                      <div className="font-medium">SAML 2.0</div>
                      <div className="text-sm text-green-600">Active</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div>
                      <div className="font-medium">OAuth 2.0</div>
                      <div className="text-sm text-blue-600">Active</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <div className="font-medium">LDAP</div>
                      <div className="text-sm text-slate-600">Available</div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Encryption Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Data at Rest</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">Database</div>
                        <div className="text-sm text-green-600">AES-256 encrypted</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">File Storage</div>
                        <div className="text-sm text-green-600">AES-256 encrypted</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">Backups</div>
                        <div className="text-sm text-green-600">AES-256 encrypted</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Data in Transit</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">HTTPS/TLS 1.3</div>
                        <div className="text-sm text-green-600">All connections</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">API Endpoints</div>
                        <div className="text-sm text-green-600">TLS 1.3 enforced</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">Database Connections</div>
                        <div className="text-sm text-green-600">SSL encrypted</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Key className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">256-bit</div>
                  <div className="text-sm text-slate-600">Encryption Keys</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">90 days</div>
                  <div className="text-sm text-slate-600">Key Rotation</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">HSM</div>
                  <div className="text-sm text-slate-600">Key Storage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
