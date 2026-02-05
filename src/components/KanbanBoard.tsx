import { useState, useMemo } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { JobCard } from './JobCard';
import type { JobApplication, ApplicationStatus } from '../types/job';
import { KANBAN_COLUMNS } from '../types/job';
import { Plus, Layout } from 'lucide-react';

interface KanbanBoardProps {
    jobs: JobApplication[];
    onUpdateJobs: (jobs: JobApplication[]) => void;
    onAddJob: (status: ApplicationStatus) => void;
    onEditJob: (job: JobApplication) => void;
    onDeleteJob: (id: string) => void;
}

export function KanbanBoard({ jobs, onUpdateJobs, onAddJob, onEditJob, onDeleteJob }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = useMemo(() => {
        const cols: Record<ApplicationStatus, JobApplication[]> = {
            saved: [],
            applied: [],
            interview: [],
            offer: [],
            rejected: [],
        };

        // Sort jobs by date updated (newest first)
        [...jobs]
            .sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime())
            .forEach(job => {
                if (cols[job.status]) {
                    cols[job.status].push(job);
                }
            });

        return cols;
    }, [jobs]);

    const activeJob = useMemo(() =>
        jobs.find(job => job.id === activeId),
        [activeId, jobs]
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        // Find the containers (columns)
        const activeId = active.id as string;
        const overId = over.id as string;

        // Find job objects
        const activeJob = jobs.find(j => j.id === activeId);
        if (!activeJob) return;

        // If hovering over a column directly (empty column case)
        if (KANBAN_COLUMNS.some(c => c.id === overId)) {
            const overStatus = overId as ApplicationStatus;
            if (activeJob.status !== overStatus) {
                // Optimistic update for smoother drag over empty columns
                // We don't actually persist here, just calculate logic if needed
                // But usually DragEnd handles the data move.
            }
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const activeId = active.id as string;
        const overId = over?.id as string;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeJob = jobs.find(j => j.id === activeId);
        if (!activeJob) {
            setActiveId(null);
            return;
        }

        // Dropped on a Column (Empty or not)
        if (KANBAN_COLUMNS.some(c => c.id === overId)) {
            const newStatus = overId as ApplicationStatus;
            if (activeJob.status !== newStatus) {
                // Move to new column
                const updatedJobs = jobs.map(j =>
                    j.id === activeId
                        ? { ...j, status: newStatus, dateUpdated: new Date().toISOString() }
                        : j
                );
                onUpdateJobs(updatedJobs);
            }
        }
        // Dropped on another Card
        else {
            const overJob = jobs.find(j => j.id === overId);
            if (overJob) {
                const newStatus = overJob.status;

                let newJobs = [...jobs];

                // If changing columns, update status first
                if (activeJob.status !== newStatus) {
                    newJobs = newJobs.map(j =>
                        j.id === activeId
                            ? { ...j, status: newStatus, dateUpdated: new Date().toISOString() }
                            : j
                    );
                }

                // Reorder if we implement manual sorting (for now just status update is fine)
                // With verticalListSortingStrategy, we could use arrayMove here if we tracked order index
                // For this MVP, we just rely on date sorting, so dropping on a card just changes status to that card's column
                onUpdateJobs(newJobs);
            }
        }

        setActiveId(null);
    }

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Minhas Vagas</h2>
                </div>
                <button
                    onClick={() => onAddJob('saved')}
                    className="flex items-center gap-1 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nova Aplicação
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-5 gap-3 h-[calc(100vh-180px)] pb-2">
                    {KANBAN_COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            column={col}
                            jobs={columns[col.id]}
                            onDeleteJob={onDeleteJob}
                            onEdit={onEditJob}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeJob ? (
                        <div className="opacity-80 rotate-2">
                            <JobCard
                                job={activeJob}
                                onDelete={() => { }}
                                onEdit={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
