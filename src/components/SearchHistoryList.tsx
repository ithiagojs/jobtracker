import type { SearchHistory } from '../types/job';
import { History, Clock, ArrowUpRight, Trash2 } from 'lucide-react';


interface SearchHistoryListProps {
    history: SearchHistory[];
    onSelect: (item: SearchHistory) => void;
    onClear: () => void;
}

export function SearchHistoryList({ history, onSelect, onClear }: SearchHistoryListProps) {
    if (history.length === 0) return null;

    return (
        <div className="glass rounded-xl p-6 shadow-xl border border-border/50 hover-glow transition-smooth">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Histórico Recente</h2>
                </div>
                <button
                    onClick={onClear}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-muted"
                >
                    <Trash2 className="w-3 h-3" />
                    Limpar
                </button>
            </div>

            <div className="space-y-3">
                {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 cursor-pointer transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm group-hover:text-primary transition-colors">
                                {item.cargo}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex flex-wrap gap-2">
                                {item.location && <span>📍 {item.location}</span>}
                                <span>🌐 {item.sites.length} sites</span>
                                {item.dateFilter && <span>📅 {item.dateFilter}</span>}
                            </div>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
