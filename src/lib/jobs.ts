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
  requirements?: string[];
  benefits?: string[];
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

// Local storage based jobs are no longer used.
// The application now fetches jobs through Convex queries.
