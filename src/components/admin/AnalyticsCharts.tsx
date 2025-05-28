
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AdminStats } from '@/services/admin/statsService';
import { Loader2 } from 'lucide-react';

interface AnalyticsChartsProps {
  stats: AdminStats;
  loading: boolean;
}

const AnalyticsCharts = ({ stats, loading }: AnalyticsChartsProps) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Préparer les données pour les graphiques
  const contributionsData = stats.contributionsOverTime || [];

  // Générer des données factices pour les démonstrations si pas de données
  const mockUserGrowthData = [
    { month: 'Jan', users: Math.floor(stats.totalUsers * 0.1) },
    { month: 'Fév', users: Math.floor(stats.totalUsers * 0.3) },
    { month: 'Mar', users: Math.floor(stats.totalUsers * 0.5) },
    { month: 'Avr', users: Math.floor(stats.totalUsers * 0.7) },
    { month: 'Mai', users: Math.floor(stats.totalUsers * 0.9) },
    { month: 'Juin', users: stats.totalUsers }
  ];

  const mockActivityData = [
    { day: 'Lun', contributions: stats.contributionsWeek * 0.2 },
    { day: 'Mar', contributions: stats.contributionsWeek * 0.15 },
    { day: 'Mer', contributions: stats.contributionsWeek * 0.25 },
    { day: 'Jeu', contributions: stats.contributionsWeek * 0.1 },
    { day: 'Ven', contributions: stats.contributionsWeek * 0.2 },
    { day: 'Sam', contributions: stats.contributionsWeek * 0.05 },
    { day: 'Dim', contributions: stats.contributionsWeek * 0.05 }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Croissance des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockUserGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contributions par jour (semaine)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="contributions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contributions au fil du temps</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={contributionsData.length > 0 ? contributionsData : mockActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={contributionsData.length > 0 ? "date" : "day"} />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={contributionsData.length > 0 ? "count" : "contributions"} 
                stroke="#3b82f6" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statut des contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { status: 'Approuvées', count: stats.approvedContributions },
              { status: 'En attente', count: stats.pendingContributions },
              { status: 'Rejetées', count: stats.rejectedContributions }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
