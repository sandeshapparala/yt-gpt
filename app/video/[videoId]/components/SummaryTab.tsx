// app/video/[videoId]/components/SummaryTab.tsx
'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useEffect, useState } from 'react';
import axios from 'axios';

const SummaryTab = ({ videoId }: { videoId: string }) => {
    const [summary, setSummary] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function fetchSummary() {
            try {
                setLoading(true);
                const response = await axios.post('/api/summary', { videoId });
                setSummary(response.data.summary);
            } catch (err) {
                console.error('Error fetching summary:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchSummary();
    }, [videoId]);

    if (loading) return <div >Loading summary...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4">
            {/* Render the summary with markdown support if necessary */}

            <div className="prose max-w-none text-black">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            </div>
        </div>
    );
};

export default SummaryTab;


