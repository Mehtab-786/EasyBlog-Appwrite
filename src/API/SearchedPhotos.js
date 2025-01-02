const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

export const fetchSearchedPhotos = async (query, page = 1, perPage = 15) => {
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=${perPage}`, {
            headers: {
                Authorization: pexelsApiKey
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching searched photos:', error);
        throw error; // Rethrow for proper handling
    }
};
