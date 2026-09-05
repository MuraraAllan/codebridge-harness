# Catalog of Ships (Iliad Book II) - 3D Archaeological & Historical Explorer

An interactive, 3D web application exploring the **Homeric Catalog of Ships** from Book II of the *Iliad* (lines 494–759), integrated with Late Bronze Age (Mycenaean) archaeological records, Linear B tablet evidence, and an automated agent validation harness.

---

## 📜 Overview & Features

1. **3D WebGL Mycenaean Galley Renderer**:
   - Procedural 3D model of Late Helladic III C galleys (*Pentekonters* and *Triakonters*).
   - Features vermilion/crimson painted prows (*miltoparyoi*), high curved stem and stern posts (*aphlaston*), oarsmen benches (*zygons*), dual steering oars (*pedalia*), and square sails with contingent crests.
   - Interactive orbit controls (rotate, zoom, pan) and real-time wave animation.

2. **Interactive Homeric Aegean Map**:
   - Complete mapping of all 29 Achaean contingents (1,186 total ships, ~100,000 troops).
   - Clickable geographical pins representing Boeotia, Mycenae, Sparta, Pylos, Athens, Crete, Rhodes, and the Ionian Islands.
   - Target indicator for Troy (Ilium) across the Aegean Sea.

3. **Archaeological Vault & Linear B Intelligence**:
   - Cross-references Homeric verses with historical Bronze Age evidence.
   - Ingests administrative records from **Pylos Linear B Tablets** (such as *An 610* listing coastal rowers *e-re-ta* and *Vn 865* for shipbuilding timber).
   - References wall paintings (e.g., *Akrotiri Flotilla Fresco*) and ceramic artifacts (e.g., *Kynos Naval Battle Sherd*).

4. **Automated Agent Accuracy Harness**:
   - Built-in multi-agent audit suite testing historical dataset completeness, Homeric meter fidelity, and archaeological alignment.

---

## 🛠️ ContextChanges & Commit Tracking

### Draft Commit Message
```
docs: add comprehensive README for 3D Homeric Catalog of Ships application

L1: Created full 3D Homeric Catalog of Ships interactive application inside professordemo/demo_3.6.
L2: Integrated WebGL/Three.js Mycenaean ship renderer, Aegean Homeric map with 29 contingents, archaeological vault (Linear B tablets & frescoes), and agent accuracy evaluation harness.
L3: Repository setup complete in professordemo/demo_3.6. User can install dependencies and run dev server.
```

### ContextChanges Breakdown
- **L1 (Changed files & visible behavior)**:
  - Created application files inside `professordemo/demo_3.6/` including `package.json`, `vite.config.js`, `tailwind.config.js`, `index.html`, and `src/`.
  - Added full 3D WebGL viewer component (`ShipViewer3D.jsx`), interactive Aegean map (`HomericMap.jsx`), archaeological evidence vault & agent tester (`ArcheologyAndAgent.jsx`), and dataset (`catalogData.js`).
- **L2 (Integration & validation impact)**:
  - Uses `@react-three/fiber` and `@react-three/drei` for real-time 3D rendering.
  - Tailwind CSS for responsive dark-mode UI styling.
  - Integrated agent accuracy evaluation harness verifying all 29 contingents against primary sources.
- **L3 (Scope, assumptions, & remaining actions)**:
  - Fully ready for local execution and presentation.

---

## 🚀 How to Run & Use

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation & Execution Steps

1. **Navigate to the project folder**:
   ```bash
   cd professordemo/demo_3.6
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch the development server**:
   ```bash
   npm run dev
   ```

4. **Explore the App**:
   - Open `http://localhost:5173` in your browser.
   - **Select a Contingent**: Use the left panel or click any marker on the Homeric Aegean Map.
   - **Inspect in 3D**: Click and drag on the 3D ship viewer to orbit around the Mycenaean galley.
   - **Archaeology & Linear B**: Switch tabs at the bottom to view Linear B tablet texts, frescoes, and artifacts for the active contingent.
   - **Agent Audit**: Click "Run Agent Accuracy Audit" in the Agent Validation Harness tab to test data integrity across all contingents.
