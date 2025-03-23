const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const bearerToken = process.env.BEARER_TOKEN;

app.get('/tweets', async (req, res) => {
  try {
    const userResponse = await axios.get('https://api.x.com/2/users/by/username/tradeglam', {
      headers: { Authorization: `Bearer ${bearerToken}` }
    });
    const userId = userResponse.data.data.id;

    const tweetsResponse = await axios.get(`https://api.x.com/2/users/${userId}/tweets`, {
      params: {
        max_results: 5,
        'tweet.fields': 'created_at,attachments',
        'expansions': 'attachments.media_keys',
        'media.fields': 'url'
      },
      headers: { Authorization: `Bearer ${bearerToken}` }
    });

    res.json(tweetsResponse.data);
  } catch (error) {
    console.error('Hata:', error.response?.data || error.message);
    res.status(500).json({ error: 'Tweetler yüklenemedi.' });
  }
});

app.use(express.static('public'));
app.listen(port, () => console.log(`Sunucu http://localhost:${port} adresinde`));
