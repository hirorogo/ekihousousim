// APIサーバー本体
import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

import uploadApi from './api/upload.js';
import materialsApi from './api/materials.js';
import commentsApi from './api/comments.js';
import ratingsApi from './api/ratings.js';
import usersApi from './api/users.js';
import ocrApi from './api/ocr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
