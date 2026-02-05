import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { JobCard } from './JobCard';
import type { JobApplication, KanbanColumn as IColumn } from '../types/job';
import { cn } from '../lib/utils';

interface KanbanColumnProps {
    column: IColumn;
    jobs: JobApplication[];
    onDeleteJob: (id: string) => void;
    onEdit: (job: JobApplication) => void;
}

export function KanbanColumn({ column, jobs, onDeleteJob, onEdit }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div className="flex flex-col h-full min-w-0 bg-muted/10 rounded-xl border border-border/40">
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between px-3 py-2.5 bg-muted/20 rounded-t-xl border-b border-border/50",
                column.color
            )}>
                <span className="font-semibold text-xs uppercase tracking-wider">{column.title}</span>
                <span className="text-[10px] font-bold opacity-80 bg-background/80 px-1.5 py-0.5 rounded shadow-sm">
                    {jobs.length}
                </span>
            </div>

            {/* Drop Area */}
            <div
                ref={setNodeRef}
                className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-none"
            >
                <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onDelete={onDeleteJob}
                            onEdit={onEdit}
                        />
                    ))}
                </SortableContext>

                {jobs.length === 0 && (
                    <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-muted-foreground/30 border-2 border-dashed border-border/30 rounded-lg m-1">
                        <span className="text-xs">Vazio</span>
                    </div>
                )}
            </div>
        </div>
    );
}
