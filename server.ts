import express from "express";
import { createServer as createViteServer } from "vite";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import admin from "firebase-admin";

dotenv.config();

// Inicializar Firebase Admin
let adminDb: any = null;
try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    if (config.projectId) {
      admin.initializeApp({
        projectId: config.projectId,
      });
      if (config.firestoreDatabaseId) {
        adminDb = admin.firestore(config.firestoreDatabaseId);
      } else {
        adminDb = admin.firestore();
      }
      console.log("Firebase Admin inicializado en Firestore DB:", config.firestoreDatabaseId || "(default)");
    }
  }
} catch (error) {
  console.error("Error al inicializar Firebase Admin:", error);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${APP_URL}/auth/google/callback`
);

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/synced-data", async (req, res) => {
  if (adminDb) {
    try {
      const drawsSnap = await adminDb.collection("draws").orderBy("CONCURSO", "desc").limit(100).get();
      const draws: any[] = [];
      drawsSnap.forEach((doc: any) => {
        draws.push(doc.data());
      });

      const weightsDoc = await adminDb.collection("settings").doc("weights").get();
      const weights = weightsDoc.exists ? (weightsDoc.data()?.weights || {}) : {};

      const suitcaseSnap = await adminDb.collection("suitcaseHistory").orderBy("draw", "desc").limit(100).get();
      const suitcaseHistory: any[] = [];
      suitcaseSnap.forEach((doc: any) => {
        suitcaseHistory.push(doc.data());
      });

      // Si tenemos datos en Firestore (al menos un campo no vacío), los retornamos
      if (draws.length > 0 || Object.keys(weights).length > 0 || suitcaseHistory.length > 0) {
        return res.json({ draws, weights, suitcaseHistory });
      }
    } catch (error) {
      console.error("Error al leer datos desde Firestore, usando respaldo local:", error);
    }
  }

  // Respaldo de carga local si Firestore aún está vacío o tiene fallas
  const filePath = path.join(process.cwd(), "syncedData.json");
  try {
    if (fs.existsSync(filePath)) {
      const dataStr = fs.readFileSync(filePath, "utf-8");
      return res.json(JSON.parse(dataStr));
    }
  } catch (error) {
    console.error("Error al leer syncedData.json como respaldo:", error);
  }
  return res.json({ draws: [], weights: {}, suitcaseHistory: [] });
});

// Extractor JSON robusto y tolerante a fallos
function extractAndParseJSON(rawBody: string): any {
  let cleaned = rawBody.trim();
  
  // Si está envuelto en bloque de código markdown de Gemini
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = cleaned.match(markdownRegex);
  if (match) {
    cleaned = match[1].trim();
  }
  
  // Extraer el primer objeto JSON válido
  const jsonObjectRegex = /(\{[\s\S]*\})/i;
  const jsonMatch = cleaned.match(jsonObjectRegex);
  if (jsonMatch) {
    cleaned = jsonMatch[1].trim();
  }
  
  return JSON.parse(cleaned);
}

async function handleSync(payload: any, res: any) {
  let chispazoPayload = payload;

  // Si corresponde a un lote/lista de eventos de tómbolas enviados por Make
  if (Array.isArray(payload)) {
    const found = payload.find((item: any) => {
      const gName = String(item.juego || item.product || item.tipoSorteo || "").toLowerCase();
      return gName.includes("chispazo") || 
            (Array.isArray(item.combinacion) && item.combinacion.length === 5 && item.combinacion.every((n: any) => Number(n) >= 1 && Number(n) <= 28));
    });
    if (found) {
      chispazoPayload = found;
    } else {
      return res.status(200).json({
        success: true,
        message: "Ignorado del webhook: Ninguno de los elementos del lote pertenece a Chispazo (evitando Tris/Melate)."
      });
    }
  }

  // Filtrado de otros sorteos como Melate o Tris de forma segura
  const juegoName = String(chispazoPayload.juego || chispazoPayload.product || chispazoPayload.tipoSorteo || chispazoPayload.tipoJuego || "").toLowerCase();
  if (juegoName && (juegoName.includes("melate") || juegoName.includes("tris") || juegoName.includes("progol") || (!juegoName.includes("chispazo")))) {
    return res.status(200).json({
      success: true,
      message: `Bloque ignorado de forma segura: El sorteo recibido (${juegoName}) no corresponde a la tómbola Chispazo.`
    });
  }

  // Validar campos requeridos
  const { sorteo, fecha, combinacion, ordenSalida, tipoMaletin, pesajes } = chispazoPayload;
  
  if (!sorteo || !combinacion || !Array.isArray(combinacion) || combinacion.length !== 5) {
    return res.status(400).json({ 
      success: false, 
      error: "Invalid payload: 'sorteo' and 'combinacion' (array of 5 numbers) are required",
      received: chispazoPayload
    });
  }
  
  const filePath = path.join(process.cwd(), "syncedData.json");
  let syncedData: any = { draws: [], weights: {}, suitcaseHistory: [] };
  
  try {
    if (fs.existsSync(filePath)) {
      const dataStr = fs.readFileSync(filePath, "utf-8");
      syncedData = JSON.parse(dataStr);
    }
  } catch (error) {
    console.error("Error reading synced file in handleSync:", error);
  }
  
  // Asegurar estructura
  if (!syncedData.draws) syncedData.draws = [];
  if (!syncedData.weights) syncedData.weights = {};
  if (!syncedData.suitcaseHistory) syncedData.suitcaseHistory = [];
  
  // 1. Mapear Combinación ordenada y Orden Física de Salida
  const sortedCombination = [...combinacion].map(Number).sort((a, b) => a - b);
  const physicalOrder = Array.isArray(ordenSalida) && ordenSalida.length === 5
    ? [...ordenSalida].map(Number)
    : [...combinacion].map(Number);

  const drawResult = {
    CONCURSO: Number(sorteo),
    FECHA: fecha || new Date().toLocaleDateString('es-MX'),
    R1: sortedCombination[0],
    R2: sortedCombination[1],
    R3: sortedCombination[2],
    R4: sortedCombination[3],
    R5: sortedCombination[4],
    ordenSalida: physicalOrder
  };
  
  // Añadir/Actualizar Draw sin duplicar por CONCURSO
  syncedData.draws = syncedData.draws.filter((d: any) => Number(d.CONCURSO) !== Number(sorteo));
  syncedData.draws.unshift(drawResult);
  
  // 2. Mapear Pesajes de bolas si existen
  if (pesajes && typeof pesajes === "object") {
    for (const [key, val] of Object.entries(pesajes)) {
      const numKey = Number(key.replace(/\D/g, ""));
      if (numKey >= 1 && numKey <= 28) {
        syncedData.weights[numKey] = Number(val);
      }
    }
  }
  
  // 3. Registrar Historial de Maletín
  const p28Weight = pesajes?.bola28 || pesajes?.["28"] || syncedData.weights[28] || 4.34;
  const suitcaseEntry = {
    draw: Number(sorteo),
    date: fecha || new Date().toLocaleDateString('es-MX'),
    weight_28: Number(p28Weight),
    notes: `Sincronizado vía Make: Maletín de ${tipoMaletin || "Flujo Libre"}`.slice(0, 100),
    result: sortedCombination
  };
  
  // Añadir/Actualizar maletín sin duplicados por draw
  syncedData.suitcaseHistory = syncedData.suitcaseHistory.filter((s: any) => Number(s.draw) !== Number(sorteo));
  syncedData.suitcaseHistory.unshift(suitcaseEntry);
  
  // Escribir a disco de forma síncrona para asegurar persistencia instantánea
  try {
    fs.writeFileSync(filePath, JSON.stringify(syncedData, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing syncedData.json:", error);
    return res.status(500).json({ success: false, error: "Failed to persist synced data" });
  }

  // Sincronizar en tiempo real con Firestore Database si está disponible
  if (adminDb) {
    try {
      // 1. Guardar sorteo en Firestore (id del documento es el número de sorteo)
      await adminDb.collection("draws").doc(String(sorteo)).set({
        CONCURSO: Number(sorteo),
        FECHA: fecha || new Date().toLocaleDateString('es-MX'),
        R1: sortedCombination[0],
        R2: sortedCombination[1],
        R3: sortedCombination[2],
        R4: sortedCombination[3],
        R5: sortedCombination[4],
        ordenSalida: physicalOrder
      }, { merge: true });

      // 2. Guardar pesajes dinámicos de bolas en settings/weights
      const weightsDocRef = adminDb.collection("settings").doc("weights");
      const existingWeightsDoc = await weightsDocRef.get();
      let currentWeightsMap = existingWeightsDoc.exists ? (existingWeightsDoc.data()?.weights || {}) : {};
      
      if (pesajes && typeof pesajes === "object") {
        for (const [key, val] of Object.entries(pesajes)) {
          const numKey = Number(key.replace(/\D/g, ""));
          if (numKey >= 1 && numKey <= 28) {
            currentWeightsMap[String(numKey)] = Number(val);
          }
        }
      }
      await weightsDocRef.set({
        weights: currentWeightsMap,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 3. Guardar el historial de maletín
      await adminDb.collection("suitcaseHistory").doc(String(sorteo)).set({
        draw: Number(sorteo),
        date: fecha || new Date().toLocaleDateString('es-MX'),
        weight_28: Number(p28Weight),
        notes: `Sincronizado vía Make: Maletín de ${tipoMaletin || "Flujo Libre"}`.slice(0, 100),
        result: sortedCombination
      }, { merge: true });

      console.log(`[Firebase] Sincronización en tiempo real completada para concurso: ${sorteo}`);
    } catch (firestoreErr) {
      console.error("[Firebase] Error al sincronizar con Firestore:", firestoreErr);
    }
  }
  
  return res.json({
    success: true,
    message: "Sorteo sincronizado y calibración guardada exitosamente de forma antifrágil",
    drawResult,
    weightsUpdated: pesajes || {},
    suitcaseEntry
  });
}

app.post("/api/sync-automatic", async (req, res) => {
  try {
    let rawData = "";
    
    // Verificar si Express ya lo parseó como objeto JSON
    if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
      return handleSync(req.body, res);
    }
    
    // Si viene como string
    if (typeof req.body === "string" && req.body.trim()) {
      rawData = req.body;
    } else {
      // Leer el stream crudo directo del request pasándolo a buffer (para text/plain de Make unparsed)
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk as Buffer);
      }
      rawData = Buffer.concat(chunks).toString("utf-8");
    }
    
    if (!rawData || !rawData.trim()) {
      return res.status(400).json({ success: false, error: "Empty request body" });
    }
    
    const parsed = extractAndParseJSON(rawData);
    return handleSync(parsed, res);
  } catch (error: any) {
    console.error("Error in sync-automatic endpoint:", error);
    return res.status(400).json({ 
      success: false, 
      error: "Failed to parse data payload: " + error.message,
      rawPreview: req.body ? JSON.stringify(req.body) : "No body parsed"
    });
  }
});

app.get("/api/auth/google/url", (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: "Google OAuth credentials not configured" });
  }

  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);

    // In a real app, you would store tokens in a secure cookie or database
    // For this demo, we'll just send a success message back to the opener
    
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'google' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  // Production static serving
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*all", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
