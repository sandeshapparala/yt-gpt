'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import Loader from "@/components/Loader";

const SummaryTab = ({ videoId, summary, setSummary, loading, setLoading, error, setError }) => {
  const [loadingMessage, setLoadingMessage] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [isReading, setIsReading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

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
    async function loadVoices() {
      try {
        const response = await axios.get('/api/azureVoices');
        setVoices(response.data);
        if (response.data.length > 0) {
          setSelectedVoice(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    }
    loadVoices();
  }, []);

  const readAloud = async () => {
    if (!summary || !selectedVoice) return;

    try {
      setLoading(true);

      const response = await axios.post('/api/azureTTS', {
        text: summary,
        voiceName: selectedVoice.shortName,
        rate: rate * 100, // Convert rate to percentage
      }, {
        responseType: 'blob', // Get binary data
      });

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.playbackRate = rate;
      audio.play();
      setAudioElement(audio);
      setIsReading(true);

      audio.onended = () => {
        setIsReading(false);
        setAudioElement(null);
        URL.revokeObjectURL(url);
      };

    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const pauseReading = () => {
    if (audioElement) {
      audioElement.pause();
      setIsReading(false);
    }
  };

  const resumeReading = () => {
    if (audioElement) {
      audioElement.play();
      setIsReading(true);
    }
  };

  const stopReading = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsReading(false);
      setAudioElement(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  };

  const handleRateChange = (e) => {
    const newRate = Number(e.target.value);
    setRate(newRate);
    if (audioElement) {
      audioElement.playbackRate = newRate;
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
                  value={selectedVoice?.shortName}
                  onChange={(e) => setSelectedVoice(voices.find(voice => voice.shortName === e.target.value) || null)}
                  className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {voices.map((voice) => (
                    <option key={voice.shortName} value={voice.shortName}>{voice.FriendlyName}</option>
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
              {!isReading && (
                  <button onClick={readAloud} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow text-xs font-semibold transition duration-200">Read Aloud</button>
              )}
              {isReading && (
                  <>
                    <button onClick={pauseReading} className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow text-xs font-semibold transition duration-200">Pause</button>
                    <button onClick={stopReading} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs font-semibold transition duration-200">Stop</button>
                  </>
              )}
              {!isReading && audioElement && (
                  <button onClick={resumeReading} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow text-xs font-semibold transition duration-200">Resume</button>
              )}
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
