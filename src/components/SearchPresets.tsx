import { useState } from 'react';
import type { SearchPreset } from '../types/job';
import { Bookmark, Star, ArrowRight, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface SearchPresetsProps {
    presets: SearchPreset[];
    onSelect: (preset: SearchPreset) => void;
    onSave: (name: string) => void;
    onDelete: (id: string) => void;
    canSaveCurrent: boolean;
}

export function SearchPresets({ presets, onSelect, onSave, onDelete, canSaveCurrent }: SearchPresetsProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [presetName, setPresetName] = useState('');

    const handleSave = () => {
        if (!presetName.trim()) {
            toast.error('Digite um nome para o preset');
            return;
        }
        onSave(presetName);
        setPresetName('');
        setIsAdding(false);
    };

    return (
        <div className="glass rounded-xl p-6 shadow-xl border border-border/50 hover-glow transition-smooth">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-accent" />
                    <h2 className="text-xl font-semibold text-foreground">Favoritos</h2>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    disabled={!canSaveCurrent}
                    className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-3 h-3" />
                    Salvar Atual
                </button>
            </div>

            {isAdding && (
                <div className="mb-4 flex gap-2 animate-slide-up">
                    <input
                        type="text"
                        placeholder="Nome do preset (ex: Vagas React SP)"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        autoFocus
                    />
                    <button
                        onClick={handleSave}
                        className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90"
                    >
                        Salvar
                    </button>
                </div>
            )}

            <div className="space-y-2">
                {presets.length > 0 ? (
                    presets.map((preset) => (
                        <div
                            key={preset.id}
                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 bg-card/30 transition-all cursor-pointer"
                            onClick={() => onSelect(preset)}
                        >
                            <div className="flex items-center gap-3">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                                <div>
                                    <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                        {preset.name}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        {preset.cargo} • {preset.location || 'Qualquer local'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(preset.id);
                                    }}
                                    className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 rounded"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-50 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-muted-foreground text-xs">
                        Nenhum favorito salvo
                    </div>
                )}
            </div>
        </div>
    );
}
