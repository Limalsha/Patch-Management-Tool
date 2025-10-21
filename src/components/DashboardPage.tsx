import { Server, Activity, Package, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';

const patchActivityData = [
  { date: 'Oct 15', patches: 24, critical: 8 },
  { date: 'Oct 16', patches: 18, critical: 5 },
  { date: 'Oct 17', patches: 32, critical: 12 },
  { date: 'Oct 18', patches: 28, critical: 9 },
  { date: 'Oct 19', patches: 15, critical: 4 },
  { date: 'Oct 20', patches: 22, critical: 7 },
  { date: 'Oct 21', patches: 35, critical: 11 },
];

const recentActivities = [
  { id: 1, action: 'Security patches deployed', server: 'Server-01', time: '5 minutes ago', type: 'success' },
  { id: 2, action: 'Agent sync completed', server: 'Server-03', time: '12 minutes ago', type: 'info' },
  { id: 3, action: 'Critical updates available', server: 'Server-05', time: '23 minutes ago', type: 'warning' },
  { id: 4, action: 'Patch deployment successful', server: 'Server-02', time: '1 hour ago', type: 'success' },
  { id: 5, action: 'New agent connected', server: 'Server-08', time: '2 hours ago', type: 'info' },
  { id: 6, action: 'Scheduled scan completed', server: 'Server-04', time: '3 hours ago', type: 'success' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Total Servers</CardTitle>
            <Server className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">24</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-teal-500">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Connected Agents</CardTitle>
            <Activity className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">22</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-yellow-500">2 offline</span> servers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Pending Updates</CardTitle>
            <Package className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">143</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-red-500">35 critical</span> patches
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Last Sync</CardTitle>
            <Clock className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">5m</div>
            <p className="text-xs text-slate-400 mt-1">
              ago on all servers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patch Activity Chart */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Patch Activity Over Time
            </CardTitle>
            <CardDescription className="text-slate-400">
              Last 7 days patch deployment metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patchActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="patches" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  name="Total Patches"
                />
                <Line 
                  type="monotone" 
                  dataKey="critical" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Critical"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-teal-500" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-slate-700 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.server}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Severity Distribution Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Patch Severity Distribution</CardTitle>
          <CardDescription className="text-slate-400">
            Current pending updates by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { severity: 'Critical', count: 35 },
              { severity: 'High', count: 48 },
              { severity: 'Medium', count: 42 },
              { severity: 'Low', count: 18 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="severity" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
