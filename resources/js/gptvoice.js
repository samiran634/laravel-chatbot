const url = "http://localhost:4000/api1/audio/voices";

async function getVoices() {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching voices:', error.message);
        throw error;
    }
}

export default getVoices;
