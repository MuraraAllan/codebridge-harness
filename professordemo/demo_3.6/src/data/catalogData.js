export const HOMERIC_CATALOG = {
  summary: {
    totalShips: 1186,
    totalContingents: 29,
    estimatedTroops: 100000,
    historicalPeriod: "Late Helladic III C / Mycenaean Era (c. 1250 BCE)",
    primarySources: ["Homer, Iliad Book 2.494-759", "Pylos Linear B Tablets (An 610, Vn 865)"]
  },
  contingents: [
    {
      id: "boeotia",
      name: "Boeotians",
      ships: 50,
      menPerShip: 120,
      totalMen: 6000,
      leaders: ["Leitus", "Peneleos", "Arcesilaus", "Prothoenor", "Clonius"],
      keyCities: ["Aulis", "Thebes", "Orchomenus", "Hyria", "Schoenus", "Scolus", "Graea"],
      coordinates: { mapX: 52, mapY: 54 },
      shipType: "Pentekonter (Crimson-Prowed Black Galley)",
      color: "#e11d48",
      archeology: {
        linearBText: "Pylos Tablet An 610 listing rowers (e-re-ta) assigned to coastal defense craft.",
        frescoRef: "Akrotiri Flotilla Fresco (Thera) showing 50-oared longships with central cabin and stern castle.",
        artifacts: ["Mycenaean Stirrup Jar depicting oarsmen (Tragana)", "Bronze spearheads from Orchomenus"]
      },
      quote: "The men who lived in Hyria and rocky Aulis, and Schoenus, and Scolus, and the slopes of Eteonus... fifty ships of theirs went, and in each were one hundred and twenty young men of the Boeotians."
    },
    {
      id: "minyans",
      name: "Minyans of Aspledon & Orchomenus",
      ships: 30,
      menPerShip: 50,
      totalMen: 1500,
      leaders: ["Ascalaphus", "Ialmenus"],
      keyCities: ["Aspledon", "Orchomenus"],
      coordinates: { mapX: 50, mapY: 51 },
      shipType: "Triakonter (30-oared Swift Galley)",
      color: "#d97706",
      archeology: {
        linearBText: "Linear B tablet records of bronze allocations for shipfitting at Orchomenus.",
        frescoRef: "Enkomi Mycenaean krater depicting twin-prowed war galley.",
        artifacts: ["Bronze Age tholos tomb grave goods at Orchomenus Treasury of Minyas"]
      },
      quote: "And those who lived in Aspledon and Orchomenus of the Minyans were led by Ascalaphus and Ialmenus, sons of Ares..."
    },
    {
      id: "phocis",
      name: "Phocians",
      ships: 40,
      menPerShip: 50,
      totalMen: 2000,
      leaders: ["Schedius", "Epistrophus"],
      keyCities: ["Cyparissus", "Pytho (Delphi)", "Daulis", "Hyampolis"],
      coordinates: { mapX: 45, mapY: 52 },
      shipType: "Triakonter",
      color: "#0284c7",
      archeology: {
        linearBText: "References to timber harvesting (do-ro-me-u) in Phocian highlands.",
        frescoRef: "Pylos hall fresco depicting naval procession.",
        artifacts: ["Delphi Mycenaean female figurines (Phi & Psi types)"]
      },
      quote: "Shedius and Epistrophus led the Phocians, who held Cyparissus and rocky Pytho..."
    },
    {
      id: "locris",
      name: "Locrians",
      ships: 40,
      menPerShip: 50,
      totalMen: 2000,
      leaders: ["Ajax son of Oileus (Lesser Ajax)"],
      keyCities: ["Cynus", "Opus", "Calliarus", "Bessa"],
      coordinates: { mapX: 48, mapY: 48 },
      shipType: "Triakonter",
      color: "#16a34a",
      archeology: {
        linearBText: "Coastal lookout reports from Opuntian Locris.",
        frescoRef: "Kynos sea-battle sherds depicting warriors on ship deck.",
        artifacts: ["Late Helladic III C ship sherd from Kynos showing oarsmen and defensive shields"]
      },
      quote: "The Locrians were led by the swift Ajax, son of Oileus... who commanded forty black ships."
    },
    {
      id: "euboea",
      name: "Abantes of Euboea",
      ships: 40,
      menPerShip: 50,
      totalMen: 2000,
      leaders: ["Elephenor"],
      keyCities: ["Chalcis", "Eretria", "Histiaea", "Carystus"],
      coordinates: { mapX: 58, mapY: 53 },
      shipType: "Pentekonter",
      color: "#9333ea",
      archeology: {
        linearBText: "Euboean iron & copper smithing records.",
        frescoRef: "Lefkandi Toumba ship depictions.",
        artifacts: ["Bronze swords and naval shields from Lefkandi"]
      },
      quote: "The fierce Abantes of Euboea, who held Chalcis and Eretria and vine-clad Histiaea..."
    },
    {
      id: "athens",
      name: "Athenians",
      ships: 50,
      menPerShip: 50,
      totalMen: 2500,
      leaders: ["Menestheus"],
      keyCities: ["Athens", "Thorikos", "Sunium"],
      coordinates: { mapX: 56, mapY: 60 },
      shipType: "Pentekonter",
      color: "#2563eb",
      archeology: {
        linearBText: "Acropolis Mycenaean fortification records and water-supply stairwell.",
        frescoRef: "Acropolis Mycenaean procession fragments.",
        artifacts: ["Mycenaean chamber tombs near the Agora"]
      },
      quote: "Those who held the strong fortress of Athens, the domain of great-hearted Erechtheus..."
    },
    {
      id: "salamis",
      name: "Salamis",
      ships: 12,
      menPerShip: 50,
      totalMen: 600,
      leaders: ["Great Ajax (Telamonian Ajax)"],
      keyCities: ["Salamis Island"],
      coordinates: { mapX: 54, mapY: 61 },
      shipType: "Pentekonter",
      color: "#0d9488",
      archeology: {
        linearBText: "Island fortress lookout administrative records.",
        frescoRef: "Kanakia Mycenaean palace complex frescoes.",
        artifacts: ["Mycenaean palace at Kanakia (Salamis), sealstones with ship motifs"]
      },
      quote: "And Ajax brought twelve ships from Salamis, and stationed them where the Athenian phalanxes stood."
    },
    {
      id: "argos",
      name: "Argives, Tiryns & Epidaurus",
      ships: 80,
      menPerShip: 60,
      totalMen: 4800,
      leaders: ["Diomedes", "Sthenelus", "Euryalus"],
      keyCities: ["Argos", "Tiryns", "Epidaurus", "Asine", "Troezen"],
      coordinates: { mapX: 49, mapY: 65 },
      shipType: "Heavy Pentekonter",
      color: "#ea580c",
      archeology: {
        linearBText: "Tiryns Linear B tablets registering chariots and coastal naval storehouses.",
        frescoRef: "Tiryns Boar Hunt Fresco & Ship Processions.",
        artifacts: ["Tiryns Cyclopean dam and ship depot excavations"]
      },
      quote: "Those who held Argos and strong-walled Tiryns, Asine and Hermione..."
    },
    {
      id: "mycenae",
      name: "Mycenae & High Command",
      ships: 100,
      menPerShip: 60,
      totalMen: 6000,
      leaders: ["King Agamemnon (Overlord of the Achaeans)"],
      keyCities: ["Mycenae", "Corinth", "Cleonae", "Sicyon"],
      coordinates: { mapX: 47, mapY: 62 },
      shipType: "Royal Flagship & Pentekonter Fleet",
      color: "#dc2626",
      archeology: {
        linearBText: "Mycenae House of the Oil Merchant tablets detailing royal supplies and bronze armor (*to-ra-ke*).",
        frescoRef: "Lion Gate relief and Mycenae Warrior Vase.",
        artifacts: ["Gold Mask of 'Agamemnon', Mycenaean bronze armor (Dendra Panoply)"]
      },
      quote: "Those who held the great stronghold of Mycenae and wealthy Corinth... Lord Agamemnon led one hundred ships, by far the greatest fleet."
    },
    {
      id: "lacedaemon",
      name: "Lacedaemon (Sparta)",
      ships: 60,
      menPerShip: 50,
      totalMen: 3000,
      leaders: ["King Menelaus"],
      keyCities: ["Sparta", "Massa", "Amyclae", "Helos"],
      coordinates: { mapX: 44, mapY: 73 },
      shipType: "Pentekonter",
      color: "#b91c1c",
      archeology: {
        linearBText: "Ayios Vasileios (Laconia) Linear B archives recording royal tributes.",
        frescoRef: "Menelaion Mycenaean shrine frescoes.",
        artifacts: ["Bronze swords and Menelaion votive figures"]
      },
      quote: "Those who held the deep valley of Lacedaemon, Pharis and Sparta... Menelaus of the loud war-cry led sixty ships."
    },
    {
      id: "pylos",
      name: "Pylos (Realm of Nestor)",
      ships: 90,
      menPerShip: 50,
      totalMen: 4500,
      leaders: ["King Nestor"],
      keyCities: ["Pylos", "Arene", "Thryon", "Cyparissieeis"],
      coordinates: { mapX: 36, mapY: 72 },
      shipType: "Pentekonter",
      color: "#7c3aed",
      archeology: {
        linearBText: "Pylos Palace of Nestor Tablets: An 610 (600+ rowers listed by district), Vn 865 (shipbuilding timber).",
        frescoRef: "Pylos Lyre Player & Naval Battle Fresco.",
        artifacts: ["Griffin Warrior Tomb gold seals showing warrior in combat and Mycenaean galleys"]
      },
      quote: "And those who lived in Pylos and charming Arene... aged Nestor led ninety hollow ships."
    },
    {
      id: "pylos_islands",
      name: "Cefallenians & Ithaca",
      ships: 12,
      menPerShip: 50,
      totalMen: 600,
      leaders: ["Odysseus"],
      keyCities: ["Ithaca", "Zacynthus", "Cephallenia", "Neritum"],
      coordinates: { mapX: 28, mapY: 55 },
      shipType: "Red-Prowed Pentekonter",
      color: "#059669",
      archeology: {
        linearBText: "Ionian coast trading dispatch records.",
        frescoRef: "Odyssean voyage artistic traditions.",
        artifacts: ["School of Homer palace site at Ithaca, Bronze Age anchor stones"]
      },
      quote: "Odysseus led the brave Cefallenians, who held Ithaca and Neritum with its waving forests... twelve ships with vermilion-painted prows."
    },
    {
      id: "crete",
      name: "Cretans",
      ships: 80,
      menPerShip: 60,
      totalMen: 4800,
      leaders: ["King Idomeneus", "Meriones"],
      keyCities: ["Knossos", "Gortyn", "Lyctus", "Phaistos"],
      coordinates: { mapX: 72, mapY: 88 },
      shipType: "Minoan-Mycenaean Hybrid Pentekonter",
      color: "#4f46e5",
      archeology: {
        linearBText: "Knossos Linear B Tablets (Chariot and Naval inventory tablets).",
        frescoRef: "Knossos Marine Style frescoes & Ship seals.",
        artifacts: ["Bronze Age double axes (labrys), Minoan-Mycenaean keeled galley models"]
      },
      quote: "The Cretans were led by spear-famed Idomeneus... from Knossos, Gortyn, and white Phaistos, eighty ships."
    },
    {
      id: "rhodes",
      name: "Rhodians",
      ships: 9,
      menPerShip: 60,
      totalMen: 540,
      leaders: ["Tlepolemus"],
      keyCities: ["Lindos", "Ialysus", "Cameirus"],
      coordinates: { mapX: 88, mapY: 82 },
      shipType: "Pentekonter",
      color: "#15803d",
      archeology: {
        linearBText: "Dodecanese Mycenaean maritime exchange records.",
        frescoRef: "Ialysos chamber tomb ship paintings.",
        artifacts: ["Mycenaean pottery from Ialysos and Lindos"]
      },
      quote: "Tlepolemus, son of Heracles, led nine proud ships of the Rhodians from Lindos, Ialysus, and Cameirus."
    }
  ],
  archeologicalArtifacts: [
    {
      title: "Pylos Tablet An 610",
      type: "Linear B Clay Tablet",
      date: "c. 1200 BCE",
      museum: "National Archaeological Museum, Athens",
      description: "Lists over 600 rowers (e-re-ta) mobilized from coastal towns like Ro-u-so and A-ke-re-wa to man Mycenaean patrol ships during an emergency military threat.",
      relevance: "Direct administrative proof that Late Bronze Age Greek states organized standing naval contingents exact to Homeric ship crew allocations."
    },
    {
      title: "Akrotiri Flotilla Fresco",
      type: "Wall Painting",
      date: "c. 1600 BCE",
      museum: "Prehistoric Thera Museum, Santorini",
      description: "Miniature wall painting depicting a grand procession of long, narrow galleys with central cabins, oarsmen, steering oars, and decorative bow sprits.",
      relevance: "Visual blueprint for Aegean ship hull geometry, rigging, stem posts, and oarsman arrangements."
    },
    {
      title: "Kynos Naval Battle Sherd",
      type: "Ceramic Fragment",
      date: "Late Helladic III C (c. 1150 BCE)",
      museum: "Atalanti Archaeological Museum",
      description: "Fragment of a crater found at Kynos in Locris showing warriors fighting on a ship deck equipped with raised railing and curved stern post.",
      relevance: "Confirms Homer's description of Locrian ships and warrior-rowers fighting from raised naval decks."
    }
  ]
};
