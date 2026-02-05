export interface JobSite {
    id: string;
    name: string;
    domain: string;
    category: 'ats-global' | 'brasil' | 'startups' | 'linkedin' | 'context';
    region?: 'Brazil' | 'Global' | 'Remote';
    description?: string;
}

export const JOB_SITES: JobSite[] = [
    // ATS Globais
    { id: 'greenhouse', name: 'Greenhouse', domain: 'boards.greenhouse.io', category: 'ats-global', region: 'Global' },
    { id: 'lever', name: 'Lever', domain: 'jobs.lever.co', category: 'ats-global', region: 'Global' },
    { id: 'workable', name: 'Workable', domain: 'apply.workable.com', category: 'ats-global', region: 'Global' },
    { id: 'ashby', name: 'Ashby', domain: 'jobs.ashbyhq.com', category: 'ats-global', region: 'Global' },
    { id: 'smartrecruiters', name: 'SmartRecruiters', domain: 'jobs.smartrecruiters.com', category: 'ats-global', region: 'Global' },
    { id: 'breezyhr', name: 'Breezy HR', domain: 'breezyhr.com', category: 'ats-global', region: 'Global' },
    { id: 'teamtailor', name: 'TeamTailor', domain: 'jobs.teamtailor.com', category: 'ats-global', region: 'Global' },
    { id: 'bamboohr', name: 'BambooHR', domain: 'bamboohr.com/careers', category: 'ats-global', region: 'Global' },
    { id: 'recruitee', name: 'Recruitee', domain: 'careers.recruitee.com', category: 'ats-global', region: 'Global' },

    // Brasil
    { id: 'gupy', name: 'Gupy', domain: 'gupy.io', category: 'brasil', region: 'Brazil' },
    { id: '99jobs', name: '99jobs', domain: '99jobs.com', category: 'brasil', region: 'Brazil' },
    { id: 'vagas', name: 'Vagas.com', domain: 'vagas.com.br', category: 'brasil', region: 'Brazil' },
    { id: 'remotar', name: 'Remotar', domain: 'remotar.com.br', category: 'brasil', region: 'Brazil' },
    { id: 'catho', name: 'Catho', domain: 'catho.com.br', category: 'brasil', region: 'Brazil' },
    { id: 'infojobs', name: 'InfoJobs', domain: 'infojobs.com.br', category: 'brasil', region: 'Brazil' },
    { id: 'trampos', name: 'Trampos.co', domain: 'trampos.co', category: 'brasil', region: 'Brazil' },
    { id: 'revelo', name: 'Revelo', domain: 'revelo.com.br', category: 'brasil', region: 'Brazil' },

    // Startups & Remoto
    { id: 'wellfound', name: 'Wellfound (AngelList)', domain: 'wellfound.com', category: 'startups', region: 'Remote' },
    { id: 'ycombinator', name: 'Y Combinator Jobs', domain: 'ycombinator.com/jobs', category: 'startups', region: 'Remote' },
    { id: 'himalayas', name: 'Himalayas', domain: 'himalayas.app', category: 'startups', region: 'Remote' },
    { id: 'weworkremotely', name: 'WeWorkRemotely', domain: 'weworkremotely.com', category: 'startups', region: 'Remote' },
    { id: 'remoteok', name: 'RemoteOK', domain: 'remoteok.com', category: 'startups', region: 'Remote' },

    // Big Tech & Context
    { id: 'linkedin', name: 'LinkedIn Jobs', domain: 'linkedin.com/jobs', category: 'linkedin', region: 'Global' },
    { id: 'stackoverflow', name: 'Stack Overflow', domain: 'stackoverflow.com/jobs', category: 'context', region: 'Global' },
    { id: 'hired', name: 'Hired', domain: 'hired.com', category: 'context', region: 'Global' },
    { id: 'levels', name: 'Levels.fyi', domain: 'levels.fyi/jobs', category: 'context', region: 'Global' },
    { id: 'glassdoor', name: 'Glassdoor', domain: 'glassdoor.com/Job', category: 'context', region: 'Global' },
];

export type DateFilter = '' | 'd' | 'w' | 'm' | 'y';

export interface DateFilterOption {
    value: DateFilter;
    label: string;
}

export const DATE_FILTER_OPTIONS: DateFilterOption[] = [
    { value: '', label: 'Qualquer data' },
    { value: 'd', label: 'Últimas 24 horas' },
    { value: 'w', label: 'Última semana' },
    { value: 'm', label: 'Último mês' },
    { value: 'y', label: 'Último ano' },
];

export interface SearchPreset {
    id: string;
    name: string;
    cargo: string;
    sites: string[];
    dateFilter: DateFilter;
    location: string;
    createdAt: string;
}

export interface SearchHistory {
    id: string;
    cargo: string;
    sites: string[];
    dateFilter: DateFilter;
    location: string;
    timestamp: string;
    query: string;
}

export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface JobApplication {
    id: string;
    role: string;
    company: string;
    link?: string;
    status: ApplicationStatus;
    salary?: string;
    location?: string;
    notes?: string;
    dateAdded: string;
    dateUpdated: string;
}

export interface KanbanColumn {
    id: ApplicationStatus;
    title: string;
    color: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
    { id: 'saved', title: 'Interesse', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { id: 'applied', title: 'Aplicado', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    { id: 'interview', title: 'Entrevista', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { id: 'offer', title: 'Oferta', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    { id: 'rejected', title: 'Rejeitado', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
];
