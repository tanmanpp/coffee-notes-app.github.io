# ☕ Coffee Note App

github page: https://tanmanpp.github.io/coffee-notes-app.github.io/

一款專為**手沖咖啡愛好者**設計的跨平台咖啡紀錄 App  
幫助你系統化管理咖啡豆、沖煮紀錄、風味筆記  
讓每一次沖煮都有跡可循、越來越好喝

---

## ✨ 功能特色

### ☕ 咖啡豆管理
- 紀錄咖啡豆基本資訊：
  - 產地（Origin）
  - 莊園（Farm）
  - 處理法（Process）
  - 烘焙日期（Roast Date）
- 支援咖啡豆照片上傳
- 以咖啡豆作為核心，串連所有沖煮紀錄

### 🫖 沖煮紀錄
- 針對每一款咖啡豆新增多筆沖煮紀錄
- 可記錄：
  - 濾杯種類
  - 磨豆機
  - 粉水比、時間
  - 風味描述與心得
- 支援不同沖煮紀錄的**比較分析**

### 📝 浮動筆記小工具
- 類似 iOS「小白點」的全域浮動筆記
- 可拖曳、展開／收合
- 快速記錄靈感、風味感受或下次調整方向
- 歷史筆記可捲動查看

### 🔐 使用者帳號系統
- 使用 **Supabase Authentication**
- Email 驗證登入
- 登出功能（位於主畫面底部）
- 每位使用者的資料完全獨立

---

## 🖥️ 使用方式（一般使用者）

1. 開啟網站
2. 註冊帳號並完成 Email 驗證
3. 登入後即可：
   - 新增咖啡豆
   - 記錄沖煮過程
   - 使用浮動筆記做即時紀錄
4. 所有資料都會安全儲存在雲端，下次登入可繼續使用

### 📱 加入主畫面（像 App 一樣使用）

#### 🍎 iPhone（Safari）

1. 使用 **Safari** 開啟本網站  
2. 點擊下方 **分享按鈕**  
3. 選擇 **「加入主畫面」**  
4. 可自行修改名稱後，點擊 **加入**  
5. 回到主畫面，即可像 App 一樣點擊開啟  

#### 🤖 Android（Chrome）

1. 使用 Chrome 開啟本網站
2. 點擊右上角 ⋮（更多）
3. 選擇 「加入主畫面」 或 「安裝 App」
4. 確認後即可在主畫面看到 App 圖示

---

## 🛠️ 技術架構

- **Frontend**
  - React + TypeScript
  - Vite
  - Tailwind CSS
  - Lucide Icons

- **Backend / BaaS**
  - Supabase
    - Authentication（Email 驗證）
    - PostgreSQL Database
    - Storage（咖啡豆照片）

- **Deployment**
  - GitHub Pages（靜態部署）
  - Supabase 雲端服務

---

## 🎨 設計與開發流程

- 使用 **Figma** 進行 UI / UX 規劃與 Wireframe 設計
- 開發過程中搭配 **ChatGPT**：
  - 協助前端架構設計
  - UI / UX 微調建議
  - Supabase 串接與除錯
  - README 與文件撰寫

## 📄 License

本專案為個人學習與作品展示用途
歡迎 Fork、學習與交流 ☕
