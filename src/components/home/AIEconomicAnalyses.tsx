'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';

export default function AIEconomicAnalyses() {
  const economicApi = (api as any).aiEconomicAnalyses;
  const analyses = useQuery(economicApi?.getLatestAnalyses) ?? [];

  if (!analyses.length) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingBottom: '8px',
        borderBottom: '2px solid #bb1919',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#1a1a1a',
        }}>AI Economic Analysis</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {analyses.slice(0, 3).map((analysis: any) => (
          <div key={analysis._id} style={{
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}>
            <Link
              href={`/ai-economic-analysis#${analysis._id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: '#1a1a1a',
                lineHeight: '1.3',
              }}>
                {analysis.title}
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: '0',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {analysis.summary}
              </p>
              {analysis.metadata?.region && (
                <span style={{
                  fontSize: '11px',
                  color: '#bb1919',
                  fontWeight: '500',
                  marginTop: '4px',
                  display: 'inline-block',
                }}>
                  {analysis.metadata.region}
                </span>
              )}
            </Link>
          </div>
        ))}

        <Link
          href="/ai-economic-analysis"
          style={{
            textDecoration: 'none',
            color: '#bb1919',
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '8px',
            border: '1px solid #bb1919',
            borderRadius: '4px',
            display: 'block',
            marginTop: '8px',
          }}
        >
          View All AI Economic Analyses →
        </Link>
      </div>
    </div>
  );
}