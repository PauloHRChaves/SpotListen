import fetch from "node-fetch";

export default async function handler(req, res) {
  const PHPSESSID = req.query.PHPSESSID || '';
  try {
    const response = await fetch(`https://spotlisten.infinityfreeapp.com/spotify/my/recent-tracks?PHPSESSID=${PHPSESSID}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar faixas recentes" });
  }
}
