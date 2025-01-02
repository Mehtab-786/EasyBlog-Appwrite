const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

export const fetchRandomPhotos = async (page = 1, perPage = 15) => {
    try {
        const response = await fetch(`https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`, {
            headers: {
                Authorization: pexelsApiKey
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching random photos:', error);
        throw error; // Rethrow for proper handling
    }
};
