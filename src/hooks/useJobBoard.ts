import { useLocalStorage } from './useLocalStorage';
import type { JobApplication, ApplicationStatus } from '../types/job';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function useJobBoard() {
    const [applications, setApplications] = useLocalStorage<JobApplication[]>('job_applications', []);

    const addJob = (status: ApplicationStatus) => {
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

    const updateJobs = (updatedJobs: JobApplication[]) => {
        setApplications(updatedJobs);
    };

    const deleteJob = (id: string) => {
        if (window.confirm("Remover esta vaga do quadro?")) {
            setApplications(prev => prev.filter(job => job.id !== id));
            toast.success("Vaga removida");
        }
    };

    const editJob = (job: JobApplication) => {
        const notes = window.prompt("Notas para a vaga:", job.notes || "");
        if (notes !== null) {
            const updated = applications.map(j =>
                j.id === job.id ? { ...j, notes, dateUpdated: new Date().toISOString() } : j
            );
            setApplications(updated);
            toast.success("Notas atualizadas");
        }
    };

    return {
        applications,
        addJob,
        updateJobs,
        deleteJob,
        editJob
    };
}
