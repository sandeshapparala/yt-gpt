import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
    throw new Error('Missing YOUTUBE_API_KEY in environment variables');
}

export const getVideoDetails = async (videoId: string) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`
        );
        const item = response.data.items[0];
        console.log(item);
        return {
            title: item.snippet.title,
            channel: item.snippet.channelTitle,

        };
    } catch (error) {
        console.error('Error fetching video details:', error);
        throw new Error('Failed to fetch video details');
    }
};