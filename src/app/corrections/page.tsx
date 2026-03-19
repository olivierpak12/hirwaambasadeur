export default function Corrections() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Corrections</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          At Hirwa Ambassadeur, we are committed to accuracy and transparency in our journalism. When we make errors, we correct them promptly and clearly. Below is a list of recent corrections to our published content.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Corrections</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-semibold">Correction - March 15, 2026</h3>
            <p className="text-sm text-gray-600 mb-2">Article: "Economic Impact of Recent Policy Changes"</p>
            <p className="mb-2">
              <strong>Original:</strong> The policy was implemented in January 2025.
            </p>
            <p>
              <strong>Corrected:</strong> The policy was implemented in February 2025. We apologize for this error.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-semibold">Correction - March 10, 2026</h3>
            <p className="text-sm text-gray-600 mb-2">Article: "Sports Championship Results"</p>
            <p className="mb-2">
              <strong>Original:</strong> Team A won the championship with a score of 3-2.
            </p>
            <p>
              <strong>Corrected:</strong> Team B won the championship with a score of 3-1. We regret this inaccuracy.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-semibold">Correction - March 5, 2026</h3>
            <p className="text-sm text-gray-600 mb-2">Article: "Technology Breakthrough Announcement"</p>
            <p className="mb-2">
              <strong>Original:</strong> The breakthrough was announced by Company X.
            </p>
            <p>
              <strong>Corrected:</strong> The breakthrough was announced by Company Y. We apologize for the misattribution.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Corrections Policy</h2>
        <p className="mb-4">
          When we identify an error in our reporting, we:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>Correct the error as quickly as possible</li>
          <li>Clearly mark the correction in the article</li>
          <li>Provide an explanation of what was wrong and what the correction is</li>
          <li>Maintain a public record of corrections on this page</li>
          <li>Notify readers when significant corrections are made</li>
        </ul>

        <p className="mb-4">
          If you believe we have made an error in one of our articles, please contact us with details, and we will investigate promptly.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          This page is updated regularly with new corrections.
        </p>
      </div>
    </div>
  );
}