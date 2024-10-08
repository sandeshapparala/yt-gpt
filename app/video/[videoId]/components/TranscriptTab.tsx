// app/video/[videoId]/components/TranscriptTab.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface TranscriptProps {
    videoId: string;
}

const TranscriptTab: React.FC<TranscriptProps> = ({ videoId }) => {
    const [transcript, setTranscript] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                setLoading(true);
                const response = await axios.post('/api/transcript', { videoId });
                setTranscript(response.data.transcript);
            } catch (err) {
                setError('Failed to load transcript.');
            } finally {
                setLoading(false);
            }
        };

        fetchTranscript();
    }, [videoId]);

    if (loading) {
        return <div>Loading transcript...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <pre className="whitespace-pre-wrap">{transcript}</pre>
        </div>
    );
};

export default TranscriptTab;
