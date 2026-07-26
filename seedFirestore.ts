import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, doc, setDoc } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

async function seed() {
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(configPath)) {
      console.log("No firebase-applet-config.json found. Skipping firestore seeding.");
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    const db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, config.firestoreDatabaseId || "(default)");

    console.log("Connected to Firestore:", config.firestoreDatabaseId || "(default)");

    const syncedDataPath = path.join(process.cwd(), "syncedData.json");
    if (!fs.existsSync(syncedDataPath)) {
      console.log("No syncedData.json found.");
      return;
    }

    const syncedData = JSON.parse(fs.readFileSync(syncedDataPath, "utf-8"));
    
    // Seed draws
    if (syncedData.draws && Array.isArray(syncedData.draws)) {
      console.log(`Seeding ${syncedData.draws.length} draws...`);
      for (const d of syncedData.draws) {
        const docId = String(d.CONCURSO);
        await setDoc(doc(db, "draws", docId), {
          CONCURSO: Number(d.CONCURSO),
          FECHA: d.FECHA,
          R1: Number(d.R1),
          R2: Number(d.R2),
          R3: Number(d.R3),
          R4: Number(d.R4),
          R5: Number(d.R5),
          ordenSalida: d.ordenSalida || [d.R1, d.R2, d.R3, d.R4, d.R5]
        }, { merge: true });
      }
      console.log("Draws seeded successfully.");
    }

    // Seed weights
    if (syncedData.weights && typeof syncedData.weights === "object") {
      console.log("Seeding weights...");
      await setDoc(doc(db, "settings", "weights"), {
        weights: syncedData.weights
      }, { merge: true });
      console.log("Weights seeded successfully.");
    }

    // Seed suitcaseHistory
    if (syncedData.suitcaseHistory && Array.isArray(syncedData.suitcaseHistory)) {
      console.log(`Seeding ${syncedData.suitcaseHistory.length} suitcase entries...`);
      for (const s of syncedData.suitcaseHistory) {
        const docId = String(s.draw);
        await setDoc(doc(db, "suitcaseHistory", docId), {
          draw: Number(s.draw),
          date: s.date,
          weight_28: Number(s.weight_28),
          notes: s.notes || "",
          result: s.result
        }, { merge: true });
      }
      console.log("Suitcase history seeded successfully.");
    }

    console.log("Firestore seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error during Firestore seeding:", err);
    process.exit(1);
  }
}

seed();
