# Kaifa 訪談分析系統 MVP

本專案為本機可執行的 MVP，使用 Node.js + HTML/CSS/JS 建立一個訪談分析流程。

## 功能
- 輸入受訪者姓名、部門、訪談日期與訪談逐字稿。
- 後端以規則引擎（非 AI API）產生分析報告：
  - 主要問題
  - 流程問題
  - 人員態度
  - 改善建議
  - 優先處理事項
- 分析結果儲存於本機 JSON 檔：`data/reports.json`。

## 安全設計
- 不硬編任何 API Key 或密碼。
- 使用 `.env` 管理環境變數，範例檔為 `.env.example`。
- 前後端均有基本輸入驗證。
- 前端只顯示通用錯誤訊息，不暴露詳細系統錯誤。

## 安裝與啟動
1. 安裝依賴：
   ```bash
   npm install
   ```
2. 建立環境變數：
   ```bash
   cp .env.example .env
   ```
3. 啟動服務：
   ```bash
   npm start
   ```
4. 開啟瀏覽器：
   - [http://localhost:3000](http://localhost:3000)

## 使用方式
1. 填寫表單欄位。
2. 點擊「送出並產生分析」。
3. 系統即顯示分析報告，並自動寫入 `data/reports.json`。

## 專案結構
```
.
├── data/
│   └── reports.json        # 執行後自動建立
├── public/
│   ├── app.js              # 前端互動邏輯
│   ├── index.html          # 介面
│   └── styles.css          # 樣式
├── .env.example
├── package.json
├── README.md
└── server.js               # API 與規則分析
```
