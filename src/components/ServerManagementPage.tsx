import { useState } from 'react';
import { Server, Plus, RefreshCw, FileDown, Search, Eye, Edit, Trash2, CheckCircle, XCircle, Copy, Activity, Terminal, Package as PackageIcon, Settings, Clock, Cpu, HardDrive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface ServerData {
  id: string;
  name: string;
  ipAddress: string;
  os: string;
  kernelVersion: string;
  agentVersion: string;
  status: 'online' | 'offline';
  lastCheckIn: string;
  description?: string;
  authToken?: string;
  uptime?: string;
  pendingUpdates?: number;
}

const mockServers: ServerData[] = [
  { id: '1', name: 'Server-01', ipAddress: '192.168.1.101', os: 'Ubuntu 20.04 LTS', kernelVersion: '5.4.0-65', agentVersion: '2.1.0', status: 'online', lastCheckIn: '2 minutes ago', uptime: '15 days', pendingUpdates: 12 },
  { id: '2', name: 'Server-02', ipAddress: '192.168.1.102', os: 'CentOS 8', kernelVersion: '4.18.0-240', agentVersion: '2.1.0', status: 'online', lastCheckIn: '5 minutes ago', uptime: '30 days', pendingUpdates: 8 },
  { id: '3', name: 'Server-03', ipAddress: '192.168.1.103', os: 'Debian 11', kernelVersion: '5.10.0-8', agentVersion: '2.0.9', status: 'online', lastCheckIn: '1 minute ago', uptime: '45 days', pendingUpdates: 5 },
  { id: '4', name: 'Server-04', ipAddress: '192.168.1.104', os: 'Ubuntu 22.04 LTS', kernelVersion: '5.15.0-52', agentVersion: '2.1.0', status: 'offline', lastCheckIn: '2 hours ago', uptime: '0 days', pendingUpdates: 0 },
  { id: '5', name: 'Server-05', ipAddress: '192.168.1.105', os: 'RHEL 8', kernelVersion: '4.18.0-305', agentVersion: '2.1.0', status: 'online', lastCheckIn: '3 minutes ago', uptime: '60 days', pendingUpdates: 15 },
  { id: '6', name: 'Server-06', ipAddress: '192.168.1.106', os: 'Ubuntu 20.04 LTS', kernelVersion: '5.4.0-65', agentVersion: '2.0.8', status: 'online', lastCheckIn: '4 minutes ago', uptime: '20 days', pendingUpdates: 7 },
  { id: '7', name: 'Server-07', ipAddress: '192.168.1.107', os: 'Debian 10', kernelVersion: '4.19.0-18', agentVersion: '2.1.0', status: 'offline', lastCheckIn: '1 day ago', uptime: '0 days', pendingUpdates: 0 },
  { id: '8', name: 'Server-08', ipAddress: '192.168.1.108', os: 'Ubuntu 22.04 LTS', kernelVersion: '5.15.0-52', agentVersion: '2.1.0', status: 'online', lastCheckIn: '1 minute ago', uptime: '10 days', pendingUpdates: 20 },
];

const recentLogs = [
  { timestamp: '2025-10-21 10:35:22', event: 'Agent health check completed', level: 'info' },
  { timestamp: '2025-10-21 10:30:15', event: 'Patch scan initiated', level: 'info' },
  { timestamp: '2025-10-21 10:25:08', event: 'Connection established', level: 'success' },
  { timestamp: '2025-10-21 09:15:45', event: 'Agent started', level: 'success' },
];

export function ServerManagementPage() {
  const [servers, setServers] = useState<ServerData[]>(mockServers);
  const [searchTerm, setSearchTerm] = useState('');
  const [osFilter, setOsFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerData | null>(null);
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);
  const [viewingServer, setViewingServer] = useState<ServerData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    os: '',
    description: '',
    authToken: '',
  });

  // Filtered and paginated data
  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.ipAddress.includes(searchTerm);
    const matchesOS = osFilter === 'all' || server.os.includes(osFilter);
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    return matchesSearch && matchesOS && matchesStatus;
  });

  const totalPages = Math.ceil(filteredServers.length / itemsPerPage);
  const paginatedServers = filteredServers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'online').length;
  const offlineServers = servers.filter(s => s.status === 'offline').length;
  const totalPendingUpdates = servers.reduce((sum, s) => sum + (s.pendingUpdates || 0), 0);

  const generateToken = () => {
    const token = 'APM-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setFormData({ ...formData, authToken: token });
    toast.success('Authentication token generated');
  };

  const testConnection = () => {
    toast.info('Testing connection to ' + formData.ipAddress + '...');
    setTimeout(() => {
      toast.success('Connection successful!');
    }, 1500);
  };

  const handleAddServer = () => {
    setEditingServer(null);
    setFormData({ name: '', ipAddress: '', os: '', description: '', authToken: '' });
    setShowAddEditModal(true);
  };

  const handleEditServer = (server: ServerData) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      ipAddress: server.ipAddress,
      os: server.os,
      description: server.description || '',
      authToken: server.authToken || '',
    });
    setShowAddEditModal(true);
  };

  const handleSaveServer = () => {
    if (editingServer) {
      setServers(servers.map(s => s.id === editingServer.id ? { ...s, ...formData } : s));
      toast.success('Server updated successfully');
    } else {
      const newServer: ServerData = {
        id: (servers.length + 1).toString(),
        name: formData.name,
        ipAddress: formData.ipAddress,
        os: formData.os,
        kernelVersion: '5.4.0-65',
        agentVersion: '2.1.0',
        status: 'offline',
        lastCheckIn: 'Never',
        description: formData.description,
        authToken: formData.authToken,
        uptime: '0 days',
        pendingUpdates: 0,
      };
      setServers([...servers, newServer]);
      toast.success('Server added successfully');
    }
    setShowAddEditModal(false);
  };

  const handleDeleteServer = (id: string) => {
    setServerToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (serverToDelete) {
      setServers(servers.filter(s => s.id !== serverToDelete));
      toast.success('Server deleted successfully');
    }
    setShowDeleteDialog(false);
    setServerToDelete(null);
  };

  const handleViewServer = (server: ServerData) => {
    setViewingServer(server);
    setShowDetailPanel(true);
  };

  const handleResync = (serverId: string) => {
    toast.info('Resyncing server...');
    setTimeout(() => {
      toast.success('Server resynced successfully');
    }, 1000);
  };

  const handleSyncAll = () => {
    toast.info('Syncing all servers...');
    setTimeout(() => {
      toast.success('All servers synced successfully');
    }, 2000);
  };

  const handleBulkDelete = () => {
    if (selectedServers.length === 0) {
      toast.error('Please select servers to delete');
      return;
    }
    setServers(servers.filter(s => !selectedServers.includes(s.id)));
    setSelectedServers([]);
    toast.success(`${selectedServers.length} server(s) deleted`);
  };

  const handleSelectAll = () => {
    if (selectedServers.length === paginatedServers.length) {
      setSelectedServers([]);
    } else {
      setSelectedServers(paginatedServers.map(s => s.id));
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Token copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-white">Server Management</h2>
          <p className="text-slate-400 mt-1">Manage and monitor your Linux server agents</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleAddServer} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Server
          </Button>
          <Button onClick={handleSyncAll} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All Servers
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Total Servers</CardTitle>
            <Server className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{totalServers}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Online Servers</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{onlineServers}</div>
            <p className="text-xs text-slate-400 mt-1">
              {((onlineServers / totalServers) * 100).toFixed(0)}% uptime
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Offline Servers</CardTitle>
            <XCircle className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{offlineServers}</div>
            <p className="text-xs text-slate-400 mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Pending Updates</CardTitle>
            <PackageIcon className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{totalPendingUpdates}</div>
            <p className="text-xs text-slate-400 mt-1">
              Across all servers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Server Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-white">Servers</CardTitle>
            {selectedServers.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="border-red-600 text-red-400 hover:bg-red-950/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedServers.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name or IP address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <Select value={osFilter} onValueChange={setOsFilter}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Filter by OS" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All OS</SelectItem>
                <SelectItem value="Ubuntu" className="text-white">Ubuntu</SelectItem>
                <SelectItem value="CentOS" className="text-white">CentOS</SelectItem>
                <SelectItem value="Debian" className="text-white">Debian</SelectItem>
                <SelectItem value="RHEL" className="text-white">RHEL</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="online" className="text-white">Online</SelectItem>
                <SelectItem value="offline" className="text-white">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 bg-slate-900/30">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedServers.length === paginatedServers.length && paginatedServers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">IP Address</TableHead>
                  <TableHead className="text-slate-300">Operating System</TableHead>
                  <TableHead className="text-slate-300">Kernel</TableHead>
                  <TableHead className="text-slate-300">Agent</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Last Check-in</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-slate-400 py-8">
                      No servers found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedServers.map((server) => (
                    <TableRow key={server.id} className="border-slate-700 hover:bg-slate-800/30">
                      <TableCell>
                        <Checkbox
                          checked={selectedServers.includes(server.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedServers([...selectedServers, server.id]);
                            } else {
                              setSelectedServers(selectedServers.filter(id => id !== server.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-white">{server.name}</TableCell>
                      <TableCell className="text-slate-400">{server.ipAddress}</TableCell>
                      <TableCell className="text-slate-400">{server.os}</TableCell>
                      <TableCell className="text-slate-400">{server.kernelVersion}</TableCell>
                      <TableCell className="text-slate-400">{server.agentVersion}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${server.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={server.status === 'online' ? 'text-green-400' : 'text-red-400'}>
                            {server.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">{server.lastCheckIn}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewServer(server)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditServer(server)}
                            className="text-teal-400 hover:text-teal-300 hover:bg-teal-950/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResync(server.id)}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/20"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteServer(server.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredServers.length)} of {filteredServers.length} servers
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-600 text-slate-300"
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page 
                        ? 'bg-teal-600 hover:bg-teal-700' 
                        : 'border-slate-600 text-slate-300'
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-600 text-slate-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Server Modal */}
      <Dialog open={showAddEditModal} onOpenChange={setShowAddEditModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingServer ? 'Edit Server' : 'Add New Server'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingServer ? 'Update server information' : 'Register a new Linux server agent'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Server Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Server-01"
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">IP Address</Label>
                <Input
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  placeholder="e.g., 192.168.1.101"
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300">Operating System</Label>
              <Select value={formData.os} onValueChange={(value) => setFormData({ ...formData, os: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white mt-1">
                  <SelectValue placeholder="Select OS type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Ubuntu 20.04 LTS" className="text-white">Ubuntu 20.04 LTS</SelectItem>
                  <SelectItem value="Ubuntu 22.04 LTS" className="text-white">Ubuntu 22.04 LTS</SelectItem>
                  <SelectItem value="CentOS 8" className="text-white">CentOS 8</SelectItem>
                  <SelectItem value="Debian 10" className="text-white">Debian 10</SelectItem>
                  <SelectItem value="Debian 11" className="text-white">Debian 11</SelectItem>
                  <SelectItem value="RHEL 8" className="text-white">RHEL 8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300">Authentication Token</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={formData.authToken}
                  onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                  placeholder="Auto-generated token"
                  className="bg-slate-900/50 border-slate-600 text-white"
                  readOnly
                />
                <Button
                  onClick={generateToken}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Generate Token
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-slate-300">Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional server information..."
                className="bg-slate-900/50 border-slate-600 text-white mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={testConnection}
              className="border-slate-600 text-slate-300"
              disabled={!formData.ipAddress}
            >
              <Activity className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddEditModal(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveServer}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={!formData.name || !formData.ipAddress || !formData.os}
            >
              {editingServer ? 'Update Server' : 'Add Server'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Server</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this server? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Server Detail Side Panel */}
      <Sheet open={showDetailPanel} onOpenChange={setShowDetailPanel}>
        <SheetContent className="bg-slate-800 border-slate-700 text-white w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-teal-500" />
              {viewingServer?.name}
            </SheetTitle>
            <SheetDescription className="text-slate-400">
              Server details and management
            </SheetDescription>
          </SheetHeader>

          {viewingServer && (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="patches">Patches</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">System Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <Badge className={viewingServer.status === 'online' ? 'bg-green-600' : 'bg-red-600'}>
                        {viewingServer.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IP Address</span>
                      <span className="text-white">{viewingServer.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Operating System</span>
                      <span className="text-white">{viewingServer.os}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kernel Version</span>
                      <span className="text-white">{viewingServer.kernelVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Agent Version</span>
                      <span className="text-white">{viewingServer.agentVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-white">{viewingServer.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Check-in</span>
                      <span className="text-white">{viewingServer.lastCheckIn}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Resource Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Cpu className="w-4 h-4" /> CPU Usage
                        </span>
                        <span className="text-white">42%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <HardDrive className="w-4 h-4" /> Memory Usage
                        </span>
                        <span className="text-white">68%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <HardDrive className="w-4 h-4" /> Disk Usage
                        </span>
                        <span className="text-white">55%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs" className="mt-4">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Recent Activity Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 font-mono text-sm">
                        {recentLogs.map((log, idx) => (
                          <div key={idx} className={`p-2 rounded ${
                            log.level === 'success' ? 'bg-green-950/20 text-green-400' :
                            log.level === 'error' ? 'bg-red-950/20 text-red-400' :
                            'bg-slate-800/50 text-slate-300'
                          }`}>
                            <span className="text-slate-500">[{log.timestamp}]</span> {log.event}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patches" className="mt-4">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <PackageIcon className="w-5 h-5" />
                      Pending Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <div>
                          <p className="text-white">Critical Updates</p>
                          <p className="text-xs text-slate-400">Security patches required</p>
                        </div>
                        <Badge className="bg-red-600">5</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <div>
                          <p className="text-white">High Priority</p>
                          <p className="text-xs text-slate-400">Important updates</p>
                        </div>
                        <Badge className="bg-orange-600">4</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <div>
                          <p className="text-white">Medium Priority</p>
                          <p className="text-xs text-slate-400">Regular updates</p>
                        </div>
                        <Badge className="bg-yellow-600">3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Server Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Authentication Token</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={viewingServer.authToken || 'APM-xxxxxxxxxxxx'}
                          className="bg-slate-800/50 border-slate-600 text-white"
                          readOnly
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToken(viewingServer.authToken || '')}
                          className="border-slate-600"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-orange-600 text-orange-400 hover:bg-orange-950/20"
                    >
                      Regenerate Token
                    </Button>
                    <div className="pt-4 border-t border-slate-700">
                      <Button
                        variant="outline"
                        className="w-full border-red-600 text-red-400 hover:bg-red-950/20"
                        onClick={() => {
                          setShowDetailPanel(false);
                          handleDeleteServer(viewingServer.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Server
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
