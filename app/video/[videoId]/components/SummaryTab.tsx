'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import Loader from "@/components/Loader";
import { synthesizeSpeech } from './azureSpeechService';

const SummaryTab = ({ videoId, summary, setSummary, loading, setLoading, error, setError, loadingMessage }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      if (summary) return;
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
  }, [videoId, summary, setSummary, setLoading, setError]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices().slice(0, 4);
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, []);

  const readAloud = async () => {
    try {
      setIsReading(true);
      await synthesizeSpeech(summary); // Replace with actual summary text
      setIsReading(false);
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      setIsReading(false);
    }
  };

  const stopReading = () => {
    // Azure Speech SDK does not have a direct cancel method, you may need to handle this differently
    setIsReading(false);
  };

  const handleRateChange = (e) => {
    const newRate = Number(e.target.value);
    setRate(newRate);
    if (isReading) {
      stopReading();
      readAloud();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader message={loadingMessage} />
    </div>
  );
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 relative">
      {/* Improved Read-Aloud Controls */}
      <div className="sticky top-0 bg-gray-100 p-4 rounded-md shadow-sm z-10 mb-2 border border-gray-200">
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Select Voice:</label>
            <select
              value={selectedVoice?.name}
              onChange={(e) => setSelectedVoice(voices.find(voice => voice.name === e.target.value) || null)}
              className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>{voice.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Reading Speed:</label>
            <input
              type="range"
              value={rate}
              onChange={handleRateChange}
              min="0.5"
              max="2"
              step="0.1"
              className="slider w-32 accent-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={readAloud} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow text-xs font-semibold transition duration-200">Read Aloud</button>
            <button onClick={stopReading} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs font-semibold transition duration-200">Stop</button>
          </div>
        </div>
      </div>
      
      {/* Summary Content */}
      <div className="prose max-w-none text-black pt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SummaryTab;
