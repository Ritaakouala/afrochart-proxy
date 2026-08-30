export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const genreId = req.query.genre;
  const limit = req.query.limit || 50;
  const albumId = req.query.albumId;
  const artistId = req.query.artistId;
  const search = req.query.search;
  const playlistId = req.query.playlistId;

  try {
    let url;

    // =====================================================
    // RECHERCHE
    // =====================================================

    if (search) {
      url = `https://api.deezer.com/search?q=${encodeURIComponent(
        search
      )}&limit=${limit}`;
    }

    // =====================================================
    // ALBUM
    // =====================================================

    else if (albumId) {
      url = `https://api.deezer.com/album/${albumId}/tracks?limit=${limit}`;
    }

    // =====================================================
    // ARTISTE
    // =====================================================

    else if (artistId) {
      url = `https://api.deezer.com/artist/${artistId}/top?limit=${limit}`;
    }

    // =====================================================
    // PLAYLIST
    // =====================================================

    else if (playlistId) {
      url = `https://api.deezer.com/playlist/${playlistId}/tracks?limit=${limit}`;
    }

    // =====================================================
    // CATÉGORIES MUSICALES
    // =====================================================

    else {
      switch (String(genreId)) {

        // 🌍 MONDIAL
        case "0":
          url = `https://api.deezer.com/chart/0/tracks?limit=${limit}`;
          break;

        // 🔥 AFROBEATS
        case "132":
          url = `https://api.deezer.com/chart/132/tracks?limit=${limit}`;
          break;

        // 💃 LATINO
        case "116":
          url = `https://api.deezer.com/chart/116/tracks?limit=${limit}`;
          break;

        // 🇰🇷 K-POP / ASIE
        case "129":
          url = `https://api.deezer.com/chart/129/tracks?limit=${limit}`;
          break;

        // 🇪🇺 DANCE / EUROPE
        case "152":
          url = `https://api.deezer.com/chart/152/tracks?limit=${limit}`;
          break;

        // 🇫🇷 FRANCE
        case "playlist-1313621735":
          url = `https://api.deezer.com/playlist/1313621735/tracks?limit=${limit}`;
          break;

        // CATÉGORIE PAR DÉFAUT
        default:
          url = `https://api.deezer.com/chart/0/tracks?limit=${limit}`;
          break;
      }
    }

    console.log("URL Deezer :", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Deezer a retourné le statut ${response.status}`
      );
    }

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {

    console.error("Erreur Deezer :", error);

    res.status(500).json({
      error: "Erreur lors de la récupération des données",
      details: error.message,
    });
  }
}
