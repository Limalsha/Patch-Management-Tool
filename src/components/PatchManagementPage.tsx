import { useState } from 'react';
import { Server, Download, Search, Filter, Package, AlertTriangle, Clock, Ban } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PatchData {
  id: string;
  packageName: string;
  currentVersion: string;
  availableVersion: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'available' | 'excluded' | 'deployed';
}

const mockPatches: PatchData[] = [
  { id: '1', packageName: 'openssl', currentVersion: '1.1.1f', availableVersion: '1.1.1w', description: 'CVE-2023-5678 - Critical SSL/TLS vulnerability', severity: 'critical', status: 'available' },
  { id: '2', packageName: 'linux-kernel', currentVersion: '5.4.0-42', availableVersion: '5.4.0-65', description: 'CVE-2023-4321 - Privilege escalation fix', severity: 'critical', status: 'available' },
  { id: '3', packageName: 'nginx', currentVersion: '1.18.0', availableVersion: '1.24.0', description: 'Security and stability improvements', severity: 'high', status: 'available' },
  { id: '4', packageName: 'postgresql', currentVersion: '12.5', availableVersion: '12.16', description: 'CVE-2023-3456 - SQL injection vulnerability', severity: 'high', status: 'available' },
  { id: '5', packageName: 'python3', currentVersion: '3.8.5', availableVersion: '3.8.18', description: 'Multiple security fixes', severity: 'medium', status: 'available' },
  { id: '6', packageName: 'curl', currentVersion: '7.68.0', availableVersion: '7.88.1', description: 'CVE-2023-2345 - Remote code execution', severity: 'critical', status: 'available' },
  { id: '7', packageName: 'systemd', currentVersion: '245.4', availableVersion: '245.11', description: 'Bug fixes and improvements', severity: 'medium', status: 'available' },
  { id: '8', packageName: 'docker', currentVersion: '20.10.7', availableVersion: '24.0.6', description: 'Container escape vulnerability fix', severity: 'high', status: 'available' },
  { id: '9', packageName: 'openssh', currentVersion: '8.2p1', availableVersion: '9.3p1', description: 'CVE-2023-8765 - Authentication bypass', severity: 'critical', status: 'available' },
  { id: '10', packageName: 'sudo', currentVersion: '1.8.31', availableVersion: '1.9.14', description: 'CVE-2023-7654 - Privilege escalation', severity: 'critical', status: 'available' },
];

const excludedPackages = [
  { packageName: 'legacy-app', reason: 'Compatibility issues', date: '2025-10-15' },
  { packageName: 'custom-kernel', reason: 'Custom build required', date: '2025-10-10' },
];

const servers = ['Server-01', 'Server-02', 'Server-03', 'Server-04', 'Server-05', 'Server-06', 'Server-07', 'Server-08'];

export const patchesData = mockPatches;
export const serversData = servers;

export function PatchManagementPage() {
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedPatches, setSelectedPatches] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPatches = mockPatches.filter(patch => {
    const matchesSearch = patch.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || patch.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || patch.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedPatches.length === filteredPatches.length) {
      setSelectedPatches([]);
    } else {
      setSelectedPatches(filteredPatches.map(p => p.id));
    }
  };

  const handlePatchSelect = (id: string) => {
    setSelectedPatches(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
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

  const severityData = [
    { name: 'Critical', value: mockPatches.filter(p => p.severity === 'critical').length, color: '#ef4444' },
    { name: 'High', value: mockPatches.filter(p => p.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: mockPatches.filter(p => p.severity === 'medium').length, color: '#eab308' },
    { name: 'Low', value: mockPatches.filter(p => p.severity === 'low').length, color: '#22c55e' },
  ];

  const totalPackages = mockPatches.length;
  const updatesAvailable = mockPatches.filter(p => p.status === 'available').length;
  const excludedCount = excludedPackages.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Total Packages</CardTitle>
            <Package className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{totalPackages}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Updates Available</CardTitle>
            <Download className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{updatesAvailable}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Excluded Packages</CardTitle>
            <Ban className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{excludedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Last Scan</CardTitle>
            <Clock className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">2.3s</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Server Selection & Filter Search Combined */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-500" />
                Server Selection & Filters
              </CardTitle>
              <CardDescription className="text-slate-400">
                Select a server and filter available patches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Server Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-slate-300">Select Server</Label>
                  <Select value={selectedServer} onValueChange={setSelectedServer}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="Choose a server..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {servers.map(server => (
                        <SelectItem key={server} value={server} className="text-white">
                          {server}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={!selectedServer}
                  >
                    Get Patch Details
                  </Button>
                </div>
              </div>

              {selectedServer && (
                <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-white">{selectedServer} - Online</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Last Synced: October 21, 2025 at 10:35 AM
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-slate-700"></div>

              {/* Filter & Search Row */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-teal-500" />
                  <h4 className="text-slate-200">Filter & Search Patches</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-slate-300">Search</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Package name or CVE ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Severity</Label>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-white">All</SelectItem>
                        <SelectItem value="critical" className="text-white">Critical</SelectItem>
                        <SelectItem value="high" className="text-white">High</SelectItem>
                        <SelectItem value="medium" className="text-white">Medium</SelectItem>
                        <SelectItem value="low" className="text-white">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-white">All</SelectItem>
                        <SelectItem value="available" className="text-white">Available</SelectItem>
                        <SelectItem value="excluded" className="text-white">Excluded</SelectItem>
                        <SelectItem value="deployed" className="text-white">Deployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Request Latest Updates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patch Details Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Patch Details</CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedPatches.length} of {filteredPatches.length} selected
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {selectedPatches.length === filteredPatches.length ? 'Deselect All' : 'Select All'}
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300 w-12"></TableHead>
                      <TableHead className="text-slate-300">Package Name</TableHead>
                      <TableHead className="text-slate-300">Current</TableHead>
                      <TableHead className="text-slate-300">Available</TableHead>
                      <TableHead className="text-slate-300">Description</TableHead>
                      <TableHead className="text-slate-300">Severity</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatches.map((patch) => (
                      <TableRow key={patch.id} className="border-slate-700 hover:bg-slate-800/50">
                        <TableCell>
                          <Checkbox
                            checked={selectedPatches.includes(patch.id)}
                            onCheckedChange={() => handlePatchSelect(patch.id)}
                          />
                        </TableCell>
                        <TableCell className="text-white">{patch.packageName}</TableCell>
                        <TableCell className="text-slate-400">{patch.currentVersion}</TableCell>
                        <TableCell className="text-teal-400">{patch.availableVersion}</TableCell>
                        <TableCell className="text-slate-400 max-w-xs truncate">{patch.description}</TableCell>
                        <TableCell>
                          <Badge className={`${getSeverityColor(patch.severity)} text-white border-0`}>
                            {patch.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {patch.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Severity Distribution Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Severity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
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
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">Critical Patches</span>
                <Badge className="bg-red-500 text-white border-0">
                  {mockPatches.filter(p => p.severity === 'critical').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">High Priority</span>
                <Badge className="bg-orange-500 text-white border-0">
                  {mockPatches.filter(p => p.severity === 'high').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">Medium Priority</span>
                <Badge className="bg-yellow-500 text-white border-0">
                  {mockPatches.filter(p => p.severity === 'medium').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Low Priority</span>
                <Badge className="bg-green-500 text-white border-0">
                  {mockPatches.filter(p => p.severity === 'low').length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
