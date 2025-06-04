# 🎯 Meeetimer

プレゼンテーション時間管理ツール - 時間Overを防止するためのタイマーアプリケーション

## 🌟 特徴

- **最大3回のアラート通知**: 設定した残り時間でアラート音とビジュアル通知
- **プレゼンモード**: 全画面表示でプレゼンテーション中に最適化
- **キーボードショートカット**: スペースキーやF11キーで素早い操作
- **設定の永続化**: 前回の設定を自動的に保存
- **レスポンシブデザイン**: デスクトップとモバイルの両方に対応
- **視覚的フィードバック**: 進捗に応じた色分け表示

## 🚀 使用方法

### 基本操作

1. **時間設定**: プリセット時間を選択するか、時間と分を手動で入力
2. **アラート設定**: 最大3回のアラートタイミングを設定（例：残り10分、5分、1分）
3. **タイマー開始**: 「タイマーを設定」ボタンでタイマーモードに移行
4. **操作**: スタート/一時停止/リセット/全画面モードの切り替え

### キーボードショートカット

| キー | 機能 |
|------|------|
| `Space` / `Enter` | スタート/一時停止の切り替え |
| `P` | 一時停止 |
| `Esc` | リセット（設定画面に戻る） |
| `F11` | 全画面モードの切り替え |

### プレゼンモード

- 全画面表示で最大限の視認性
- ダークテーマで集中力を向上
- 不要な情報を非表示にしてシンプルな表示

## 🛠️ 技術スタック

- **Next.js 15**: React フレームワーク
- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: スタイリング
- **Biome**: リンター・フォーマッター
- **Web Audio API**: アラート音の再生

## 📦 セットアップ

### 必要条件

- Node.js 20以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-username/meeetimer.git
cd meeetimer

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# 静的エクスポート（GitHub Pages用）
npm run export
```

## 🔧 開発

### スクリプト

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # Biome linting
npm run format       # Biome formatting
npm run check        # Biome check（lint + format）
```

### プロジェクト構造

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # レイアウトコンポーネント
│   └── page.tsx      # メインページ
├── components/       # UIコンポーネント
│   ├── TimerDisplay.tsx    # タイマー表示
│   ├── TimeInput.tsx       # 時間入力フォーム
│   └── TimerControls.tsx   # コントロールボタン
└── hooks/           # カスタムフック
    ├── useTimer.ts          # タイマーロジック
    ├── useFullscreen.ts     # 全画面制御
    ├── useKeyboardShortcuts.ts  # キーボード操作
    └── useLocalStorage.ts   # 設定永続化
```

## 🌐 デプロイ

### GitHub Pages

このプロジェクトはGitHub Pagesでの静的ホスティングに対応しています。

1. GitHub上でリポジトリを作成
2. コードをpush
3. GitHub ActionsでCI/CDが自動実行
4. GitHub Pagesで公開

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - 素晴らしいReactフレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [Biome](https://biomejs.dev/) - 高速なlinter/formatter

## クレジット
- 使用した音素材：OtoLogic(https://otologic.jp)

---

**Meeetimer** で、あなたのプレゼンテーションを時間通りに成功させましょう！🎯
