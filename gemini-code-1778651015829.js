const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve the frontend files
app.use(express.static('public'));

// The Download Proxy Route
app.get('/download', async (req, res) => {
    const { videoId, quality } = req.query;

    if (!videoId || !quality) {
        return res.status(400).send('Missing parameters');
    }

    const imageUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

    try {
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });

        // Force the browser to download the file instead of opening it
        res.setHeader('Content-Disposition', `attachment; filename="youtube_thumbnail_${quality}.jpg"`);
        res.setHeader('Content-Type', 'image/jpeg');

        response.data.pipe(res);
    } catch (error) {
        res.status(404).send('Thumbnail resolution not found for this video.');
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});