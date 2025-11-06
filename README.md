## プロジェクト概要
名古屋鉄道（名鉄）の駅放送を再現できる静的Webアプリケーション

## 機能要件

### 1. 駅選択機能
- 名鉄全線の駅一覧から選択可能
- 路線別での絞り込み機能
- 検索機能（駅名の部分一致）

### 2. 放送種別選択

- **到着放送**：「まもなく○番線に△△行きが到着します」
- **発車放送**：「○番線の△△行きが発車いたします」
- **乗り換え案内**：「○○方面は△△線にお乗り換えください」
- **安全放送**：「黄色い線まで下がってお待ちください」

### 3. カスタマイズ機能
- 行き先設定（特急・急行・普通の種別選択）
- 番線選択（1-10番線程度）
- 車両数設定（2両・4両・6両・8両）
- 女性・男性アナウンサー選択

### 4. 音声再生機能
- リアルタイム音声合成（Web Speech API使用）
- 再生・停止・リピート機能
- 音量調整
- 再生速度調整

### 5. プリセット機能
- よく使用する設定の保存
- プリセット呼び出し機能
- ローカルストレージでの設定保存

## 技術要件

### フロントエンド
- **React + Vite**（現在の構成）
- **LocalStorage**（設定保存）

### データ構造
````javascript
// 駅データ
const stations = {
  line: "名古屋本線",
  stations: [
    { id: 1, name: "名古屋", platforms: [1,2,3,4] },
    { id: 2, name: "金山", platforms: [5,6] }
  ]
}

// 放送設定
const broadcastConfig = {
  station: "名古屋",
  platform: 1,
  destination: "豊橋",
  trainType: "特急",
  cars: 6,
  voice: "female",
  broadcastType: "arrival"
}
````

### ディレクトリ構成
````
src/
├── components/
│   ├── StationSelector/
│   ├── BroadcastPlayer/
│   ├── SettingsPanel/
│   └── PresetManager/
├── data/
│   └── stations.js
├── hooks/
│   └── useSpeechSynthesis.js
├── utils/
│   └── broadcastGenerator.js
└── styles/
    └── global.css
````

### ページ構成
1. **メインページ**：全機能を1画面に集約
2. **駅選択エリア**：路線選択→駅選択
3. **設定エリア**：放送内容のカスタマイズ
4. **再生エリア**：放送テキスト表示と再生ボタン

