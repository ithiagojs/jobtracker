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
import type { SearchHistory, SearchPreset, DateFilter, JobApplication, ApplicationStatus } from './types/job';
import { v4 as uuidv4 } from 'uuid';
import { Layout, Search as SearchIcon } from 'lucide-react';

type ViewMode = 'search' | 'board';

function App() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
  const [blocklist, setBlocklist] = useLocalStorage<string[]>('blocklist', []);
  const [history, setHistory] = useLocalStorage<SearchHistory[]>('search_history', []);
  const [presets, setPresets] = useLocalStorage<SearchPreset[]>('search_presets', []);
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('job_applications', []);

  const [viewMode, setViewMode] = useState<ViewMode>('search');

  // Current search state
  const [currentSearch, setCurrentSearch] = useState<{
    cargo: string;
    sites: string[];
    dateFilter: DateFilter;
    location: string;
  } | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (cargo: string, sites: string[], dateFilter: DateFilter, location: string) => {
    const newHistoryItem: SearchHistory = {
      id: uuidv4(),
      cargo,
      sites,
      dateFilter,
      location,
      timestamp: new Date().toISOString(),
      query: ''
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
    setCurrentSearch({ cargo, sites, dateFilter, location });
  };

  const handleSavePreset = (name: string) => {
    if (!currentSearch) return;
    const newPreset: SearchPreset = {
      id: uuidv4(),
      name,
      ...currentSearch,
      createdAt: new Date().toISOString()
    };
    setPresets(prev => [...prev, newPreset]);
    toast.success('Preset salvo com sucesso!');
  };

  const handleApplyHistory = (item: SearchHistory) => {
    setCurrentSearch({
      cargo: item.cargo,
      sites: item.sites,
      dateFilter: item.dateFilter,
      location: item.location
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info('Busca carregada do histórico');
  };

  const handleApplyPreset = (preset: SearchPreset) => {
    setCurrentSearch({
      cargo: preset.cargo,
      sites: preset.sites,
      dateFilter: preset.dateFilter,
      location: preset.location
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info(`Preset "${preset.name}" carregado`);
  };

  // Kanban Handlers
  const handleAddJob = (status: ApplicationStatus) => {
    const role = window.prompt("Cargo da vaga:");
    if (!role) return;
    const company = window.prompt("Empresa:");
    if (!company) return;

    const newJob: JobApplication = {
      id: uuidv4(),
      role,
      company,
      status,
      dateAdded: new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    };
    setApplications(prev => [...prev, newJob]);
    toast.success("Vaga adicionada ao quadro!");
  };

  const handleUpdateJobs = (updatedJobs: JobApplication[]) => {
    setApplications(updatedJobs);
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm("Remover esta vaga do quadro?")) {
      setApplications(prev => prev.filter(job => job.id !== id));
      toast.success("Vaga removida");
    }
  };

  const handleEditJob = (job: JobApplication) => {
    // Simple prompt implementation for MVP
    const notes = window.prompt("Notas para a vaga:", job.notes || "");
    if (notes !== null) {
      const updated = applications.map(j => j.id === job.id ? { ...j, notes, dateUpdated: new Date().toISOString() } : j);
      setApplications(updated);
      toast.success("Notas atualizadas");
    }
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
              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">{applications.length}</span>
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
                onSearch={handleSearch}
                initialValues={currentSearch || undefined}
              />

              <AnalyticsDashboard history={history} />

              <SearchHistoryList
                history={history}
                onSelect={handleApplyHistory}
                onClear={() => setHistory([])}
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
                presets={presets}
                onSelect={handleApplyPreset}
                onSave={handleSavePreset}
                onDelete={(id) => setPresets(prev => prev.filter(p => p.id !== id))}
                canSaveCurrent={!!currentSearch}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto h-full">
            <KanbanBoard
              jobs={applications}
              onUpdateJobs={handleUpdateJobs}
              onAddJob={handleAddJob}
              onDeleteJob={handleDeleteJob}
              onEditJob={handleEditJob}
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
