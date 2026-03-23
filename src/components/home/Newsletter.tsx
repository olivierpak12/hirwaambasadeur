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
      const trimmedEmail = email.trim();
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const result = await createSubscription({ email: trimmedEmail, source, code: verificationCode });

      if (result?.verified) {
        setStatus('done');
        return;
      }

      setStatus('needsVerification');

      try {
        const sendResult = await sendVerificationEmail({ email: trimmedEmail, code: verificationCode });
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
      const trimmedEmail = email.trim();
      const result = await verifySubscription({ email: trimmedEmail, code });
      if (result?.success) {
        // Send confirmation email after successful verification
        try {
          await sendConfirmationEmail({ email: trimmedEmail });
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
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {isDone ? (
        <p className="text-green-600 font-medium text-base">{successMessage}</p>
      ) : needsVerification ? (
        <div className="space-y-3">
          <p className="text-gray-700 text-sm">We sent a verification code to <strong>{email}</strong>. Enter it below to confirm.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              disabled={isSubmitting}
            />
            <button
              onClick={handleVerify}
              disabled={isSubmitting}
              className="bg-red-600 text-white border-none px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying…' : 'Verify'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Resend code
          </button>
          {debugCode && (
            <p className="text-xs text-gray-500">(Dev only) Code: {debugCode}</p>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-red-600 text-white border-none px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing…' : buttonText}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
