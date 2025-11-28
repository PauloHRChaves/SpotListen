// login.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://spotlisten.infinityfreeapp.com/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao logar" });
  }
}
