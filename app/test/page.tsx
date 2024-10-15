// app/video/[videoId]/components/SummaryTab.tsx
'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from "@/components/Loader";

const SummaryTab = ({ videoId }: { videoId: string }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('Reading transcript...');

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const response = await axios.post('/api/summary', { videoId });
        setSummary(response.data.summary);
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [videoId]);

  useEffect(() => {
    const messages = [
      'Reading transcript...',
      'Generating summary...',
      'Crafting highlights...',
    ];
    let index = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[index]);
      index = (index + 1) % messages.length;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader message={loadingMessage} />;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="prose max-w-none text-black">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SummaryTab;