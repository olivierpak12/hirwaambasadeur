'use client';

import { useState } from 'react';

const policies = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          At Hirwa Ambassadeur, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h3>
        <p className="mb-4">
          We may collect personal information such as your name, email address, and contact details when you subscribe to our newsletter, submit articles, or contact us through our forms. We also collect non-personal information through cookies and analytics tools to improve our website.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h3>
        <p className="mb-4">
          Your information is used to provide you with news updates, respond to your inquiries, process article submissions, and improve our services. We do not sell or share your personal information with third parties without your consent, except as required by law.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Data Security</h3>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Your Rights</h3>
        <p className="mb-4">
          You have the right to access, update, or delete your personal information. If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Changes to This Policy</h3>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Last updated: March 2026
        </p>
      </div>
    ),
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          Welcome to Hirwa Ambassadeur. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions of use. If you do not agree to these terms, please do not use this website.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Use of Content</h3>
        <p className="mb-4">
          All content on this website, including text, graphics, logos, and images, is the property of Hirwa Ambassadeur or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without prior written consent.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">User Conduct</h3>
        <p className="mb-4">
          You agree to use this website only for lawful purposes and in a way that does not infringe on the rights of others or restrict their use and enjoyment of the website. Prohibited activities include harassment, defamation, and posting illegal content.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Disclaimer</h3>
        <p className="mb-4">
          The information on this website is provided on an "as is" basis. While we strive for accuracy, we make no warranties about the completeness, reliability, or accuracy of this information. Use of this website is at your own risk.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Limitation of Liability</h3>
        <p className="mb-4">
          Hirwa Ambassadeur shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or inability to use it.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Changes to Terms</h3>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this website. Your continued use constitutes acceptance of the modified terms.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Last updated: March 2026
        </p>
      </div>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookie Policy',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          This Cookie Policy explains how Hirwa Ambassadeur uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies in accordance with this policy.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">What Are Cookies</h3>
        <p className="mb-4">
          Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and understanding how you use our site.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Types of Cookies We Use</h3>
        <ul className="mb-4 list-disc pl-6">
          <li><strong>Essential Cookies:</strong> Required for the website to function properly, such as maintaining your login session.</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences and settings to enhance your experience.</li>
          <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and track campaign performance.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">Managing Cookies</h3>
        <p className="mb-4">
          You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, disabling cookies may affect the functionality of our website.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Third-Party Cookies</h3>
        <p className="mb-4">
          Some cookies may be set by third-party services that appear on our pages, such as social media plugins or advertising networks. We do not control these cookies, and they are subject to the respective third party's privacy policy.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Updates to This Policy</h3>
        <p className="mb-4">
          We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please check this page periodically for updates.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Last updated: March 2026
        </p>
      </div>
    ),
  },
  {
    id: 'editorial',
    title: 'Editorial Policy',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          At Hirwa Ambassadeur, our editorial policy is guided by principles of accuracy, fairness, independence, and accountability. We are committed to providing high-quality journalism that informs, engages, and serves our readers.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Accuracy and Fact-Checking</h3>
        <p className="mb-4">
          We strive for accuracy in all our reporting. Our journalists verify facts, cross-check sources, and correct errors promptly. We clearly distinguish between news reporting, analysis, and opinion.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Independence and Impartiality</h3>
        <p className="mb-4">
          Our editorial decisions are made independently, free from political, commercial, or other external influences. We maintain impartiality in our coverage, presenting diverse viewpoints fairly.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Sources and Attribution</h3>
        <p className="mb-4">
          We attribute information to its source whenever possible. Anonymous sources are used only when the information is in the public interest and cannot be obtained through other means. We protect confidential sources.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Corrections and Corrections Policy</h3>
        <p className="mb-4">
          We correct factual errors as soon as they are identified. Corrections are clearly marked and explained. Our corrections policy ensures transparency and accountability in our journalism.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Diversity and Inclusion</h3>
        <p className="mb-4">
          We are committed to diversity in our newsroom and coverage. Our reporting reflects the diverse communities we serve, and we strive to eliminate bias in our content.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Ethical Standards</h3>
        <p className="mb-4">
          Our journalists adhere to the highest ethical standards. We avoid conflicts of interest, disclose relevant affiliations, and maintain professional boundaries with sources and subjects.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Last updated: March 2026
        </p>
      </div>
    ),
  },
];

export default function PoliciesPage() {
  const [activePolicy, setActivePolicy] = useState('privacy');

  const activeContent = policies.find(p => p.id === activePolicy)?.content;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Our Policies</h1>
            <p className="mt-2 text-gray-600 text-center">
              Important information about how we operate and protect your rights
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {policies.map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => setActivePolicy(policy.id)}
                  className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                    activePolicy === policy.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {policy.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {activeContent}
          </div>
        </div>
      </div>
    </div>
  );
}