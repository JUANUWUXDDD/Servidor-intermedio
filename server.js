const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // Puerto en el que correrá el servidor

// Ruta para obtener UserId desde un nombre de usuario
app.get('/get-userid/:username', async (req, res) => {
    const username = req.params.username;
    try {
        // Solicitud a la API de Roblox para buscar al usuario
        const response = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}`);
        res.json(response.data); // Envía los datos al cliente
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener servidores públicos de un lugar
app.get('/get-servers/:placeId', async (req, res) => {
    const placeId = req.params.placeId;
    let cursor = req.query.cursor || null;
    try {
        // URL base para obtener los servidores
        let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Asc&limit=100`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }
        // Solicitud a la API de Roblox para obtener los servidores
        const response = await axios.get(url);
        res.json(response.data); // Envía los datos al cliente
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor intermedio corriendo en http://localhost:${port}`);
});