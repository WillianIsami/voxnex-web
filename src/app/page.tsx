'use client'

import React, { useState, useEffect } from 'react';
import PdfViewer from './components/PdfViewer';
import styles from './page.module.css';

interface ApiResponse {
  pdf?: string;
  error?: string;
}

const PdfDisplayPage: React.FC = () => {
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/document/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: 'John Doe',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        if (data.pdf) {
          setPdfBase64(data.pdf);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Failed to retrieve PDF data.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, []);

  if (loading) {
    return <div>Loading PDF...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Generated PDF</h1>
      {pdfBase64 && <PdfViewer pdfData={pdfBase64} />}
      {!pdfBase64 && !error && <div>No PDF data received.</div>}
    </div>
  );
};

export default PdfDisplayPage;