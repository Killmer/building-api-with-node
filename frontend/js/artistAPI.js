export const getArtists = (url) => {
    const params = {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }
    return fetch(url, params)
        .then((data) => data.json())
};

export const deleteArtist = (url) => {
    const params = {
        method: "DELETE",
    }
    return fetch(url, params)
};

export const addArtist = (url, artistData) => {
    const params = {
        method: "POST",
        body: artistData,
    }
    return fetch(url, params)
        .then((data) => data.json())
};

export default {
    getArtists,
    deleteArtist
}