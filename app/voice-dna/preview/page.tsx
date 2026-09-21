/**
 * Voice DNA Preview Page
 * Reads extracted Voice DNA from sessionStorage and displays it
 */

'use client';

import { useEffect, useState } from 'react';
import { VoiceDNA } from '@/types/voice-dna';
import VoiceDNAPreview from '@/app/components/voice-dna/VoiceDNAPreview';
import { cn } from '@/lib/utils';
import { Loader2, ArrowLeft, Download, Share2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PreviewPageProps {
  searchParams: Promise<{ source?: string }>;
}

export default function PreviewPage({ searchParams }: PreviewPageProps) {
  const [voiceDna, setVoiceDna] = useState<VoiceDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVoiceDNA = async () => {
      try {
        // First check URL params for a session key
        const params = await searchParams;
        const sessionKey = params.source || 'voice-dna-latest';
        
        // Try sessionStorage first
        const stored = sessionStorage.getItem(sessionKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert date strings back to Date objects
          parsed.posts?.forEach((p: any) => {
            p.timestamp = new Date(p.timestamp);
          });
          if (parsed.dateRange) {
            parsed.dateRange.earliest = new Date(parsed.dateRange.earliest);
            parsed.dateRange.latest = new Date(parsed.dateRange.latest);
          }
          if (parsed.coldStart?.generatedAt) {
            parsed.coldStart.generatedAt = new Date(parsed.coldStart.generatedAt);
          }
          setVoiceDna(parsed);
          setLoading(false);
          return;
        }

        // Fallback: check localStorage for backward compatibility
        const localStored = localStorage.getItem('voice-dna-preview');
        if (localStored) {
          const parsed = JSON.parse(localStored);
          parsed.posts?.forEach((p: any) => { p.timestamp = new Date(p.timestamp); });
          if (parsed.dateRange) {
            parsed.dateRange.earliest = new Date(parsed.dateRange.earliest);
            parsed.dateRange.latest = new Date(parsed.dateRange.latest);
          }
          setVoiceDna(parsed);
          setLoading(false);
          return;
        }

        setError('No Voice DNA data found. Please upload your LinkedIn CSV first.');
        setLoading(false);
      } catch (err) {
        console.error('Failed to load Voice DNA:', err);
        setError('Failed to load Voice DNA data. Please try uploading again.');
        setLoading(false);
      }
    };

    loadVoiceDNA();
  }, [searchParams]);

  const handleDownload = () => {
    if (!voiceDna) return;
    const blob = new Blob([JSON.stringify(voiceDna, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-dna-${voiceDna.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!voiceDna) return;
    const shareData = {
      title: 'My Voice DNA Profile',
      text: `My Voice DNA: ${voiceDna.toneProfile.primary} tone with ${voiceDna.hooks[0]?.hookType} hooks. ${voiceDna.postCount} posts analyzed.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your Voice DNA...</p>
        </div>
      </div>
    );
  }

  if (error || !voiceDna) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Unable to Load Profile</h1>
          <p className="text-muted-foreground mb-6">{error || 'No Voice DNA data found'}</p>
          <Link href="/voice-dna/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Upload CSV Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/voice-dna/upload" className="p-2 hover:bg-accent rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Voice DNA Profile</h1>
              <p className="text-sm text-muted-foreground">{voiceDna.postCount} posts analyzed · {Math.round(voiceDna.confidence * 100)}% confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Download JSON">
              <Download className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
            <button onClick={handleShare} className="p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Share">
              <Share2 className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <VoiceDNAPreview 
          voiceDNA={voiceDna}
          suggestions={[]}
          onGenerateVideo={() => {}}
          onRefine={() => {}}
          onColdStart={() => {}}
        />
      </main>

      {/* Footer CTA */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Ready to turn this into content?</p>
          <Link 
            href="/voice-dna/suggestions" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Smart Suggestions →
          </Link>
        </div>
      </footer>
    </div>
  );
}