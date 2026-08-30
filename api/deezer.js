export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const genreId = req.query.genre || 0;
  const limit = req.query.limit || 10;
  const albumId = req.query.albumId;

  try {
    let url;
    if (albumId) {
      url = `https://api.deezer.com/album/${albumId}/tracks`;
    } else {
      url = `https://api.deezer.com/chart/${genreId}?limit=${limit}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
}
