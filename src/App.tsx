import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchEngine } from './components/SearchEngine';
import { BlocklistManager } from './components/BlocklistManager';
import { SearchHistoryList } from './components/SearchHistoryList';
import { SearchPresets } from './components/SearchPresets';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { Toaster, toast } from 'sonner';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSearchManager } from './hooks/useSearchManager';
import { useJobBoard } from './hooks/useJobBoard';
import { Layout, Search as SearchIcon } from 'lucide-react';

type ViewMode = 'search' | 'board';

function App() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
  const [blocklist, setBlocklist] = useLocalStorage<string[]>('blocklist', []);
  const [viewMode, setViewMode] = useState<ViewMode>('search');

  // Logic extracted to custom hooks for Clean Code
  const searchManager = useSearchManager();
  const jobBoard = useJobBoard();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Toaster position="top-right" richColors theme={theme} />
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Navigation Bar */}
      <div className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setViewMode('search')}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors ${viewMode === 'search' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <SearchIcon className="w-4 h-4" />
              Busca & Analytics
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors ${viewMode === 'board' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Layout className="w-4 h-4" />
              Minhas Vagas
              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">{jobBoard.applications.length}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1">
        {viewMode === 'search' ? (
          <div className="grid gap-8 lg:grid-cols-[1fr,350px] max-w-7xl mx-auto animate-fade-in">
            {/* Main Column */}
            <div className="space-y-8">
              <SearchEngine
                blocklist={blocklist}
                onSearch={searchManager.performSearch}
                initialValues={searchManager.currentSearch || undefined}
              />

              <AnalyticsDashboard history={searchManager.history} />

              <SearchHistoryList
                history={searchManager.history}
                onSelect={searchManager.applyHistory}
                onClear={searchManager.clearHistory}
              />
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              <BlocklistManager
                blocklist={blocklist}
                onAdd={(company) => {
                  setBlocklist(prev => [...prev, company]);
                  toast.success('Empresa bloqueada');
                }}
                onRemove={(company) => {
                  setBlocklist(prev => prev.filter(c => c !== company));
                  toast.success('Bloqueio removido');
                }}
                onImport={(companies) => {
                  setBlocklist(prev => [...new Set([...prev, ...companies])]);
                }}
              />

              <SearchPresets
                presets={searchManager.presets}
                onSelect={searchManager.applyPreset}
                onSave={searchManager.savePreset}
                onDelete={searchManager.deletePreset}
                canSaveCurrent={!!searchManager.currentSearch}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto h-full">
            <KanbanBoard
              jobs={jobBoard.applications}
              onUpdateJobs={jobBoard.updateJobs}
              onAddJob={jobBoard.addJob}
              onDeleteJob={jobBoard.deleteJob}
              onEditJob={jobBoard.editJob}
            />
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/40 bg-muted/10 mt-auto">
        <p>
          Feito com carinho para turma de Dados pelo{' '}
          <a href="https://www.linkedin.com/in/ithiagojs/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
            Thiago J.
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
