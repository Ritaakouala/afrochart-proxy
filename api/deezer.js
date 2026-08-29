export default async function handler(req, res) { res.setHeader('Access-Control-Allow-Origin', '*');
  try { const response = await fetch('https://api.deezer.com/chart'); const data = await response.json(); 
       res.status(200).json(data); } catch (error) { res.status(500).json({ error: 'Erreur lors de la récupération des données' }); } }


