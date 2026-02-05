import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SearchHistory } from '../types/job';
import { BarChart as BarChartIcon, TrendingUp } from 'lucide-react';

interface AnalyticsDashboardProps {
    history: SearchHistory[];
}

export function AnalyticsDashboard({ history }: AnalyticsDashboardProps) {
    // Calculate top roles
    const roleCounts: Record<string, number> = {};
    history.forEach(item => {
        const role = item.cargo.toLowerCase().trim();
        if (role) roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const topRoles = Object.entries(roleCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    // Calculate stats
    const totalSearches = history.length;
    const uniqueSites = new Set(history.flatMap(h => h.sites)).size;

    if (history.length < 3) return null;

    return (
        <div className="glass rounded-xl p-6 shadow-xl border border-border/50 animate-fade-in mt-6">
            <div className="flex items-center gap-2 mb-6">
                <BarChartIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Analytics de Busca</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                        <div className="text-muted-foreground text-xs font-medium mb-1">Total de Buscas</div>
                        <div className="text-2xl font-bold">{totalSearches}</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                        <div className="text-muted-foreground text-xs font-medium mb-1">Sites Explorados</div>
                        <div className="text-2xl font-bold">{uniqueSites}</div>
                    </div>
                    <div className="col-span-2 bg-gradient-card p-4 rounded-lg border border-primary/20 flex items-center justify-between">
                        <div>
                            <div className="text-primary text-xs font-medium mb-1">Cargo Mais Buscado</div>
                            <div className="text-lg font-bold capitalize truncate max-w-[200px]">
                                {topRoles[0]?.name || '-'}
                            </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-primary/50" />
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-muted/20 p-4 rounded-lg border border-border/30 min-h-[200px]">
                    <h3 className="text-xs font-medium text-muted-foreground mb-4">Top 5 Cargos</h3>
                    <div className="h-[160px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topRoles} layout="vertical" margin={{ left: 0, right: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.7 }}
                                    interval={0}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {topRoles.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
