'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Job, loadJobs, loadSeenJobIds, markJobsAsSeen } from '@/lib/jobs';

export default function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>(() => loadJobs());
  const [unseenJobs, setUnseenJobs] = useState<Job[]>([]);

  useEffect(() => {
    const refresh = () => {
      const latest = loadJobs();
      setJobs(latest);
      const seenIds = loadSeenJobIds();
      const unseen = latest.filter((j) => !seenIds.includes(j.id));
      if (unseen.length) setUnseenJobs(unseen);
    };

    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('jobsUpdated', refresh);

    refresh();

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('jobsUpdated', refresh);
    };
  }, []);

  const openJobs = jobs.filter((job) => job.status === 'open');
  if (!openJobs.length) return null;

  const share = async (job: Job) => {
    const url = `${window.location.origin}/job/${job.id}`;
    try {
      await navigator.clipboard.writeText(url);
      // Simple notification
      alert('Link copied to clipboard!');
    } catch {
      alert('Link copied to clipboard!');
    }
  };

  const dismissJobNotification = () => {
    if (unseenJobs.length) {
      markJobsAsSeen(unseenJobs.map((j) => j.id));
      setUnseenJobs([]);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are seeking qualified journalists, engineers, and media professionals committed to advancing the standard of African journalism.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {openJobs.slice(0, 6).map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {job.type}
                </span>
                <button
                  onClick={() => share(job)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Share job"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{job.location}</span>
                <Link
                  href={`/job/${job.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/job"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}