import { useState, useEffect } from 'react';
import { Search, ExternalLink, Calendar, MapPin } from 'lucide-react';
import type { DateFilter, JobSite } from '../types/job';
import { JOB_SITES, DATE_FILTER_OPTIONS } from '../types/job';
import { toast } from 'sonner';

interface SearchEngineProps {
    blocklist: string[];
    onSearch: (cargo: string, sites: string[], date: DateFilter, location: string) => void;
    initialValues?: {
        cargo: string;
        sites: string[];
        dateFilter: DateFilter;
        location: string;
    }
}

export function SearchEngine({ blocklist, onSearch, initialValues }: SearchEngineProps) {
    const [cargo, setCargo] = useState(initialValues?.cargo || '');
    const [location, setLocation] = useState(initialValues?.location || '');
    const [selectedSites, setSelectedSites] = useState<string[]>(initialValues?.sites || []);
    const [dateFilter, setDateFilter] = useState<DateFilter>(initialValues?.dateFilter || '');

    // Update state when initialValues change (e.g. loading preset)
    useEffect(() => {
        if (initialValues) {
            setCargo(initialValues.cargo);
            setLocation(initialValues.location);
            setSelectedSites(initialValues.sites);
            setDateFilter(initialValues.dateFilter);
        }
    }, [initialValues]);

    // Group sites by category
    const categories: { id: string; label: string; sites: JobSite[] }[] = [
        { id: 'ats-global', label: 'ATS Globais', sites: JOB_SITES.filter(s => s.category === 'ats-global') },
        { id: 'brasil', label: 'Brasil', sites: JOB_SITES.filter(s => s.category === 'brasil') },
        { id: 'startups', label: 'Startups & Remoto', sites: JOB_SITES.filter(s => s.category === 'startups') },
        { id: 'tech', label: 'Big Tech & Context', sites: JOB_SITES.filter(s => ['linkedin', 'context'].includes(s.category)) },
    ];

    const toggleSite = (siteId: string) => {
        setSelectedSites(prev =>
            prev.includes(siteId)
                ? prev.filter(id => id !== siteId)
                : [...prev, siteId]
        );
    };

    const toggleCategory = (categorySites: JobSite[]) => {
        const siteIds = categorySites.map(s => s.id);
        const allSelected = siteIds.every(id => selectedSites.includes(id));

        if (allSelected) {
            setSelectedSites(prev => prev.filter(id => !siteIds.includes(id)));
        } else {
            setSelectedSites(prev => [...new Set([...prev, ...siteIds])]);
        }
    };

    const generateGoogleDork = () => {
        if (!cargo.trim()) return '';

        const sites = selectedSites.map(id => JOB_SITES.find(s => s.id === id)).filter(Boolean);

        let query = `"${cargo}"`;

        if (location.trim()) {
            query += ` "${location}"`;
        }

        if (sites.length > 0) {
            const siteQueries = sites.map(site => `site:${site!.domain}`).join(' OR ');
            query += ` (${siteQueries})`;
        }

        // Add blocklist exclusions
        blocklist.forEach(company => {
            query += ` -"${company}"`;
        });

        return query;
    };

    const handleSearch = () => {
        const query = generateGoogleDork();
        if (query) {
            // Notify parent about search for history
            onSearch(cargo, selectedSites, dateFilter, location);

            let googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            if (dateFilter) {
                googleUrl += `&tbs=qdr:${dateFilter}`;
            }
            window.open(googleUrl, '_blank');
            toast.success('Busca aberta no Google!');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && cargo.trim()) {
            handleSearch();
        }
    };



    return (
        <div className="glass rounded-xl p-6 shadow-xl border border-border/50 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h2 className="text-xl font-semibold text-foreground">Motor de Busca</h2>
            </div>

            {/* Inputs Grid */}
            <div className="grid gap-4 md:grid-cols-[1.5fr,1fr,200px] mb-6">
                <div className="space-y-2">
                    <label htmlFor="cargo-input" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Cargo / Posição
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                        <input
                            id="cargo-input"
                            type="text"
                            placeholder="Ex: Frontend Developer"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="location-input" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Localização <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                        <input
                            id="location-input"
                            type="text"
                            placeholder="Ex: São Paulo, Remoto"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Data
                    </label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                    >
                        {DATE_FILTER_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Site Filters */}
            <div className="space-y-4 mb-6">
                <label className="text-sm font-medium">Filtrar por Sites</label>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {categories.map(category => (
                        <div key={category.id} className="space-y-3">
                            <div className="flex items-center gap-2 pb-1 border-b border-border/30">
                                <input
                                    type="checkbox"
                                    id={`cat-${category.id}`}
                                    checked={category.sites.every(s => selectedSites.includes(s.id))}
                                    onChange={() => toggleCategory(category.sites)}
                                    className="w-4 h-4 rounded border-2 border-slate-900 appearance-none bg-background checked:bg-primary checked:border-primary transition-all cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-[10px] checked:after:left-[2px] checked:after:top-[-1px]"
                                />
                                <label
                                    htmlFor={`cat-${category.id}`}
                                    className="text-sm font-semibold text-primary cursor-pointer select-none"
                                >
                                    {category.label}
                                </label>
                            </div>
                            <div className="space-y-1.5 max-h-[150px] overflow-y-auto scrollbar-thin pr-2">
                                {category.sites.map(site => (
                                    <div key={site.id} className="flex items-center gap-2 hover:bg-muted/30 p-1 rounded hover-glow">
                                        <input
                                            type="checkbox"
                                            id={site.id}
                                            checked={selectedSites.includes(site.id)}
                                            onChange={() => toggleSite(site.id)}
                                            className="w-3.5 h-3.5 rounded border border-slate-900 appearance-none bg-background checked:bg-primary checked:border-primary transition-all cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-[8px] checked:after:left-[1px] checked:after:top-[-1px]"
                                        />
                                        <label
                                            htmlFor={site.id}
                                            className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-smooth select-none truncate flex-1"
                                            title={site.name}
                                        >
                                            {site.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Query Preview */}


            {/* Action Button */}
            <button
                onClick={handleSearch}
                disabled={!cargo.trim()}
                className="w-full bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 text-lg"
            >
                <ExternalLink className="w-5 h-5" />
                Buscar Vagas no Google
            </button>
        </div>
    );
}
