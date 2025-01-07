const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // Puerto en el que correrá el servidor

// Ruta para obtener servidores de un lugar (busca solo por UserId)
app.get('/get-servers-by-userid/:userId/:placeId', async (req, res) => {
    const userId = req.params.userId;  // El UserId del jugador
    const placeId = req.params.placeId; // El placeId del juego

    let cursor = req.query.cursor || null;
    try {
        // URL base para obtener los servidores
        let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Asc&limit=100`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }

        // Solicitud a la API de Roblox para obtener los servidores
        const response = await axios.get(url);
        const data = response.data;

        // Buscar en los servidores el que tenga al jugador con el UserId
        let serverId = null;
        if (data && data.data) {
            for (let server of data.data) {
                if (server.playing) {
                    for (let token of server.playerTokens) {
                        if (token == userId) {
                            serverId = server.id;
                            break;
                        }
                    }
                }
                if (serverId) break; // Si encontramos el servidor, salimos del loop
            }
        }

        if (serverId) {
            res.json({ serverId: serverId });  // Devolvemos el ID del servidor donde está el jugador
        } else {
            res.status(404).json({ error: "Jugador no encontrado en los servidores" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor intermedio corriendo en http://localhost:${port}`);
});
