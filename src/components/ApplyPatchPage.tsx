import { useState } from 'react';
import { Rocket, PlayCircle, FileText, Ban, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

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

const servers = ['Server-01', 'Server-02', 'Server-03', 'Server-04', 'Server-05', 'Server-06', 'Server-07', 'Server-08'];

export function ApplyPatchPage() {
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [exclusionReason, setExclusionReason] = useState('');
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [showExclusionManagement, setShowExclusionManagement] = useState(false);
  const [excludedPackages, setExcludedPackages] = useState([
    { packageName: 'legacy-app', reason: 'Compatibility issues', date: '2025-10-15' },
    { packageName: 'custom-kernel', reason: 'Custom build required', date: '2025-10-10' },
  ]);

  const handleDeploy = (type: 'all' | 'selected' | 'simulate') => {
    if (!selectedServer) return;
    
    const logs = [
      `[${new Date().toLocaleTimeString()}] Initiating ${type} deployment...`,
      `[${new Date().toLocaleTimeString()}] Connecting to ${selectedServer}...`,
      `[${new Date().toLocaleTimeString()}] Connection established`,
      `[${new Date().toLocaleTimeString()}] Downloading packages...`,
      `[${new Date().toLocaleTimeString()}] Verifying signatures...`,
      `[${new Date().toLocaleTimeString()}] Installing updates...`,
      `[${new Date().toLocaleTimeString()}] openssl: 1.1.1f -> 1.1.1w [SUCCESS]`,
      `[${new Date().toLocaleTimeString()}] linux-kernel: 5.4.0-42 -> 5.4.0-65 [SUCCESS]`,
      `[${new Date().toLocaleTimeString()}] nginx: 1.18.0 -> 1.24.0 [SUCCESS]`,
      `[${new Date().toLocaleTimeString()}] curl: 7.68.0 -> 7.88.1 [SUCCESS]`,
      `[${new Date().toLocaleTimeString()}] openssh: 8.2p1 -> 9.3p1 [SUCCESS]`,
      `[${new Date().toLocaleTimeString()}] sudo: 1.8.31 -> 1.9.14 [SUCCESS]`,
      `[${new Date().toLocaleTimeString()}] legacy-app: SKIPPED (Excluded)`,
      `[${new Date().toLocaleTimeString()}] custom-kernel: SKIPPED (Excluded)`,
      `[${new Date().toLocaleTimeString()}] Deployment completed successfully`,
      `[${new Date().toLocaleTimeString()}] 6 packages updated, 2 packages skipped`,
    ];
    setDeploymentLogs(logs);
    setShowDeployDialog(true);
  };

  const handleAddExclusion = () => {
    if (!selectedPackage || !exclusionReason) return;
    
    const newExclusion = {
      packageName: selectedPackage,
      reason: exclusionReason,
      date: new Date().toISOString().split('T')[0],
    };
    
    setExcludedPackages([...excludedPackages, newExclusion]);
    setSelectedPackage('');
    setExclusionReason('');
  };

  const handleRemoveExclusion = (packageName: string) => {
    setExcludedPackages(excludedPackages.filter(pkg => pkg.packageName !== packageName));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-teal-500" />
              Deployment Controls
            </CardTitle>
            <CardDescription className="text-slate-400">
              Deploy patches to selected server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Server Selection */}
            <div className="space-y-2">
              <Label className="text-slate-300">Target Server</Label>
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
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

            {selectedServer && (
              <>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Server Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-white">{selectedServer} - Online</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Last Synced: October 21, 2025 at 10:35 AM
                  </p>
                </div>

                {/* Package Exclusion Toggle */}
                <div className="flex items-center space-x-2 p-3 bg-slate-900/30 rounded-lg border border-slate-700">
                  <Checkbox
                    id="show-exclusion"
                    checked={showExclusionManagement}
                    onCheckedChange={(checked) => setShowExclusionManagement(checked as boolean)}
                  />
                  <label
                    htmlFor="show-exclusion"
                    className="text-sm text-slate-300 cursor-pointer select-none flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4 text-orange-500" />
                    Enable Package Exclusion Management
                  </label>
                </div>

                {/* Package Exclusion Management Section */}
                {showExclusionManagement && (
                  <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-orange-500/30">
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                      <Ban className="w-5 h-5 text-orange-500" />
                      <h4 className="text-slate-200">Package Exclusion Management</h4>
                    </div>

                    {/* Add Exclusion Form */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-slate-300">Select Package</Label>
                        <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                          <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white mt-1">
                            <SelectValue placeholder="Choose package..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {mockPatches.map(patch => (
                              <SelectItem key={patch.id} value={patch.packageName} className="text-white">
                                {patch.packageName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300">Exclusion Reason</Label>
                        <Input
                          placeholder="e.g., Compatibility issues"
                          value={exclusionReason}
                          onChange={(e) => setExclusionReason(e.target.value)}
                          className="bg-slate-900/50 border-slate-600 text-white mt-1"
                        />
                      </div>
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={handleAddExclusion}
                        disabled={!selectedPackage || !exclusionReason}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Apply Exclusion
                      </Button>
                    </div>

                    {/* Excluded Packages List */}
                    <div className="space-y-2">
                      <h5 className="text-sm text-slate-300">Currently Excluded ({excludedPackages.length})</h5>
                      <div className="max-h-[200px] overflow-y-auto">
                        {excludedPackages.length === 0 ? (
                          <p className="text-xs text-slate-500 p-3 text-center bg-slate-900/50 rounded">
                            No packages excluded
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {excludedPackages.map((pkg, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded border border-slate-700 hover:bg-slate-800/50">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white truncate">{pkg.packageName}</p>
                                  <p className="text-xs text-slate-400 truncate">{pkg.reason}</p>
                                  <p className="text-xs text-slate-500">{pkg.date}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-400 hover:text-red-300 hover:bg-red-950/20 ml-2"
                                  onClick={() => handleRemoveExclusion(pkg.packageName)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-3 pt-4">
              <Button 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => handleDeploy('all')}
                disabled={!selectedServer}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Deploy All Updates
              </Button>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleDeploy('selected')}
                disabled={!selectedServer}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Deploy Selected Updates
              </Button>
              <Button 
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleDeploy('simulate')}
                disabled={!selectedServer}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Simulate Deployment
              </Button>
              <Button 
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Deployment Information</CardTitle>
            <CardDescription className="text-slate-400">
              Current deployment configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-300">Total Packages Available</span>
                <span className="text-white">{mockPatches.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-300">Critical Updates</span>
                <span className="text-red-400">
                  {mockPatches.filter(p => p.severity === 'critical').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-300">Excluded Packages</span>
                <span className="text-orange-400">{excludedPackages.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-300">Packages to Deploy</span>
                <span className="text-teal-400">
                  {mockPatches.length - excludedPackages.length}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm text-slate-300 mb-3">Deployment Options</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" />
                  <span>Automatic rollback on failure</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" />
                  <span>Pre-deployment backup enabled</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" />
                  <span>Post-deployment verification</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" />
                  <span>Email notification on completion</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Progress Dialog */}
      <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-teal-500" />
              Deployment Progress
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Live deployment logs from {selectedServer}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border border-slate-700 bg-slate-900/50 p-4">
            <div className="space-y-1 font-mono text-sm">
              {deploymentLogs.map((log, idx) => (
                <div key={idx} className={`${
                  log.includes('SUCCESS') ? 'text-green-400' :
                  log.includes('SKIPPED') ? 'text-yellow-400' :
                  log.includes('ERROR') ? 'text-red-400' :
                  'text-slate-300'
                }`}>
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeployDialog(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Close
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
