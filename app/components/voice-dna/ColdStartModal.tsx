// Cold Start Modal Component
// Version: 1.0.0
// Last Updated: 2026-08-29

import React, { useState } from 'react';

interface ColdStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColdStart: () => void;
}

const ColdStartModal: React.FC<ColdStartModalProps> = ({ isOpen, onClose, onColdStart }) => {
  const [step, setStep] = useState<'intro' | 'paste' | 'processing' | 'complete'>('intro');

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read();
      const file = items[0]?.types.includes('text/csv') ? items[0] : null;
      if (file) {
        setStep('processing');
        setTimeout(() => {
          setStep('complete');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to paste file:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Cold Start</h2>
          <button onClick={onClose} style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#ef4444',
            border: 'none',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </div>

        {step === 'intro' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Start Fresh</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Paste your LinkedIn posts CSV to start building your Voice DNA from scratch.
            </p>
            <div style={{
              padding: '24px',
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Paste CSV file</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Ctrl+V to paste from clipboard</p>
            </div>
            <button onClick={handlePaste} style={{
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: '#3b82f6',
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}>
              Paste CSV
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Processing...</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Analyzing your posts to build Voice DNA</p>
          </div>
        )}

        {step === 'complete' && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Voice DNA Created!</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Your Voice DNA has been successfully created. You can now generate your first video.
            </p>
            <button onClick={onColdStart} style={{
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: '#3b82f6',
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}>
              Generate First Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdStartModal;
