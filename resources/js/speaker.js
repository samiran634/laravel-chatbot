import { config } from './config';
import axios from 'axios';
const url="http://localhost:4000/api2/audio/speech"


async function speech(text,voice) {
    try {
        const response = await axios.post(url,{text,voice});
        return response.data;
    } catch (error) {
        console.error('Error fetching voices:', error.message);
        throw error;
    }
}

export default speech;