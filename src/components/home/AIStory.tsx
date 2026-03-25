'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Language = 'english' | 'kinyarwanda' | 'french';

export default function AIStory() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const story = useQuery(api.aiStories.getLatestStory);
  const seedStory = useMutation(api.aiStories.seedInitialStory);

  // Auto-seed initial story if none exists
  useEffect(() => {
    if (story === null) { // null means query completed but no data
      seedStory().catch(console.error);
    }
  }, [story, seedStory]);

  const getStoryText = () => {
    if (!story) return '';
    switch (selectedLanguage) {
      case 'english':
        return story.englishText || '';
      case 'kinyarwanda':
        return story.kinyarwandaText || story.englishText || ''; // Fallback to English if translation missing
      case 'french':
        return story.frenchText || story.englishText || ''; // Fallback to English if translation missing
      default:
        return story.englishText || '';
    }
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
        backgroundColor: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px',
        }}>
          🤖 AI Funny Story
        </div>
        <div style={{
          fontSize: '12px',
          color: '#999',
          fontStyle: 'italic',
        }}>
          Loading today's story...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        🤖 AI Funny Story
        <span style={{
          fontSize: '10px',
          color: '#666',
          fontWeight: '400',
        }}>
          (Updated daily)
        </span>
      </div>

      {/* Language tabs */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid #e5e5e5',
          paddingBottom: '8px',
        }}>
          {(['english', 'kinyarwanda', 'french'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: '500',
                backgroundColor: selectedLanguage === lang ? '#bb1919' : 'transparent',
                color: selectedLanguage === lang ? 'white' : '#666',
                border: selectedLanguage === lang ? 'none' : '1px solid #e5e5e5',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Story content */}
      <div style={{
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#333',
      }}>
        {getStoryText()}
      </div>

      <div style={{
        marginTop: '8px',
        fontSize: '10px',
        color: '#999',
        textAlign: 'right',
      }}>
        Generated {new Date(story.generatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}