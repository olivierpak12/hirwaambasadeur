'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Language = 'english' | 'kinyarwanda' | 'french';

export default function AIStory() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const story = useQuery(api.aiStories.getLatestStory);
  const seedStory = useMutation(api.aiStories.seedInitialStory);

  useEffect(() => {
    if (story === null) {
      seedStory().catch(console.error);
    }
  }, [story, seedStory]);

  const getStoryText = () => {
    if (!story) return '';
    const text = (() => {
      switch (selectedLanguage) {
        case 'english':
          return story.englishText;
        case 'kinyarwanda':
          return story.kinyarwandaText;
        case 'french':
          return story.frenchText;
        default:
          return story.englishText;
      }
    })();
    return text || '';
  };

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'english':
        return 'English';
      case 'kinyarwanda':
        return 'Kinyarwanda';
      case 'french':
        return 'Français';
    }
  };

  if (!story) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e8e2d4',
        borderRadius: '6px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#7a6a50',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          ✨ Daily Story
        </div>
        <div style={{
          fontSize: '12px',
          color: '#a89a7a',
          marginTop: '8px',
          fontStyle: 'italic',
        }}>
          Loading today's exclusive story...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e8e2d4',
      borderRadius: '6px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      marginBottom: '20px',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f5f0 0%, #faf8f3 100%)',
        borderBottom: '1px solid #e8e2d4',
        padding: '16px 20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>✨</span>
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1a1a1a',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Daily Story
              </div>
              <div style={{
                fontSize: '10px',
                color: '#9a8a6a',
                marginTop: '2px',
              }}>
                Updated daily • AI-generated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid #e8e2d4',
        padding: '0 20px',
        background: '#faf8f3',
      }}>
        {(['english', 'kinyarwanda', 'french'] as Language[]).map((lang, i) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            style={{
              padding: '12px 16px',
              fontSize: '12px',
              fontWeight: selectedLanguage === lang ? '600' : '500',
              backgroundColor: selectedLanguage === lang ? '#fff' : 'transparent',
              color: selectedLanguage === lang ? '#bb1919' : '#9a8a6a',
              border: 'none',
              borderBottom: selectedLanguage === lang ? '2px solid #bb1919' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em',
              borderRight: i < 2 ? '1px solid #e8e2d4' : 'none',
            }}
          >
            {getLanguageLabel(lang)}
          </button>
        ))}
      </div>

      {/* Story content */}
      <div style={{
        padding: '20px',
      }}>
        <div style={{
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#2a2218',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '400',
          letterSpacing: '0.3px',
          marginBottom: '16px',
          textAlign: 'justify',
        }}>
          {getStoryText()}
        </div>

        <div style={{
          fontSize: '11px',
          color: '#a89a7a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid #e8e2d4',
        }}>
          <span>Generated {new Date(story.generatedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            backgroundColor: '#f0ede4',
            padding: '4px 8px',
            borderRadius: '3px',
            color: '#8a6a2a',
          }}>
            ✓ Verified
          </span>
        </div>
      </div>
    </div>
  );
}