import React, { useEffect, useState } from 'react';
import { LocalizationMap, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as pdfjs from 'pdfjs-dist';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import pt_PT from '@/app/data/pt_BR.json';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfData?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfData }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!pdfData) return;

    // Convert base64 to Blob URL
    const base64ToBlob = (base64: string) => {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'application/pdf' });
    };

    const blob = base64ToBlob(pdfData);
    const url = URL.createObjectURL(blob);
    setFileUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [pdfData]);

  if (!pdfData) return <div>No PDF to display</div>;

  return (
    <Worker workerUrl={pdfjs.GlobalWorkerOptions.workerSrc}>
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        height: '600px',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa'
      }}>
        {fileUrl ? (
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            localization={pt_PT as unknown as LocalizationMap}
            theme="light"
            renderLoader={() => (
              <div style={{ 
                padding: '2rem',
                textAlign: 'center',
                color: '#6c757d'
              }}>
                Loading document...
              </div>
            )}
          />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Preparing viewer...
          </div>
        )}
      </div>
    </Worker>
  );
};

export default PdfViewer;