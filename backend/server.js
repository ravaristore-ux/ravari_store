const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/', (req, res) => {
  res.send('Ravari Store Running');
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server on 5000');
});
