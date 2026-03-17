'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  'Politics',
  'Business',
  'Technology',
  'Health',
  'Sports',
  'Entertainment',
  'Africa',
  'World',
  'General',
];

export default function RequestPermissionPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: '',
    reason: '',
    credentials: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ fullName: '', email: '', category: '', reason: '', credentials: '' });

      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
          ← Back to home
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-8 shadow">
              <h1 className="text-2xl font-semibold text-slate-900">Apply for writing permission</h1>
              <p className="mt-2 text-sm text-slate-600">Join our team of professional journalists and contributors.</p>

              {submitted && (
                <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                  <strong>Application submitted!</strong> We will review your request and get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-slate-500">We will only use this email to contact you about your request.</p>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                    Preferred category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
                    Why do you want to write for us?
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us about your interest and what perspective you can bring to the site..."
                    className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="credentials" className="block text-sm font-medium text-slate-700">
                    Credentials / experience
                  </label>
                  <textarea
                    id="credentials"
                    name="credentials"
                    value={formData.credentials}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Share your background, previous publications, or relevant experience."
                    className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Submitting…' : 'Submit application'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ fullName: '', email: '', category: '', reason: '', credentials: '' })}
                    className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>

                <p className="text-xs text-slate-500">* Required fields. We respect your privacy and will only use this information for evaluating your application.</p>
              </form>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-900">What we look for</h3>
              <ul className="mt-4 space-y-4 text-sm text-slate-700">
                <li>
                  <strong className="font-semibold">Quality content:</strong> Well-researched, accurate, and engaging articles.
                </li>
                <li>
                  <strong className="font-semibold">Expertise:</strong> Strong understanding of the topic you want to cover.
                </li>
                <li>
                  <strong className="font-semibold">Consistency:</strong> Regular contributions and meeting deadlines.
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-900">Frequently asked</h3>
              <dl className="mt-4 space-y-3 text-sm text-slate-700">
                <div>
                  <dt className="font-semibold">How long does review take?</dt>
                  <dd className="mt-1">Typically 3–5 business days.</dd>
                </div>
                <div>
                  <dt className="font-semibold">Do you pay writers?</dt>
                  <dd className="mt-1">Reach out after approval to discuss rates.</dd>
                </div>
                <div>
                  <dt className="font-semibold">Can I write in multiple categories?</dt>
                  <dd className="mt-1">Yes, once approved, you can contribute across topics.</dd>
                </div>
              </dl>
            </div>

            <Link href="/contact" className="block">
              <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                📧 Contact us
              </button>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}











