'use client';

import { useState } from 'react';

const categories = [
  { value: 'politics', label: 'Politics' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health' },
  { value: 'sports', label: 'Sports' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'africa', label: 'Africa' },
  { value: 'world', label: 'World' },
];

export default function SubmitNewsPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'politics',
    authorName: '',
    authorEmail: '',
    content: '',
    image: null as File | null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In production, this would call a Convex function to create a submission
    // await createSubmission(formData);

    setTimeout(() => {
      setSubmitted(true);
      setFormData({
        title: '',
        category: 'politics',
        authorName: '',
        authorEmail: '',
        content: '',
        image: null,
      });
      setLoading(false);

      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Submit a News Article</h1>
          <p className="mt-4 text-lg text-slate-700">
            Share your story with our readers. Submit your article for review by our editorial team.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 rounded-lg bg-emerald-50 px-6 py-4 text-sm text-emerald-900">
            ✅ Thank you for your submission! Our editorial team will review it shortly.
          </div>
        )}

        <div className="rounded-lg bg-white p-8 shadow">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                  Article title*
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Compelling headline for your article"
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-slate-500">{formData.title.length}/200 characters</p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="authorName" className="block text-sm font-semibold text-slate-700">
                  Journalist name*
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="authorEmail" className="block text-sm font-semibold text-slate-700">
                  Author email*
                </label>
                <input
                  id="authorEmail"
                  name="authorEmail"
                  type="email"
                  value={formData.authorEmail}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-semibold text-slate-700">
                  Featured image (optional)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {formData.image && (
                  <p className="mt-2 text-xs text-slate-600">✓ {formData.image.name} selected</p>
                )}
                <p className="mt-1 text-xs text-slate-500">Recommended: JPEG or PNG, max 5MB.</p>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-slate-700">
                  Article content*
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Write your article here. Minimum 300 characters."
                />
                <p className="mt-1 text-xs text-slate-500">{formData.content.length} characters</p>
              </div>

              <div className="flex items-start gap-3">
                <input id="terms" type="checkbox" required className="mt-1 rounded" />
                <label htmlFor="terms" className="text-sm text-slate-700">
                  I confirm this article is original and complies with editorial standards.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Submit article for review'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-10 space-y-4 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Submission guidelines</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Articles should be at least 300 characters long.</li>
            <li>Content should be factual, well-researched, and original.</li>
            <li>Provide proper citations for sources.</li>
            <li>Use a professional tone and clear writing.</li>
            <li>Featured images should be high quality and properly licensed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}











