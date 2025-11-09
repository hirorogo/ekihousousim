// APIサーバー本体
import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

import uploadApi from './api/upload.js';
import materialsApi from './api/materials.js';
import adminApi from './api/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/upload', uploadApi);
app.use('/api/materials', materialsApi);
app.use('/api/admin', adminApi);

app.get('/', (req, res) => {
  res.send('APIサーバー稼働中');
});

app.listen(PORT, () => {
  console.log(`APIサーバー起動: http://localhost:${PORT}`);
});
