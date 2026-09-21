// Voice DNA Preview Component
// Version: 1.0.0
// Last Updated: 2026-08-29

import React from 'react';
import { VoiceDNA, SmartSuggestion, RhythmSlot } from '@/types/voice-dna';
import HookBadge from './HookBadge';
import PillarCard from './PillarCard';
import ToneRadar from './ToneRadar';
import RhythmChart from './RhythmChart';
import SuggestionCard from './SuggestionCard';

interface VoiceDnaPreviewProps {
  voiceDNA: VoiceDNA;
  suggestions: SmartSuggestion[];
  onGenerateVideo: () => void;
  onRefine: () => void;
  onColdStart: () => void;
}

const ConfidenceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
  let label: string;
  let color: string;

  if (confidence >= 0.8) {
    label = 'High';
    color = '#10b981';
  } else if (confidence >= 0.5) {
    label = 'Medium';
    color = '#f59e0b';
  } else {
    label = 'Learning';
    color = '#ef4444';
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: color
    }}>
      {label} Confidence
    </span>
  );
};

const ToneProfileSection: React.FC<{ toneProfile: VoiceDNA['toneProfile'] }> = ({ toneProfile }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Tone Profile</h3>
      <ToneRadar toneProfile={toneProfile} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: '#fff', backgroundColor: '#3b82f6' }}>
          {toneProfile.primary}
        </span>
        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: '#fff', backgroundColor: '#8b5cf6' }}>
          {toneProfile.secondary}
        </span>
      </div>
    </div>
  );
};

const HooksSection: React.FC<{ hooks: VoiceDNA['hooks'] }> = ({ hooks }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Top Hooks</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {hooks.slice(0, 5).map((hook, index) => (
          <div key={hook.hookType} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '100px', fontSize: '14px', fontWeight: '500' }}>{hook.hookType}</span>
            <div style={{ flex: 1, height: '8px', borderRadius: '4px', backgroundColor: '#e5e7eb' }}>
              <div style={{
                width: `${hook.percentage}%`,
                height: '100%',
                borderRadius: '4px',
                backgroundColor: index === 0 ? '#3b82f6' : '#9ca3af'
              }} />
            </div>
            <span style={{ width: '40px', fontSize: '14px', fontWeight: '600' }}>{hook.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PillarsSection: React.FC<{ pillars: VoiceDNA['pillars'] }> = ({ pillars }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Content Pillars</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {pillars.map((pillar) => (
          <PillarCard key={pillar.label} pillar={pillar} />
        ))}
      </div>
    </div>
  );
};

const FormatSection: React.FC<{ formatPreference: VoiceDNA['formatPreference'] }> = ({ formatPreference }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Format Preference</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#e5e7eb' }}>
          {/* Donut chart placeholder */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '8px solid #e5e7eb',
            borderRightColor: formatPreference.isPrimary ? '#3b82f6' : '#9ca3af',
            borderLeftColor: formatPreference.isPrimary ? '#3b82f6' : '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{formatPreference.format}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>Your best: {formatPreference.format}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Engagement rate: {formatPreference.engagementRate}%</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Multiplier: {formatPreference.multiplier}x</div>
        </div>
      </div>
    </div>
  );
};

const RhythmSection: React.FC<{ rhythm?: VoiceDNA['postingRhythm'] }> = ({ rhythm }) => {
  if (!rhythm) {
    return (
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Posting Rhythm</h3>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Upload more posts to analyze your posting rhythm</p>
      </div>
    );
  }
  // Convert postingRhythm to RhythmSlot[] for the chart
  const rhythmSlots: RhythmSlot[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const slot = rhythm.bestSlots.find(s => s.day === day && s.hour === hour);
      if (slot) {
        rhythmSlots.push({ dayOfWeek: day, hour, engagement: slot.score });
      }
    }
  }
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Posting Rhythm</h3>
      <RhythmChart rhythm={rhythmSlots} />
    </div>
  );
};

const VocabularySection: React.FC<{ vocabulary: VoiceDNA['vocabulary'] }> = ({ vocabulary }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Vocabulary</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {vocabulary.signatureTerms.map((term, index) => (
          <span key={index} style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: '#f3f4f6',
            color: '#374151'
          }}>
            {term.term}
          </span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
        <div style={{ fontSize: '14px' }}>Avg Sentence: {vocabulary.avgSentenceLength} words</div>
        <div style={{ fontSize: '14px' }}>Flesch-Kincaid: {vocabulary.fleschKincaid}</div>
        <div style={{ fontSize: '14px' }}>Top Emojis: {vocabulary.topEmojis.join(', ')}</div>
        <div style={{ fontSize: '14px' }}>Formatting: {vocabulary.formattingMarkers.join(', ')}</div>
      </div>
    </div>
  );
};

const SuggestionsSection: React.FC<{ suggestions: SmartSuggestion[] }> = ({ suggestions }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Smart Suggestions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
};

const VoiceDnaPreview: React.FC<VoiceDnaPreviewProps> = ({
  voiceDNA,
  suggestions,
  onGenerateVideo,
  onRefine,
  onColdStart
}) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Your Voice DNA</h1>
        <ConfidenceBadge confidence={voiceDNA.confidence} />
      </div>

      <ToneProfileSection toneProfile={voiceDNA.toneProfile} />
      <HooksSection hooks={voiceDNA.hooks} />
      <PillarsSection pillars={voiceDNA.pillars} />
      <FormatSection formatPreference={voiceDNA.formatPreference} />
      <RhythmSection rhythm={voiceDNA.postingRhythm} />
      <VocabularySection vocabulary={voiceDNA.vocabulary} />
      <SuggestionsSection suggestions={suggestions} />

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={onGenerateVideo}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#3b82f6',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Generate First Video
        </button>
        <button
          onClick={onRefine}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#6366f1',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Refine Voice DNA
        </button>
        {voiceDNA.confidence < 0.4 && (
          <button
            onClick={onColdStart}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: '#10b981',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cold Start
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceDnaPreview;
