import { config } from './config';
import axios from 'axios';

const url="https://api.vultrinference.com/v1/chat/completions";
async function postRequest(message) {
    try {
        const response = await axios.post(url, {
            "model": "zephyr-7b-beta-Q5_K_M",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ],
            "max_tokens": 512,
            "seed": -1,
            "temperature": 0.8,
            "top_k": 40,
            "top_p": 0.9,
            "stream": true
        }, {
            headers: {
                authorization: `Bearer ${config.api_key}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default postRequest; 