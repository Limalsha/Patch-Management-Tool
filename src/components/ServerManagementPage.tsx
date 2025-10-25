import { useState, useEffect } from "react";
import axios from "axios";
import {
  Server, Plus, RefreshCw, FileDown, Search, Eye, Edit, Trash2,
  CheckCircle, XCircle, Copy, Activity, Terminal, Package as PackageIcon,
  Settings, Cpu, HardDrive
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface ServerData {
  id: number;
  name: string;
  ip_address: string;
  os_type: string;
  kernel_version: string;
  agent_version: string;
  status: "online" | "offline";
  last_check_in: string;
  description?: string;
  auth_token?: string;
  uptime?: string;
  pending_updates?: number;
}

export function ServerManagementPage() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [osFilter, setOsFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerData | null>(null);
  const [serverToDelete, setServerToDelete] = useState<number | null>(null);
  const [viewingServer, setViewingServer] = useState<ServerData | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    os_type: "",
    description: "",
    auth_token: "",
  });

  // 🔹 Refresh servers from backend
  const refreshServers = () => {
    setLoading(true);
    axios
  .get("http://127.0.0.1:5000/api/servers")
  .then((res) => setServers(res.data))
  .catch((err) => console.error("Error", err))
  .then(() => setLoading(false));
  };

  // Load data
  useEffect(() => {
    refreshServers();
  }, []);

  // 🔹 Stats
  const totalServers = servers.length;
  const onlineServers = servers.filter((s) => s.status === "online").length;
  const offlineServers = servers.filter((s) => s.status === "offline").length;
  const totalPendingUpdates = servers.reduce((sum, s) => sum + (s.pending_updates || 0), 0);

  // 🔹 Add/Edit Server
  const handleSaveServer = () => {
    const payload = {
      name: formData.name,
      ip_address: formData.ip_address,
      os_type: formData.os_type,
      description: formData.description,
      auth_token: formData.auth_token,
    };

    if (editingServer) {
      axios
        .put(`http://127.0.0.1:5000/api/servers/${editingServer.id}`, payload)
        .then(() => {
          toast.success("Server updated successfully");
          refreshServers();
        })
        .catch(() => toast.error("Update failed"));
    } else {
      axios
        .post("http://127.0.0.1:5000/api/servers", payload)
        .then(() => {
          toast.success("Server added successfully");
          refreshServers();
        })
        .catch(() => toast.error("Add failed"));
    }

    setShowAddEditModal(false);
  };

  // 🔹 Delete Server
  const confirmDelete = () => {
    if (!serverToDelete) return;
    axios
      .delete(`http://127.0.0.1:5000/api/servers/${serverToDelete}`)
      .then(() => {
        toast.success("Server deleted successfully");
        refreshServers();
      })
      .catch(() => toast.error("Delete failed"))
      .finally(() => {
        setShowDeleteDialog(false);
        setServerToDelete(null);
      });
  };

  // 🔹 Helper Actions
  const generateToken = () => {
    const token = "APM-" + Math.random().toString(36).substring(2, 15);
    setFormData({ ...formData, auth_token: token });
    toast.success("Auth token generated");
  };

  const handleAddServer = () => {
    setEditingServer(null);
    setFormData({ name: "", ip_address: "", os_type: "", description: "", auth_token: "" });
    setShowAddEditModal(true);
  };

  const handleEditServer = (server: ServerData) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      ip_address: server.ip_address,
      os_type: server.os_type,
      description: server.description || "",
      auth_token: server.auth_token || "",
    });
    setShowAddEditModal(true);
  };

  const handleViewServer = (server: ServerData) => {
    setViewingServer(server);
    setShowDetailPanel(true);
  };

  const filteredServers = servers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ip_address.includes(searchTerm);
    const matchesOS = osFilter === "all" || s.os_type.includes(osFilter);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesOS && matchesStatus;
  });

  const paginatedServers = filteredServers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-white">Server Management</h2>
          <p className="text-slate-400 mt-1">Manage your Linux servers</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={handleAddServer} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Server
          </Button>
          <Button onClick={refreshServers} variant="outline" className="border-slate-600 text-slate-300">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-slate-300">Total Servers</CardTitle></CardHeader>
          <CardContent><div className="text-3xl text-white">{totalServers}</div></CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-slate-300">Online</CardTitle></CardHeader>
          <CardContent><div className="text-3xl text-green-400">{onlineServers}</div></CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-slate-300">Offline</CardTitle></CardHeader>
          <CardContent><div className="text-3xl text-red-400">{offlineServers}</div></CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-slate-300">Pending Updates</CardTitle></CardHeader>
          <CardContent><div className="text-3xl text-orange-400">{totalPendingUpdates}</div></CardContent>
        </Card>
      </div>

      {/* Server Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Servers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-slate-400 py-8">Loading servers...</p>
          ) : error ? (
            <p className="text-center text-red-400 py-8">{error}</p>
          ) : paginatedServers.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No servers found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-900/30 border-slate-700">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">IP Address</TableHead>
                  <TableHead className="text-slate-300">Operating System</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServers.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-800/30">
                    <TableCell className="text-white">{s.name}</TableCell>
                    <TableCell className="text-slate-400">{s.ip_address}</TableCell>
                    <TableCell className="text-slate-400">{s.os_type}</TableCell>
                    <TableCell>
                      <Badge className={s.status === "online" ? "bg-green-600" : "bg-red-600"}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewServer(s)} className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditServer(s)} className="text-teal-400 hover:text-teal-300">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setServerToDelete(s.id); setShowDeleteDialog(true); }} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={showAddEditModal} onOpenChange={setShowAddEditModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingServer ? "Edit Server" : "Add New Server"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Server Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-slate-900 border-slate-600 text-white" />
            <Label>IP Address</Label>
            <Input value={formData.ip_address} onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })} className="bg-slate-900 border-slate-600 text-white" />
            <Label>Operating System</Label>
            <Input value={formData.os_type} onChange={(e) => setFormData({ ...formData, os_type: e.target.value })} className="bg-slate-900 border-slate-600 text-white" />
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-slate-900 border-slate-600 text-white" />
            <Button onClick={generateToken} variant="outline" className="border-slate-600 text-slate-300">Generate Token</Button>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveServer} className="bg-teal-600 hover:bg-teal-700">
              {editingServer ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Server</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Panel */}
      <Sheet open={showDetailPanel} onOpenChange={setShowDetailPanel}>
        <SheetContent className="bg-slate-800 text-white border-slate-700">
          <SheetHeader>
            <SheetTitle>{viewingServer?.name}</SheetTitle>
            <SheetDescription>{viewingServer?.ip_address}</SheetDescription>
          </SheetHeader>
          {viewingServer && (
            <div className="mt-4 space-y-2">
              <p><strong>Status:</strong> {viewingServer.status}</p>
              <p><strong>OS:</strong> {viewingServer.os_type}</p>
              <p><strong>Uptime:</strong> {viewingServer.uptime}</p>
              <p><strong>Pending Updates:</strong> {viewingServer.pending_updates}</p>
              <p><strong>Token:</strong> {viewingServer.auth_token}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
