'use client';

import { useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  source?: string;
  className?: string;
}

export default function Newsletter({
  title = 'Stay informed. Stay ahead.',
  description = "Get Kigali's most important stories — politics, business, culture — delivered to your inbox every morning.",
  placeholder = 'your@email.com',
  buttonText = 'Subscribe free',
  successMessage = "✓ You're subscribed! Check your inbox.",
  source,
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'needsVerification' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  const createSubscription = useMutation(api.subscriptions.createSubscription);
  const verifySubscription = useMutation(api.subscriptions.verifySubscription);
  const sendVerificationEmail = useAction(api.sendVerificationEmail.sendVerificationEmail);
  const sendConfirmationEmail = useAction(api.sendSubscriptionConfirmation.sendSubscriptionConfirmation);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setError(null);
    setDebugCode(null);

    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const result = await createSubscription({ email, source, code: verificationCode });

      if (result?.verified) {
        setStatus('done');
        return;
      }

      setStatus('needsVerification');

      try {
        const sendResult = await sendVerificationEmail({ email, code: verificationCode });
        if (sendResult?.debugCode) {
          setDebugCode(sendResult.debugCode);
        }
      } catch (sendError) {
        setError('Unable to send verification email. Please try again later.');
        setStatus('error');
        return;
      }

      if (result?.debugCode) {
        setDebugCode(result.debugCode);
      }
    } catch (err) {
      setError((err as Error)?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const result = await verifySubscription({ email, code });
      if (result?.success) {
        // Send confirmation email after successful verification
        try {
          await sendConfirmationEmail({ email });
        } catch (confirmError) {
          console.error('Failed to send confirmation email:', confirmError);
          // Don't show error to user - subscription is already successful
        }
        setStatus('done');
      } else {
        setError(result?.message || 'Verification failed.');
        setStatus('error');
      }
    } catch (err) {
      setError((err as Error)?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const isDone = status === 'done';
  const isSubmitting = status === 'submitting';
  const needsVerification = status === 'needsVerification';

  return (
    <div className={className}>
      <h3 className="font-serif text-[#0f2318] text-xl font-normal mb-1">{title}</h3>
      <p className="text-[#5a4010] text-sm mb-4">{description}</p>

      {isDone ? (
        <p className="text-[#0f2318] font-medium text-base">{successMessage}</p>
      ) : needsVerification ? (
        <div className="space-y-2">
          <p className="text-[#0f2318] text-sm">We sent a verification code to <strong>{email}</strong>. Enter it below to confirm.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 border-none rounded text-sm bg-[#f7f0dc] text-[#0f2318] outline-none"
              disabled={isSubmitting}
            />
            <button
              onClick={handleVerify}
              disabled={isSubmitting}
              className="bg-[#0f2318] text-[#c9a84c] border-none px-4 py-2 rounded text-sm uppercase tracking-wide cursor-pointer font-medium hover:bg-[#1a3d28] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying…' : 'Verify'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-[11px] text-[#5a8a6a] hover:text-[#1a3d28]"
          >
            Resend code
          </button>
          {debugCode && (
            <p className="text-xs text-[#4a4a4a]">(Dev only) Code: {debugCode}</p>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border-none rounded text-sm bg-[#f7f0dc] text-[#0f2318] outline-none"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#0f2318] text-[#c9a84c] border-none px-4 py-2 rounded text-sm uppercase tracking-wide cursor-pointer font-medium hover:bg-[#1a3d28] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing…' : buttonText}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
