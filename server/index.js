// APIサーバー本体
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const uploadApi = require('./api/upload');
const materialsApi = require('./api/materials');
const commentsApi = require('./api/comments');
const ratingsApi = require('./api/ratings');
const usersApi = require('./api/users');
const ocrApi = require('./api/ocr');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/upload', uploadApi);
app.use('/api/materials', materialsApi);
app.use('/api/comments', commentsApi);
app.use('/api/ratings', ratingsApi);
app.use('/api/users', usersApi);
app.use('/api/ocr', ocrApi);

app.get('/', (req, res) => {
  res.send('APIサーバー稼働中');
});

app.listen(PORT, () => {
  console.log(`APIサーバー起動: http://localhost:${PORT}`);
});
