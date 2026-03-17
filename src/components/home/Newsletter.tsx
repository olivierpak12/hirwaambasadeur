'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) setSubmitted(true);
  };

  return (
    <div className="bg-[#c9a84c] rounded-lg p-6 mt-5 text-center">
      <h3 className="font-serif text-[#0f2318] text-xl font-normal mb-1">
        Stay Informed
      </h3>
      <p className="text-[#5a4010] text-sm mb-4">
        Daily briefings delivered to your inbox
      </p>

      {submitted ? (
        <p className="text-[#0f2318] font-medium text-base">
          Thank you for subscribing!
        </p>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-3 py-2 border-none rounded text-sm bg-[#f7f0dc] text-[#0f2318] outline-none"
          />
          <button
            onClick={handleSubmit}
            className="bg-[#0f2318] text-[#c9a84c] border-none px-4 py-2 rounded text-sm uppercase tracking-wide cursor-pointer font-medium hover:bg-[#1a3d28] transition-colors"
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
}