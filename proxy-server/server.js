const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Route to handle requests for a single collection
app.get('/api/collection/:id/items', async (req, res) => {
  const collectionId = req.params.id;

  try {
    const response = await axios.get(`https://api.webflow.com/collections/${collectionId}/items`, {
      headers: {
        Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
        'Accept-Version': '1.0.0',
      },
    });

    console.log('API response data:', response.data.items);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

// Route to handle requests for multiple collections
app.get('/api/collections/items', async (req, res) => {
  const collectionIds = [req.query.id1, req.query.id2, req.query.id3];

  try {
    const results = await Promise.all(
      collectionIds.map(async (id) => {
        const response = await axios.get(`https://api.webflow.com/collections/${id}/items`, {
          headers: {
            Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
            'Accept-Version': '1.0.0',
          },
        });
        return { collectionId: id, items: response.data };
      })
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
