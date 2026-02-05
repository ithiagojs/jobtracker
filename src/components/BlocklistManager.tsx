import { useState, useRef } from 'react';
import { X, Plus, Upload, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface BlocklistManagerProps {
    blocklist: string[];
    onAdd: (company: string) => void;
    onRemove: (company: string) => void;
    onImport: (companies: string[]) => void;
}

export function BlocklistManager({ blocklist, onAdd, onRemove, onImport }: BlocklistManagerProps) {
    const [inputValue, setInputValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        const company = inputValue.trim();
        if (!company) {
            toast.error('Digite o nome da empresa');
            return;
        }
        if (blocklist.includes(company)) {
            toast.error('Empresa já está na lista');
            return;
        }
        onAdd(company);
        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    const handleExport = () => {
        if (blocklist.length === 0) {
            toast.error('Lista vazia para exportar');
            return;
        }
        const csvContent = "data:text/csv;charset=utf-8," + blocklist.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "jobtracker_blocklist.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${blocklist.length} empresas exportadas!`);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            const companies = text.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            if (companies.length > 0) {
                onImport(companies);
                toast.success(`${companies.length} empresas importadas!`);
            } else {
                toast.error('Arquivo vazio ou inválido');
            }
        };
        reader.readAsText(file);
        // Reset inputs
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="glass rounded-xl p-6 shadow-xl hover-glow transition-smooth animate-fade-in border border-border/50 h-fit">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-destructive rounded-full"></div>
                    <h2 className="text-xl font-semibold text-foreground">Blocklist</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleImportClick}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        title="Importar CSV"
                    >
                        <Upload className="w-4 h-4" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv,.txt"
                        className="hidden"
                    />
                    <button
                        onClick={handleExport}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        title="Exportar CSV"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
                Gerencie empresas indesejadas
            </p>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Ex: BairesDev..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                />
                <button
                    onClick={handleAdd}
                    className="bg-destructive/90 hover:bg-destructive text-destructive-foreground px-4 py-2.5 rounded-lg transition-smooth hover:shadow-lg hover:shadow-destructive/20 flex items-center gap-2 font-medium"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
                {blocklist.length > 0 ? (
                    blocklist.map((company, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2.5 group hover:bg-muted/50 transition-smooth"
                        >
                            <span className="text-sm font-medium truncate max-w-[180px]" title={company}>{company}</span>
                            <button
                                onClick={() => onRemove(company)}
                                className="text-muted-foreground hover:text-destructive transition-smooth opacity-0 group-hover:opacity-100 p-1"
                                aria-label={`Remover ${company}`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center gap-3 opacity-50">
                        <FileText className="w-8 h-8" />
                        <p>Nenhuma empresa bloqueada</p>
                    </div>
                )}
            </div>
        </div>
    );
}
