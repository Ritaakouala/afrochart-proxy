export default async function handler(req, res) {
  // ==============================
  // CORS
  // ==============================

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Réponse aux requêtes OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ==============================
  // PARAMÈTRES
  // ==============================

  const {
    genre,
    limit = 50,
    albumId,
    artistId,
    playlistId,
    search,
  } = req.query;

  try {
    let url = "";

    // ==============================
    // RECHERCHE
    // ==============================

    if (search) {
      url =
        `https://api.deezer.com/search` +
        `?q=${encodeURIComponent(search)}` +
        `&limit=${limit}`;
    }

    // ==============================
    // ALBUM
    // ==============================

    else if (albumId) {
      url =
        `https://api.deezer.com/album/${albumId}/tracks` +
        `?limit=${limit}`;
    }

    // ==============================
    // ARTISTE
    // ==============================

    else if (artistId) {
      url =
        `https://api.deezer.com/artist/${artistId}/top` +
        `?limit=${limit}`;
    }

    // ==============================
    // PLAYLIST
    // ==============================

    else if (playlistId) {
      url =
        `https://api.deezer.com/playlist/${playlistId}/tracks` +
        `?limit=${limit}`;
    }

    // ==============================
    // CHART
    // ==============================

    else {
      const genreId = genre || 0;

      url =
        `https://api.deezer.com/chart/${genreId}/tracks` +
        `?limit=${limit}`;
    }

    console.log("URL Deezer :", url);

    // ==============================
    // APPEL DEEZER
    // ==============================

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur API Deezer",
        status: response.status,
      });
    }

    const data = await response.json();

    // ==============================
    // ERREUR DEEZER
    // ==============================

    if (data.error) {
      return res.status(400).json({
        error: "Deezer a retourné une erreur",
        details: data.error,
      });
    }

    // ==============================
    // RÉPONSE
    // ==============================

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur Deezer :", error);

    return res.status(500).json({
      error:
        "Erreur lors de la récupération des données Deezer",
      details: error.message,
    });
  }
}
