import { Shield, LayoutDashboard, Package, LogOut, Rocket, Server, Brain } from 'lucide-react';
import { Button } from './ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'servers' | 'patches' | 'apply' | 'anomaly';
  onNavigate: (page: 'dashboard' | 'servers' | 'patches' | 'apply' | 'anomaly') => void;
  onLogout: () => void;
}

export function AppLayout({ children, currentPage, onNavigate, onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-white">AI Patch Manager</h1>
                <p className="text-xs text-slate-400">Linux Security Management</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-2">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate('dashboard')}
                className={currentPage === 'dashboard' 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentPage === 'servers' ? 'default' : 'ghost'}
                onClick={() => onNavigate('servers')}
                className={currentPage === 'servers' 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }
              >
                <Server className="w-4 h-4 mr-2" />
                Servers
              </Button>
              <Button
                variant={currentPage === 'patches' ? 'default' : 'ghost'}
                onClick={() => onNavigate('patches')}
                className={currentPage === 'patches' 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }
              >
                <Package className="w-4 h-4 mr-2" />
                Patches
              </Button>
              <Button
                variant={currentPage === 'apply' ? 'default' : 'ghost'}
                onClick={() => onNavigate('apply')}
                className={currentPage === 'apply' 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }
              >
                <Rocket className="w-4 h-4 mr-2" />
                Apply
              </Button>
              <Button
                variant={currentPage === 'anomaly' ? 'default' : 'ghost'}
                onClick={() => onNavigate('anomaly')}
                className={currentPage === 'anomaly' 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }
              >
                <Brain className="w-4 h-4 mr-2" />
                Anomaly
              </Button>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>© 2025 AI Patch Manager. All rights reserved.</p>
            <p>Secure • Automated • Intelligent</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
