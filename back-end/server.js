const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));