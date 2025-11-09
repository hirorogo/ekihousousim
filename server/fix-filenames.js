import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// materials.jsonのパス
const materialsPath = path.join(__dirname, 'data/materials.json');

// materials.jsonを読み込む
const materialsData = fs.readFileSync(materialsPath, 'utf8');
const materials = JSON.parse(materialsData);

// 各資料のfileNameを修正
materials.forEach(material => {
  if (material.fileName) {
    // latin1からUTF-8に変換を試みる
    try {
      const buffer = Buffer.from(material.fileName, 'latin1');
      material.fileName = buffer.toString('utf8');
    } catch (error) {
      console.log(`Error converting fileName for material ${material.id}:`, error);
    }
  }
  
  // ratingフィールドを削除
  delete material.rating;
});

// 修正したデータを保存
fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2), 'utf8');

console.log('✅ ファイル名の文字化けを修正し、ratingフィールドを削除しました');
console.log('修正された資料数:', materials.length);
