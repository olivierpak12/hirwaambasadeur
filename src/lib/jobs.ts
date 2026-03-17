export type JobStatus = 'open' | 'closed';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';

export type Job = {
  id: string;
  title: string;
  department: string;
  type: JobType;
  location: string;
  status: JobStatus;
  postedAt: string;
  description?: string;
};

export type JobApplicationStatus = 'pending' | 'approved' | 'rejected';

export type JobApplication = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  coverLetter?: string;
  resumeName?: string;
  resumeDataUrl?: string;
  status: JobApplicationStatus;
  appliedAt: string;
};

const JOBS_KEY = 'hirwa:jobs';
const APPS_KEY = 'hirwa:jobApplications';
const SEEN_JOBS_KEY = 'hirwa:seenJobs';

export function loadJobs(): Job[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JOBS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Job[];
  } catch {
    return [];
  }
}

export function saveJobs(jobs: Job[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event('jobsUpdated'));
}

export function loadApplications(): JobApplication[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(APPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JobApplication[];
  } catch {
    return [];
  }
}

export function saveApplications(apps: JobApplication[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  window.dispatchEvent(new Event('jobsUpdated'));
}

export function addJob(job: Job) {
  const jobs = loadJobs();
  saveJobs([job, ...jobs]);
}

export function addApplication(app: JobApplication) {
  const apps = loadApplications();
  saveApplications([app, ...apps]);
}

export function updateApplicationStatus(applicationId: string, status: JobApplicationStatus) {
  const apps = loadApplications();
  saveApplications(apps.map(app => (app.id === applicationId ? { ...app, status } : app)));
}

export function loadSeenJobIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SEEN_JOBS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function saveSeenJobIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SEEN_JOBS_KEY, JSON.stringify(ids));
}

export function markJobsAsSeen(jobIds: string[]) {
  const existing = loadSeenJobIds();
  const merged = Array.from(new Set([...existing, ...jobIds]));
  saveSeenJobIds(merged);
}
