# 🚦 Automatic Street Light Control System

A full-stack **smart street lighting simulation** that dynamically adjusts brightness based on ambient light, motion, weather, traffic density, and pedestrian activity — with real-time energy savings analytics.

Built with a **Flask** backend simulation engine and a **React + Vite + Tailwind** dashboard for live monitoring and control.

---

## ✨ Features

- **Adaptive Brightness Engine** — lights react to ambient light level, motion detection, and pedestrian zones in real time.
- **Weather-Aware Logic** — brightness automatically adjusts for `CLEAR`, `FOGGY`, `RAIN`, and `STORM` conditions.
- **Traffic-Density Response** — brightness boosts scale with `LOW` / `MEDIUM` / `HIGH` traffic.
- **Multiple Control Modes** — `AUTO`, `MANUAL`, `ECO`, and `EMERGENCY` modes per light.
- **Maintenance Simulation** — lights degrade over time, trigger faults, and can be serviced/reset.
- **Energy Analytics** — tracks actual vs. baseline vs. eco energy consumption and computes real savings percentages.
- **Live Dashboard** — interactive map, animated lamp visuals, system logs, and a savings ring, all updating in real time.
- **REST API** — simple endpoints to add/remove lights, change modes, set brightness, and control simulation speed.

---

## 🏗️ Architecture

```
Automatic-Street-Light-Control-System/
├── backend/                   # Flask simulation & REST API
│   ├── app.py                 # API routes
│   ├── simulation.py          # Core simulation loop / state manager
│   ├── decision_engine.py     # Brightness decision logic
│   ├── sensor_simulator.py    # Simulated environmental sensors
│   ├── energy_tracker.py      # Energy usage & savings calculations
│   ├── models.py              # StreetLight data model
│   └── requirements.txt
│
└── frontend/                  # React + Vite dashboard
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   └── components/
    │       ├── Dashboard.jsx
    │       ├── StreetLightMap.jsx
    │       ├── EnergyPanel.jsx
    │       ├── SavingsRing.jsx
    │       ├── SystemLog.jsx
    │       ├── LightCard.jsx
    │       ├── AnimatedLamp.jsx
    │       ├── RealisticLamp.jsx
    │       ├── AmbientBackground.jsx
    │       └── Header.jsx
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Backend   | Python, Flask, Flask-CORS |
| Frontend  | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| Data flow | REST API polling (`/api/state`, `/api/history`) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Automatic-Street-Light-Control-System.git
cd Automatic-Street-Light-Control-System
```

### 2. Run the backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
The API will be available at `http://localhost:5000`.

### 3. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check + node count |
| GET | `/api/state` | Current snapshot of all lights |
| GET | `/api/history` | Historical simulation data |
| POST | `/api/lights` | Add a new street light |
| DELETE | `/api/lights/<id>` | Remove a street light |
| POST | `/api/lights/<id>/mode` | Set mode (`AUTO`/`MANUAL`/`ECO`/`EMERGENCY`) |
| POST | `/api/lights/<id>/brightness` | Set manual brightness |
| POST | `/api/lights/<id>/service` | Reset health / clear faults |
| POST | `/api/control/speed` | Adjust simulation speed |

---

## 📊 How It Works

1. `sensor_simulator.py` generates simulated real-world conditions (light level, weather, temperature, motion, traffic, pedestrians) based on time of day.
2. `decision_engine.py` evaluates these inputs against each light's mode and thresholds to decide status and brightness.
3. `energy_tracker.py` calculates actual energy usage against "always-on" and "eco" baselines to quantify savings.
4. The Flask API exposes live state, which the React dashboard polls and visualizes every second.

---

## 🗺️ Roadmap

- [ ] Persistent storage (database) instead of in-memory simulation
- [ ] User authentication for control actions
- [ ] Real IoT sensor integration
- [ ] Historical analytics export (CSV/PDF)

---

## 📄 License

This project is open source and available for personal and educational use. 
