import { useEffect, useState } from "react";
import axios from "axios";
import {
  Server, Download, Search, Filter, Package, AlertTriangle, Clock,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";

interface Server {
  id: number;
  name: string;
  status: "online" | "offline";
}

interface Patch {
  id: number;
  packageName: string;
  currentVersion: string;
  availableVersion: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "available" | "excluded" | "deployed";
}

interface PatchStats {
  total_servers: number;
  online_servers: number;
  offline_servers: number;
  pending_updates: number;
}

export function PatchManagementPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [stats, setStats] = useState<PatchStats | null>(null);
  const [selectedServer, setSelectedServer] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedPatches, setSelectedPatches] = useState<string[]>([]);
  const [selectedPatchDescriptions, setSelectedPatchDescriptions] = useState<Patch[]>([]);

  // Fetch Stats and Servers
  useEffect(() => {
    axios
      .get<PatchStats>("http://127.0.0.1:5000/api/patches/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading patch stats:", err));

    axios
      .get<Server[]>("http://127.0.0.1:5000/api/servers")
      .then((res) => setServers(res.data))
      .catch((err) => console.error("Error loading servers:", err));
  }, []);

  // Fetch Patch Details for Selected Server
  const fetchPatchDetails = () => {
    if (!selectedServer) return;
    setLoading(true);
    axios
      .get<{ patches: Patch[] }>(`http://127.0.0.1:5000/api/patches/${selectedServer}`)
      .then((res) => {
        setPatches(res.data.patches);
        toast.success("Patch details loaded successfully");
        setSelectedPatches([]);
        setSelectedPatchDescriptions([]);
      })
      .catch(() => toast.error("Failed to load patch details"))
      .then(() => setLoading(false));
  };

  // Filter patches
  const filteredPatches = patches.filter((p) => {
    const matchesSearch =
      p.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || p.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const severityData = [
    { name: "Critical", value: patches.filter((p) => p.severity === "critical").length, color: "#ef4444" },
    { name: "High", value: patches.filter((p) => p.severity === "high").length, color: "#f97316" },
    { name: "Medium", value: patches.filter((p) => p.severity === "medium").length, color: "#eab308" },
    { name: "Low", value: patches.filter((p) => p.severity === "low").length, color: "#22c55e" },
  ];

  // Scroll to bottom when descriptions show
  useEffect(() => {
    if (selectedPatchDescriptions.length > 0) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [selectedPatchDescriptions]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-slate-300">Total Servers</CardTitle>
            <Server className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{stats?.total_servers ?? "-"}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-slate-300">Online</CardTitle>
            <Server className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{stats?.online_servers ?? "-"}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-slate-300">Offline</CardTitle>
            <Server className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{stats?.offline_servers ?? "-"}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-slate-300">Pending Updates</CardTitle>
            <Package className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{stats?.pending_updates ?? "-"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Server Selection + Patch Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex gap-2 items-center">
            <Server className="w-5 h-5 text-teal-500" /> Server Selection & Filters
          </CardTitle>
          <CardDescription className="text-slate-400">
            Select a server to view patch details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Server Selection Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label className="text-slate-300 mb-2 block">Select Server</Label>
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Choose a server" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {servers.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()} className="text-white">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={fetchPatchDetails}
                disabled={!selectedServer || loading}
              >
                {loading ? "Loading..." : "Get Patch Details"}
              </Button>
            </div>
          </div>

          {/* Patch Table */}
          {patches.length > 0 && (
            <Card className="mt-6 bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Patch Details</CardTitle>
                <CardDescription className="text-slate-400">
                  {filteredPatches.length} patches found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300 w-12"></TableHead>
                        <TableHead className="text-slate-300">Package</TableHead>
                        <TableHead className="text-slate-300">Current</TableHead>
                        <TableHead className="text-slate-300">Available</TableHead>
                        <TableHead className="text-slate-300">Severity</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatches.map((p) => (
                        <TableRow key={p.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedPatches.includes(p.id.toString())}
                              onCheckedChange={() => {
                                setSelectedPatches((prev) => {
                                  if (prev.includes(p.id.toString())) {
                                    setSelectedPatchDescriptions(
                                      selectedPatchDescriptions.filter((patch) => patch.id !== p.id)
                                    );
                                    return prev.filter((id) => id !== p.id.toString());
                                  } else {
                                    setSelectedPatchDescriptions([...selectedPatchDescriptions, p]);
                                    return [...prev, p.id.toString()];
                                  }
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-white">{p.packageName}</TableCell>
                          <TableCell className="text-slate-400">{p.currentVersion}</TableCell>
                          <TableCell className="text-teal-400">{p.availableVersion}</TableCell>
                          <TableCell>
                            <Badge className={`${getSeverityColor(p.severity)} text-white`}>
                              {p.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                              {p.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Selected Patch Description Section */}
          {selectedPatchDescriptions.length > 0 ? (
            <Card className="mt-6 bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Selected Patch Details</CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedPatchDescriptions.length} selected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPatchDescriptions.map((patch) => (
                  <div
                    key={patch.id}
                    className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">{patch.packageName}</h3>
                      <Badge className={`${getSeverityColor(patch.severity)} text-white`}>
                        {patch.severity}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{patch.description}</p>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Current: {patch.currentVersion}</span>
                      <span>Available: {patch.availableVersion}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            patches.length > 0 && (
              <Card className="mt-6 bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Patch Details</CardTitle>
                  <CardDescription className="text-slate-400">No patch selected</CardDescription>
                </CardHeader>
              </Card>
            )
          )}
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      {patches.length > 0 && (
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
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
