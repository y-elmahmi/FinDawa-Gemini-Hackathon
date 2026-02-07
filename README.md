# 💊 FinDawa - The Future of AI-Powered Healthcare Access

![FinDawa Banner](https://img.shields.io/badge/Gemini_3-Hackathon_Submission-8E44AD?style=for-the-badge&logo=google-gemini) 
![Status](https://img.shields.io/badge/Status-Prototype_Ready-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React_|_Tailwind_|_Gemini_API-blue?style=for-the-badge)

> **"Bridging the gap between physical healthcare logistics and digital AI intelligence."**

## 📖 Overview

**FinDawa** is a next-generation "Phygital" (Physical + Digital) platform designed to revolutionize how patients access medication and how pharmacists manage supply chains in Morocco. 

Built specifically for the **Gemini 3 Global Hackathon**, FinDawa moves beyond simple chat interfaces to offer a comprehensive ecosystem that leverages **Multimodal AI** and **Advanced Reasoning** to solve real-world crises: drug shortages, late-night pharmacy access, and medication safety.

---

## ✨ Gemini 3 Integration (The AI Engine)

This project harnesses the power of the **Gemini 3 model family** to drive core functionalities, not just as a wrapper, but as the decision-making engine:

### 1. 📷 Multimodal Prescription Analysis (Vision + Text)
* **Feature:** Patients can snap a photo of a handwritten prescription.
* **Gemini Role:** The model parses complex handwriting (Vision), extracts medication names and dosages, converts them into structured JSON data, and instantly queries the inventory of nearby pharmacies.

### 2. 🧠 Medical Reasoning & Safety Layer
* **Feature:** Smart Reservation System.
* **Gemini Role:** Before a reservation is confirmed, Gemini analyzes the new prescription against the patient's digital health record (uploaded history) to **reason** about potential drug interactions or allergies, providing a safety warning to both patient and pharmacist.

### 3. 💬 Context-Aware AI Assistant (Darija Support)
* **Feature:** An interactive Chatbot embedded in the app.
* **Gemini Role:** It understands local context (Moroccan Darija/French dialect mix), helping users find on-duty pharmacies and explaining medical instructions in native language.

---

## 🚀 Key Features

### For Patients 🧑⚕️
* **Smart Search:** Find medicines instantly via Text or Voice.
* **Click & Collect:** Reserve medication at the nearest pharmacy.
* **Tele-Dawa:** Integrated video consultation with doctors.
* **Health Wallet:** Digital medical records and prescription history.

### For Pharmacists ⚕️
* **AI Stock Management:** Predictive alerts for low stock based on local trends.
* **B2B Marketplace:** One-click reordering from importers/suppliers.
* **Network Hub:** Secure communication between pharmacies for drug exchanges.

### For Importers 📦
* **3D Logistics Map:** Real-time visualization of supply chain flows.
* **Market Intelligence:** AI-generated reports on national medication demand.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **Styling:** TailwindCSS
* **Icons:** Lucide React
* **Mapping:** Leaflet / React-Leaflet
* **AI Integration:** Google Gemini API (Flash/Pro models)
* **3D Visualization:** Three.js (Logistics Module)

---

## 🎥 Video Demo

[![Watch the video](https://img.youtube.com/vi/YOUR_VIDEO_ID_HERE/maxresdefault.jpg)]([INSERT DEMO VIDEO LINK HERE])

*(Click the image above to watch the full walkthrough)*

---

## 📦 Installation & Setup

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/findawa.git](https://github.com/your-username/findawa.git)
    cd findawa
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment:**
    Create a `.env` file and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the App:**
    ```bash
    npm run dev
    ```

---

## 🏆 Credits & Acknowledgments

**Project Lead & Engineering:**
Engineered by **EL MAHMI YOUSSEF** specifically for the Gemini API Developer Competition. 

**Academic Context:**
This solution represents a technological leap from its conceptual origins in the *"Innovation Management"* module supervised by **Pr. Kenza Oufaska** (Faculty of Sciences of Meknes, University Moulay Ismail). The technical realization, system design, and AI integration presented here are the result of independent development dedicated to this global competition.

---

<p align="center">
  Made with ❤️ and 🤖 in Morocco.
</p>
*
