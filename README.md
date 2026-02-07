# 💊 FinDawa - AI-Powered Pharmaceutical Ecosystem

> **Winner/Submission for Google Gemini API Developer Competition**
> *Real-time medication geolocation and stock prediction powered by Google Gemini 3.*

[![Gemini 3](https://img.shields.io/badge/Powered%20by-Google%20Gemini%203-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

## 🚀 Overview
**FinDawa** solves the critical issue of medication shortages in Morocco. It connects patients, pharmacists, and distributors in a unified real-time ecosystem. 

Unlike traditional apps, FinDawa utilizes **Google Gemini 3's Multimodal capabilities** to:
1.  **Predict Stockouts:** Analyze consumption patterns to alert pharmacists before stock runs out.
2.  **Smart Search:** Enable patients to find medicine using natural language.
3.  **Optimize Logistics:** visualize supply chains on a 3D interactive map.

---

## 🧠 How We Use Google Gemini 3
The core intelligence of FinDawa relies on the Gemini API (`gemini-1.5-pro` & `gemini-1.5-flash`).

### 1. Intelligent Stock Prediction (The "Winbox")
We feed historical sales data and seasonal trends into Gemini to generate actionable insights for pharmacists.
* **Input:** Sales Logs (JSON) + Season Context.
* **Gemini Output:** "High probability of Doliprane shortage in 48h. Recommended Action: Reorder 50 units."

### 2. Multimodal Architecture
* **Frontend:** React.js + Three.js (for 3D Visualization).
* **Backend:** Firebase (Realtime Database).
* **AI Layer:** Gemini API calls via Node.js Cloud Functions.

---

## 📸 Demo & Screenshots

| Patient View (3D Map) | Pharmacist Dashboard (Winbox) |
| --------------------- | ----------------------------- |
| *[Insert Screenshot of Map]* | *[Insert Screenshot of Dashboard]* |

---

## 🛠️ Installation & Setup

To run this project locally:

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/y-elmahmi/FinDawa.git](https://github.com/y-elmahmi/FinDawa.git)
    cd FinDawa
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file and add your keys:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_key
    REACT_APP_GEMINI_API_KEY=your_key
    ```

4.  **Run the App**
    ```bash
    npm start
    ```

---

## 👨‍💻 Team & Acknowledgment
Developed by **EL MAHMI YOUSSEF**.
* *Academic Supervision:* Faculty of Sciences of Meknes (Master SIRO/Big Data).
* *Development Approach:* AI-Assisted Development (Leveraging Gemini for code generation and architecture).

---
*Built with ❤️ for a healthier Morocco.*
