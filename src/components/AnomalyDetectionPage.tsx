import { useState, useEffect } from 'react';
import { Brain, Activity, AlertTriangle, Server, TrendingUp, Pause, Play, BarChart3, Filter, CheckCircle, XCircle, Download, Eye, Zap, Shield, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface AnomalyData {
  id: string;
  timestamp: string;
  server: string;
  metric: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  aiConfidence: number;
  status: 'active' | 'resolved' | 'investigating';
  rootCause?: string;
  recommendation?: string;
}

interface AlertData {
  id: string;
  timestamp: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  server: string;
  acknowledged: boolean;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
}

const mockAnomalies: AnomalyData[] = [
  { id: '1', timestamp: '2025-10-21 10:35:22', server: 'Server-01', metric: 'CPU Usage', issue: 'CPU spike to 95%', severity: 'critical', aiConfidence: 94, status: 'active', rootCause: 'Kernel update triggered high CPU usage', recommendation: 'Rollback kernel update or investigate process optimization' },
  { id: '2', timestamp: '2025-10-21 10:32:15', server: 'Server-03', metric: 'Memory', issue: 'Memory leak detected', severity: 'high', aiConfidence: 87, status: 'investigating', rootCause: 'Application memory consumption pattern anomaly', recommendation: 'Restart application service and monitor' },
  { id: '3', timestamp: '2025-10-21 10:28:08', server: 'Server-05', metric: 'Disk I/O', issue: 'Unusual disk write pattern', severity: 'medium', aiConfidence: 72, status: 'active', rootCause: 'Log file growth exceeding normal patterns', recommendation: 'Configure log rotation and cleanup' },
  { id: '4', timestamp: '2025-10-21 10:15:45', server: 'Server-02', metric: 'Network', issue: 'Network latency spike', severity: 'high', aiConfidence: 89, status: 'resolved', rootCause: 'Temporary network congestion', recommendation: 'Monitor network traffic and consider bandwidth upgrade' },
  { id: '5', timestamp: '2025-10-21 09:55:30', server: 'Server-08', metric: 'Patch Activity', issue: 'Failed patch deployment', severity: 'critical', aiConfidence: 96, status: 'active', rootCause: 'Dependency conflict detected', recommendation: 'Resolve package dependencies before retry' },
];

const mockAlerts: AlertData[] = [
  { id: '1', timestamp: '2025-10-21 10:35:22', message: 'Critical CPU anomaly detected on Server-01', severity: 'critical', server: 'Server-01', acknowledged: false },
  { id: '2', timestamp: '2025-10-21 10:32:15', message: 'Memory leak pattern identified on Server-03', severity: 'warning', server: 'Server-03', acknowledged: false },
  { id: '3', timestamp: '2025-10-21 10:28:08', message: 'Disk I/O anomaly on Server-05', severity: 'warning', server: 'Server-05', acknowledged: true },
  { id: '4', timestamp: '2025-10-21 09:55:30', message: 'Patch deployment failure on Server-08', severity: 'critical', server: 'Server-08', acknowledged: false },
];

const cpuData = [
  { time: '10:00', usage: 45 },
  { time: '10:05', usage: 52 },
  { time: '10:10', usage: 48 },
  { time: '10:15', usage: 65 },
  { time: '10:20', usage: 78 },
  { time: '10:25', usage: 92 },
  { time: '10:30', usage: 95 },
  { time: '10:35', usage: 88 },
];

const memoryData = [
  { time: '10:00', usage: 62 },
  { time: '10:05', usage: 64 },
  { time: '10:10', usage: 67 },
  { time: '10:15', usage: 70 },
  { time: '10:20', usage: 73 },
  { time: '10:25', usage: 76 },
  { time: '10:30', usage: 79 },
  { time: '10:35', usage: 82 },
];

const anomalyTrendData = [
  { date: 'Oct 15', anomalies: 12, resolved: 10 },
  { date: 'Oct 16', anomalies: 8, resolved: 7 },
  { date: 'Oct 17', anomalies: 15, resolved: 12 },
  { date: 'Oct 18', anomalies: 10, resolved: 9 },
  { date: 'Oct 19', anomalies: 6, resolved: 6 },
  { date: 'Oct 20', anomalies: 11, resolved: 8 },
  { date: 'Oct 21', anomalies: 14, resolved: 9 },
];

const severityDistribution = [
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'High', value: 2, color: '#f97316' },
  { name: 'Medium', value: 1, color: '#eab308' },
  { name: 'Low', value: 0, color: '#22c55e' },
];

const servers = ['Server-01', 'Server-02', 'Server-03', 'Server-04', 'Server-05', 'Server-06', 'Server-07', 'Server-08'];

export function AnomalyDetectionPage() {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>(mockAnomalies);
  const [alerts, setAlerts] = useState<AlertData[]>(mockAlerts);
  const [selectedServer, setSelectedServer] = useState('Server-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [isPaused, setIsPaused] = useState(false);
  const [autoLearning, setAutoLearning] = useState(true);
  const [autoRemediation, setAutoRemediation] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', timestamp: '2025-10-21 10:35:22', source: 'AI Engine', event: 'CPU anomaly detected on Server-01', severity: 'critical' },
    { id: '2', timestamp: '2025-10-21 10:32:15', source: 'Monitor', event: 'Memory threshold exceeded on Server-03', severity: 'warning' },
    { id: '3', timestamp: '2025-10-21 10:28:08', source: 'AI Engine', event: 'Disk I/O pattern anomaly on Server-05', severity: 'warning' },
    { id: '4', timestamp: '2025-10-21 10:15:45', source: 'Network Monitor', event: 'Network latency spike detected', severity: 'info' },
    { id: '5', timestamp: '2025-10-21 09:55:30', source: 'Patch Manager', event: 'Patch deployment failed on Server-08', severity: 'critical' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (isPaused || !autoScroll) return;

    const interval = setInterval(() => {
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        }),
        source: ['AI Engine', 'Monitor', 'Network Monitor', 'Patch Manager'][Math.floor(Math.random() * 4)],
        event: 'System health check completed',
        severity: 'info',
      };
      setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, autoScroll]);

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesSearch = anomaly.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anomaly.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || anomaly.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const activeAnomalies = anomalies.filter(a => a.status === 'active').length;
  const monitoredServers = servers.length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const avgHealth = 78; // Mock average health score

  const handleResolveAnomaly = (id: string) => {
    setAnomalies(anomalies.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    toast.success('Anomaly marked as resolved');
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    toast.success('Alert acknowledged');
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alert dismissed');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-white flex items-center gap-2">
            <Brain className="w-7 h-7 text-teal-500" />
            Anomaly Detection & Monitoring
          </h2>
          <p className="text-slate-400 mt-1">AI-powered real-time system monitoring and anomaly detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
            <Zap className={`w-4 h-4 ${autoLearning ? 'text-teal-500' : 'text-slate-500'}`} />
            <Label className="text-slate-300 text-sm">Auto-Learning</Label>
            <Switch checked={autoLearning} onCheckedChange={setAutoLearning} />
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Anomalies Detected</CardTitle>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{activeAnomalies}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-red-400">+3</span> in last hour
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Monitored Servers</CardTitle>
            <Server className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{monitoredServers}</div>
            <p className="text-xs text-slate-400 mt-1">
              All systems active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Critical Alerts</CardTitle>
            <Shield className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{criticalAlerts}</div>
            <p className="text-xs text-slate-400 mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">System Health</CardTitle>
            <Activity className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{avgHealth}%</div>
            <Progress value={avgHealth} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Monitoring & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-Time Monitoring Panel */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-500" />
                  Real-Time Monitoring
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Select value={selectedServer} onValueChange={setSelectedServer}>
                    <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {servers.map(server => (
                        <SelectItem key={server} value={server} className="text-white">
                          {server}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPaused(!isPaused)}
                    className="border-slate-600"
                  >
                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cpu" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
                  <TabsTrigger value="cpu">CPU</TabsTrigger>
                  <TabsTrigger value="memory">Memory</TabsTrigger>
                  <TabsTrigger value="disk">Disk I/O</TabsTrigger>
                  <TabsTrigger value="network">Network</TabsTrigger>
                </TabsList>
                <TabsContent value="cpu" className="mt-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={cpuData}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Area type="monotone" dataKey="usage" stroke="#14b8a6" fillOpacity={1} fill="url(#colorCpu)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Current: <span className="text-white">88%</span></span>
                    <span className="text-slate-400">Peak: <span className="text-red-400">95%</span></span>
                    <span className="text-slate-400">Average: <span className="text-white">72%</span></span>
                  </div>
                </TabsContent>
                <TabsContent value="memory" className="mt-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={memoryData}>
                      <defs>
                        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Area type="monotone" dataKey="usage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMemory)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Current: <span className="text-white">82%</span></span>
                    <span className="text-slate-400">Peak: <span className="text-orange-400">85%</span></span>
                    <span className="text-slate-400">Average: <span className="text-white">71%</span></span>
                  </div>
                </TabsContent>
                <TabsContent value="disk" className="mt-4">
                  <div className="flex items-center justify-center h-[250px] text-slate-400">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p>Disk I/O metrics for {selectedServer}</p>
                      <p className="text-sm mt-1">Read: 45 MB/s | Write: 23 MB/s</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="network" className="mt-4">
                  <div className="flex items-center justify-center h-[250px] text-slate-400">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p>Network metrics for {selectedServer}</p>
                      <p className="text-sm mt-1">In: 12.5 Mbps | Out: 8.2 Mbps</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Anomaly Detection Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-white">Detected Anomalies</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search anomalies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white w-[200px]"
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[140px] bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-white">All Severity</SelectItem>
                      <SelectItem value="critical" className="text-white">Critical</SelectItem>
                      <SelectItem value="high" className="text-white">High</SelectItem>
                      <SelectItem value="medium" className="text-white">Medium</SelectItem>
                      <SelectItem value="low" className="text-white">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 bg-slate-900/30">
                      <TableHead className="text-slate-300">Timestamp</TableHead>
                      <TableHead className="text-slate-300">Server</TableHead>
                      <TableHead className="text-slate-300">Metric</TableHead>
                      <TableHead className="text-slate-300">Issue</TableHead>
                      <TableHead className="text-slate-300">Severity</TableHead>
                      <TableHead className="text-slate-300">AI Confidence</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnomalies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                          No anomalies found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAnomalies.map((anomaly) => (
                        <TableRow key={anomaly.id} className="border-slate-700 hover:bg-slate-800/30">
                          <TableCell className="text-slate-400 text-sm">{anomaly.timestamp}</TableCell>
                          <TableCell className="text-white">{anomaly.server}</TableCell>
                          <TableCell className="text-slate-400">{anomaly.metric}</TableCell>
                          <TableCell className="text-slate-300">{anomaly.issue}</TableCell>
                          <TableCell>
                            <Badge className={`${getSeverityColor(anomaly.severity)} text-white border-0`}>
                              {anomaly.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={anomaly.aiConfidence} className="h-2 w-16" />
                              <span className="text-slate-300 text-sm">{anomaly.aiConfidence}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              anomaly.status === 'active' ? 'border-red-600 text-red-400' :
                              anomaly.status === 'investigating' ? 'border-yellow-600 text-yellow-400' :
                              'border-green-600 text-green-400'
                            }>
                              {anomaly.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/20"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {anomaly.status !== 'resolved' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResolveAnomaly(anomaly.id)}
                                  className="text-green-400 hover:text-green-300 hover:bg-green-950/20"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Visual Analytics Dashboard */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Anomaly Trend */}
                <div>
                  <h4 className="text-slate-300 mb-3">Anomaly Trend (Last 7 Days)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={anomalyTrendData}>
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
                      <Line type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={2} name="Detected" />
                      <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Severity Distribution */}
                <div>
                  <h4 className="text-slate-300 mb-3">Severity Distribution</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={severityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {severityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Insights & Alerts */}
        <div className="space-y-6">
          {/* AI Insights & Root Cause Analysis */}
          <Card className="bg-slate-800/50 border-slate-700 border-teal-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-500" />
                AI Insights
              </CardTitle>
              <CardDescription className="text-slate-400">
                Root cause analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAnomalies.filter(a => a.status === 'active').slice(0, 3).map((anomaly) => (
                <div key={anomaly.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white mb-1">{anomaly.issue}</p>
                      <p className="text-xs text-slate-400">{anomaly.server}</p>
                    </div>
                    <Badge className={`${getSeverityColor(anomaly.severity)} text-white border-0 text-xs`}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                  
                  {anomaly.rootCause && (
                    <div className="pt-2 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Root Cause:</p>
                      <p className="text-sm text-teal-400">{anomaly.rootCause}</p>
                      <p className="text-xs text-slate-500 mt-1">Confidence: {anomaly.aiConfidence}%</p>
                    </div>
                  )}
                  
                  {anomaly.recommendation && (
                    <div className="pt-2 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Recommendation:</p>
                      <p className="text-sm text-slate-300">{anomaly.recommendation}</p>
                    </div>
                  )}
                </div>
              ))}

              {filteredAnomalies.filter(a => a.status === 'active').length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No active anomalies requiring analysis</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Active Alerts
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-slate-400 text-xs">Auto-Remediation</Label>
                  <Switch checked={autoRemediation} onCheckedChange={setAutoRemediation} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScrollArea className="h-[300px]">
                {alerts.filter(a => !a.acknowledged).length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No pending alerts</p>
                  </div>
                ) : (
                  alerts.filter(a => !a.acknowledged).map((alert) => (
                    <div key={alert.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className={`text-sm ${getSeverityTextColor(alert.severity)}`}>
                            {alert.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{alert.timestamp}</p>
                        </div>
                        <Badge className={
                          alert.severity === 'critical' ? 'bg-red-600' :
                          alert.severity === 'warning' ? 'bg-orange-600' : 'bg-blue-600'
                        }>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                          className="flex-1 border-green-600 text-green-400 hover:bg-green-950/20 text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDismissAlert(alert.id)}
                          className="flex-1 border-slate-600 text-slate-400 hover:bg-slate-800 text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Predictive Stability Score */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                Predictive Stability Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Overall System Stability</span>
                  <span className="text-white">78%</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Predicted Next 24h</span>
                  <span className="text-teal-400">82%</span>
                </div>
                <Progress value={82} className="h-3" />
              </div>
              <div className="pt-3 border-t border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Level</span>
                  <Badge className="bg-yellow-600">Medium</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-white">91%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Activity Log */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-500" />
              Live Activity Log
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-slate-400 text-sm">Auto Scroll</Label>
                <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Filter by keyword..."
                  className="pl-10 bg-slate-900/50 border-slate-600 text-white w-[200px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 font-mono text-sm">
              {activityLogs.map((log) => (
                <div key={log.id} className={`p-2 rounded ${
                  log.severity === 'critical' ? 'bg-red-950/20 text-red-400' :
                  log.severity === 'warning' ? 'bg-yellow-950/20 text-yellow-400' :
                  log.severity === 'success' ? 'bg-green-950/20 text-green-400' :
                  'bg-slate-800/30 text-slate-300'
                }`}>
                  <span className="text-slate-500">[{log.timestamp}]</span>
                  <span className="text-slate-400 mx-2">[{log.source}]</span>
                  {log.event}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
