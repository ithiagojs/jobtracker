import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { SearchHistory, SearchPreset, DateFilter } from '../types/job';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function useSearchManager() {
    const [history, setHistory] = useLocalStorage<SearchHistory[]>('search_history', []);
    const [presets, setPresets] = useLocalStorage<SearchPreset[]>('search_presets', []);

    // Current search state
    const [currentSearch, setCurrentSearch] = useState<{
        cargo: string;
        sites: string[];
        dateFilter: DateFilter;
        location: string;
    } | null>(null);

    const performSearch = (cargo: string, sites: string[], dateFilter: DateFilter, location: string) => {
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

    const savePreset = (name: string) => {
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

    const deletePreset = (id: string) => {
        setPresets(prev => prev.filter(p => p.id !== id));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const applyHistory = (item: SearchHistory) => {
        setCurrentSearch({
            cargo: item.cargo,
            sites: item.sites,
            dateFilter: item.dateFilter,
            location: item.location
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info('Busca carregada do histórico');
    };

    const applyPreset = (preset: SearchPreset) => {
        setCurrentSearch({
            cargo: preset.cargo,
            sites: preset.sites,
            dateFilter: preset.dateFilter,
            location: preset.location
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info(`Preset "${preset.name}" carregado`);
    };

    return {
        history,
        presets,
        currentSearch,
        performSearch,
        savePreset,
        deletePreset,
        clearHistory,
        applyHistory,
        applyPreset
    };
}
