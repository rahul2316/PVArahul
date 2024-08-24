const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock database to store GIFs data (views and likes)
let gifsData = {};

// Endpoint to update views
app.post('/update-view', (req, res) => {
    const gifUrl = req.body.url;
    
    if (!gifsData[gifUrl]) {
        gifsData[gifUrl] = { views: 0, likes: 0 };
    }
    
    gifsData[gifUrl].views += 1;
    
    res.json({ message: 'View updated', data: gifsData[gifUrl] });
});

// Endpoint to update likes
app.post('/update-like', (req, res) => {
    const gifUrl = req.body.url;
    
    if (!gifsData[gifUrl]) {
        gifsData[gifUrl] = { views: 0, likes: 0 };
    }
    
    gifsData[gifUrl].likes += 1;
    
    res.json({ message: 'Like updated', data: gifsData[gifUrl] });
});

// Endpoint to fetch GIFs (mocked for this example)
app.get('/search-gifs', async (req, res) => {
    const searchTerm = req.query.q;
    const apiKey = 'kNg6r7IwXgo8LPtL5HdXRfE7M2FeKvdN';
    const limit = 10; // Set your limit

    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
        const data = await response.json();
        
        res.json(data.data.map(gif => ({
            url: gif.images.fixed_height.url,
            title: gif.title,
            id: gif.id
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching GIFs' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
