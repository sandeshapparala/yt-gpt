'use client';
import { useEffect } from 'react';
import axios from 'axios';
import Loader from "@/components/Loader";

const TranscriptTab = ({ videoId, transcript, setTranscript, loading, setLoading, error, setError }:
    { videoId: string, transcript: string, setTranscript: (transcript: string) => void, loading: boolean, setLoading: (loading: boolean) => void, error: string, setError: (error: string) => void }) => {

  useEffect(() => {
    async function fetchTranscript() {
      if (transcript) return; // If transcript is already fetched, do not fetch again
      try {
        setLoading(true);
        const response = await axios.post('/api/transcript', { videoId });
        setTranscript(response.data.transcript);
      } catch (err) {
        console.error('Error fetching transcript:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchTranscript();
  }, [videoId, transcript, setTranscript, setLoading, setError]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader message="Loading transcript..." />
    </div>
  );
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="prose max-w-none text-black">
        {transcript}
      </div>
    </div>
  );
};

export default TranscriptTab;