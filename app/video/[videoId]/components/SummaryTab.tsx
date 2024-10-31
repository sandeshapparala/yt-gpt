'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from "@/components/Loader";

const SummaryTab = ({ videoId, summary, setSummary, loading, setLoading, error, setError }:
    { videoId: string, summary: string, setSummary: (summary: string) => void, loading: boolean, setLoading: (loading: boolean) => void, error: string, setError: (error: string) => void }) => {

  const [loadingMessage, setLoadingMessage] = useState<string>('');

  useEffect(() => {
    async function fetchSummary() {
      if (summary) return; // If summary is already fetched, do not fetch again
      try {
        setLoading(true);
        const response = await axios.post('/api/summary', { videoId });
        setSummary(response.data.summary);
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [videoId, summary, setSummary, setLoading, setError]);

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

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader message={loadingMessage} />
    </div>
  );
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