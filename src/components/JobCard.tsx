import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { JobApplication } from '../types/job';
import { Calendar, DollarSign, MapPin, ExternalLink, Trash2, Edit2 } from 'lucide-react';

interface JobCardProps {
    job: JobApplication;
    onDelete: (id: string) => void;
    onEdit: (job: JobApplication) => void;
}

export function JobCard({ job, onDelete, onEdit }: JobCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: job.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-card/50 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-sm hover:shadow-md hover-glow transition-all group cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-sm text-foreground truncate max-w-[150px]" title={job.role}>
                        {job.role}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">{job.company}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(job); }}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary"
                    >
                        <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(job.dateUpdated).toLocaleDateString()}</span>
                </div>

                {(job.location || job.salary) && (
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        {job.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[80px]">{job.location}</span>
                            </div>
                        )}
                        {job.salary && (
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                <span>{job.salary}</span>
                            </div>
                        )}
                    </div>
                )}

                {job.link && (
                    <a
                        href={job.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking link
                        className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-2 pt-2 border-t border-border/30 w-full"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Link da Vaga
                    </a>
                )}
            </div>
        </div>
    );
}
