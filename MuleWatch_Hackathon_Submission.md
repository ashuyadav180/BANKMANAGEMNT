# 🚀 MuleWatch AI — Hackathon Submission

## 💡 Elevator Pitch
**MuleWatch AI** is a next-generation, real-time fraud detection SOC (Security Operations Center) that utilizes orchestrated AI Agents, dynamic topological graph mapping, and Zero-Knowledge (ZK) Proof concepts to detect, map, and neutralize complex money-laundering "mule" networks before the funds escape.

---

## 🌪️ The Inspiration (The Problem)
Modern financial institutions are losing billions to highly coordinated money laundering rings. Fraudsters use "mule accounts" to test boundaries, structure deposits just below reporting limits, and rapidly drain funds. 
Current banking tools are stuck in the past:
1. **Spreadsheet Hell:** Analysts are forced to investigate fraud using endless, static grids of transaction data.
2. **Black-box AI:** Machine learning models flag accounts with a "95% risk score" but offer zero explanation as to *why*.
3. **Data Privacy Walls:** Banks cannot legally share PII (Personally Identifiable Information) with other banks, allowing fraudsters to hop between institutions effortlessly.

We built **MuleWatch AI** to solve all three.

---

## ⚙️ What it does (Detailed Feature Breakdown)

MuleWatch AI isn't just an alert system; it's a completely automated investigative partner. 

### 1. 🤖 The AI Orchestration Pipeline (AGENT-PIPE)
Instead of a single black-box model, MuleWatch deploys a concurrent pipeline of 6 specialized AI Agents the moment an account is flagged:
- **AGENT 1 (Intake):** Rapidly parses transactions, connected devices, and neighbors.
- **AGENT 2 (Typology Match):** Identifies the exact fraud pattern (e.g., *Test-then-drain + structuring hybrid*).
- **AGENT 3 (Network Mapper):** Calculates the topological ring size of the mule network.
- **AGENT 4 (ZK Prover):** Verifies privacy-preserving rules cryptographically without exposing PII.
- **AGENT 5 (Narrative Builder):** Translates the complex math into a plain-english, human-readable summary.
- **AGENT 6 (SAR Drafter):** Automatically prepares a preliminary Suspicious Activity Report for regulators.

### 2. 🌌 Quantum Feature Mapping (XGBoost Visualization)
Machine learning operates in high-dimensional space. Our **Quantum Tab** projects a live XGBoost decision manifold into a 2D interface. Analysts can physically see how the flagged account is clustering against known "safe" (green) and "fraudulent" (red) behavioral nodes.

### 3. 🕸️ Live Topological Graph 
Mule networks rely on shared devices and peer-to-peer transfers. Our dynamic SVG graph visually maps out the account's entire 6-hop neighborhood, instantly revealing if an account is acting as a centralized "funnel" for illicit funds.

### 4. 🛡️ Zero-Knowledge (ZK) Active Scans
We introduce a conceptual framework for cross-bank intelligence sharing. The ZK tab simulates how banks can run mathematical proofs on the blockchain to verify if an account is fraudulent *without* actually sharing the customer's name, address, or transaction history.

### 5. 💻 Cyberpunk "Dark-Mode" SOC Terminal
We ditched the boring white corporate dashboards. MuleWatch AI uses a high-contrast, cyberpunk-inspired terminal UI designed to reduce eye strain and draw immediate visual attention to critical risk vectors. 

---

## 🛠️ How we built it (Tech Stack)

MuleWatch AI was built using a highly decoupled microservices architecture:

- **Frontend Interface:** 
  - **React 18 & Vite:** For sub-second compilation and high-performance concurrent UI rendering.
  - **Native SVG & CSS:** The graphs and animations are built using pure CSS and Math logic (`useMemo`, trigonometric coordinates) instead of heavy libraries like D3.js or Chart.js, ensuring 60FPS performance.
  - **Lucide-React:** For crisp, lightweight iconography.
- **Backend API Gateway:** 
  - **Node.js & Express:** Handles the high-throughput routing and server-sent events for the live feed.
  - **SQLite:** Acts as a hyper-fast, localized relational database representing the banking ledger (`mulewatch.db`).
- **Machine Learning Engine:** 
  - **Python (Flask):** A completely isolated microservice running Scikit-Learn and XGBoost for dynamic transaction inference.
  - **Custom Data Generators:** We wrote Python scripts to synthetically generate highly realistic, noisy banking data injected with specific fraud typologies to train the models.

---

## 🚧 Challenges we ran into

1. **React State Cascades:** Building a live-feed terminal with 6 agents completing tasks asynchronously caused massive React re-render loops. We had to dive deep into `useEffect` hook optimization, strictly manage our dependency arrays, and carefully sandbox impure mathematical functions (`Math.random`) inside `useState` initializers.
2. **SVG Graph Scaling:** Plotting a dynamic topological network graph using trigonometry meant the graph often broke on smaller laptop screens. We rewrote the graph logic to use percentage-based relative vectors (`calc()`) to ensure the nodes stayed perfectly responsive.
3. **Connecting Python to Node.js:** Establishing a seamless, low-latency bridge between our heavy Machine Learning Python backend and our fast, asynchronous Node.js server required careful architectural planning.

---

## 🏆 Accomplishments that we're proud of

- **Building an "Explainable" AI interface:** We successfully translated complex XGBoost clustering data into a beautiful, human-readable UI that an analyst can understand in 5 seconds.
- **Zero-Dependency Graphics:** We built stunning, animated Risk Rings, Scatter Plots, and Network Graphs completely from scratch using math and pure SVGs.
- **The Design:** We are incredibly proud of the UI aesthetics. It looks and feels exactly like a premium, state-of-the-art security tool.

---

## 📚 What we learned

- **Frontend Architecture matters for AI:** You can have the most accurate ML model in the world, but if the UI is slow, cluttered, or difficult to read, the human operators will ignore the AI's warnings.
- **Strict Mode enforces good habits:** React 18's strict mode ruthlessly exposed our initial sloppy state-management, forcing us to write significantly cleaner, more performant, and "pure" functional components.

---

## 🚀 What's next for MuleWatch AI

1. **Real-World Federated Learning:** Implementing actual blockchain nodes (e.g., Polygon/Ethereum) to execute the Zero-Knowledge proofs across decentralized banking networks.
2. **Graph Neural Networks (GNNs):** Upgrading from XGBoost to GNNs, which are natively designed to process and classify complex network topologies.
3. **LLM Chat Copilot:** Integrating a local Large Language Model (like Llama 3) so analysts can type natural language queries like, *"Show me all accounts linked to this device ID that made a deposit over $5k yesterday."*
