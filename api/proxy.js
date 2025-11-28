// api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { type, PHPSESSID, q, artist } = req.query;
  let url;

  switch (type) {
    case 'loggedIn':
      url = `https://spotlisten.infinityfreeapp.com/logged-in?PHPSESSID=${PHPSESSID}`;
      break;
    case 'myPlaylists':
      url = `https://spotlisten.infinityfreeapp.com/spotify/my/playlists?PHPSESSID=${PHPSESSID}`;
      break;
    case 'recentTracks':
      url = `https://spotlisten.infinityfreeapp.com/spotify/my/recent-tracks?PHPSESSID=${PHPSESSID}`;
      break;
    case 'myTopArtists':
      url = `https://spotlisten.infinityfreeapp.com/spotify/my/top-artists?PHPSESSID=${PHPSESSID}`;
      break;
    case 'unlink':
      url = `https://spotlisten.infinityfreeapp.com/spotify/unlink?PHPSESSID=${PHPSESSID}`;
      break;
    case 'searchArtist':
      url = `https://spotlisten.infinityfreeapp.com/spotify/search/artist?name=${encodeURIComponent(q)}`;
      break;
    case 'searchGenre':
      url = `https://spotlisten.infinityfreeapp.com/search/genre?genre=${encodeURIComponent(q)}`;
      break;
    case 'infoArtist':
      url = `https://spotlisten.infinityfreeapp.com/info/artists?artist=${encodeURIComponent(artist)}`;
      break;
    case 'top15artists':
      url = `https://spotlisten.infinityfreeapp.com/lasfm/top15artists`;
      break;
    case 'top15tracks':
      url = `https://spotlisten.infinityfreeapp.com/lasfm/top15tracks`;
      break;
    case 'logout':
      url = `https://spotlisten.infinityfreeapp.com/logout`;
      break;
    case 'login':
      url = `https://spotlisten.infinityfreeapp.com/login`;
      break;
    case 'register':
      url = `https://spotlisten.infinityfreeapp.com/register`;
      break;
    default:
      return res.status(400).json({ message: "Tipo inválido" });
  }

  try {
    // Não enviar Content-Type para GET, apenas para POST/DELETE
    const headers = {};
    if (req.method !== 'GET') headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    // Se o servidor retornar erro, envia o texto de erro sem tentar parsear JSON
    if (!response.ok) {
      const text = await response.text();
      console.error('Erro do InfinityFree:', text);
      return res.status(response.status).send(text);
    }

    // Tenta parsear JSON, mas só se for válido
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      const text = await response.text();
      return res.status(200).send(text);
    }

  } catch (err) {
    console.error('Erro no proxy:', err);
    res.status(500).json({ message: "Erro no proxy" });
  }
}
