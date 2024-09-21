// components/ProgressBar.tsx
import React from 'react';

export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div>
      <div style={{ width: '100%', backgroundColor: '#ddd' }}>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: '#4caf50',
            textAlign: 'center',
            padding: '10px',
            color: 'white',
          }}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
};
