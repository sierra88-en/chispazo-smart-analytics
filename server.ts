import express from "express";
import { createServer as createViteServer } from "vite";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, collection, doc, getDoc, getDocs, setDoc, query, orderBy, limit } from "firebase/firestore";

dotenv.config();

// Inicializar Firebase (usando SDK de Cliente para evitar fallos de ADC/gRPC en contenedores Cloud Run)
let adminDb: any = null;
try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    console.log("[Firebase Client as Admin] Detectado config. ProjectId:", config.projectId, "DatabaseId:", config.firestoreDatabaseId);
    
    const app = getApps().length === 0 
      ? initializeApp(config) 
      : getApp();
        
    adminDb = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, config.firestoreDatabaseId || "(default)");
    
    console.log("[Firebase Client as Admin] Inicializado exitosamente usando Web API Key y Firestore DB:", config.firestoreDatabaseId || "(default)");
  } else {
    console.warn("[Firebase Client as Admin] Archivo de configuración firebase-applet-config.json no encontrado.");
  }
} catch (error: any) {
  console.error("[Firebase Client as Admin] Error crítico al inicializar Firebase Client:", error);
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
      const drawsQuery = query(collection(adminDb, "draws"), orderBy("CONCURSO", "desc"), limit(100));
      const drawsSnap = await getDocs(drawsQuery);
      const draws: any[] = [];
      drawsSnap.forEach((docSnap) => {
        draws.push(docSnap.data());
      });

      const weightsDoc = await getDoc(doc(adminDb, "settings", "weights"));
      const weights = weightsDoc.exists() ? (weightsDoc.data()?.weights || {}) : {};

      const suitcaseQuery = query(collection(adminDb, "suitcaseHistory"), orderBy("draw", "desc"), limit(100));
      const suitcaseSnap = await getDocs(suitcaseQuery);
      const suitcaseHistory: any[] = [];
      suitcaseSnap.forEach((docSnap) => {
        suitcaseHistory.push(docSnap.data());
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

// NORMALIZADOR ULTRA-ROBUSTO Y ADAPTATIVO PARA WEBHOOKS DE MAKE.COM
function normalizeDrawingPayload(raw: any): any {
  if (!raw || typeof raw !== "object") return raw;
  const result: any = {};

  // 1. EXTRAER CONCURSO / SORTEO (Tolera: sorteo, concurso, id, draw, idSorteo, etc.)
  const sorteoKeys = ["sorteo", "concurso", "id", "idSorteo", "numeroSorteo", "draw", "concursoId", "Concurso", "Sorteo", "Raffle", "raffle"];
  let foundSorteo: number | null = null;
  for (const k of sorteoKeys) {
    if (raw[k] !== undefined && raw[k] !== null) {
      const numericVal = Number(String(raw[k]).replace(/\D/g, ""));
      if (!isNaN(numericVal) && numericVal > 0) {
        foundSorteo = numericVal;
        break;
      }
    }
  }
  result.sorteo = foundSorteo;

  // 2. EXTRAER FECHA (Tolera: fecha, date, fechaSorteo, etc.)
  const fechaKeys = ["fecha", "date", "fechaSorteo", "fecha_sorteo", "drawDate", "concursoFecha", "Fecha", "Date"];
  let foundFecha = null;
  for (const k of fechaKeys) {
    if (raw[k] !== undefined && raw[k] !== null && String(raw[k]).trim() !== "") {
      foundFecha = String(raw[k]).trim();
      break;
    }
  }
  result.fecha = foundFecha || new Date().toLocaleDateString('es-MX');

  // 3. EXTRAER COMBINACIÓN (resultado/números)
  // Soporta arreglos directos [1,2,3,4,5], cadenas separadas por comas/guiones "1,2,3,4,5"
  // y campos individuales como r1, r2, r3, r4, r5 o b1, b2, b3, b4, b5
  const combKeys = ["combinacion", "combinación", "resultado", "winningNumbers", "numeros", "números", "numbers", "nums", "Combinacion", "Resultado", "Combination", "combination"];
  let rawComb: any = null;
  for (const k of combKeys) {
    if (raw[k] !== undefined && raw[k] !== null) {
      rawComb = raw[k];
      break;
    }
  }

  let finalComb: number[] = [];

  if (Array.isArray(rawComb)) {
    finalComb = rawComb.map(x => Number(String(x).trim())).filter(x => !isNaN(x) && x >= 1 && x <= 28);
  } else if (typeof rawComb === "string" && rawComb.trim() !== "") {
    finalComb = rawComb.split(/[\s,;\-\/]+/).map(x => Number(x.trim())).filter(x => !isNaN(x) && x >= 1 && x <= 28);
  }

  // Si no se encuentra en las palabras claves, intentar mapear de campos individuales (R1-R5, n1-n5, etc.)
  if (finalComb.length !== 5) {
    const posKeys = [
      ["r1", "r2", "r3", "r4", "r5"],
      ["R1", "R2", "R3", "R4", "R5"],
      ["bola1", "bola2", "bola3", "bola4", "bola5"],
      ["bola_1", "bola_2", "bola_3", "bola_4", "bola_5"],
      ["b1", "b2", "b3", "b4", "b5"],
      ["num1", "num2", "num3", "num4", "num5"],
      ["n1", "n2", "n3", "n4", "n5"]
    ];

    for (const group of posKeys) {
      const candidates = group.map(key => Number(raw[key])).filter(x => !isNaN(x) && x >= 1 && x <= 28);
      if (candidates.length === 5) {
        finalComb = candidates;
        break;
      }
    }
  }

  result.combinacion = finalComb.slice(0, 5);

  // 4. EXTRAER ORDEN DE SALIDA
  const ordenKeys = ["ordenSalida", "orden_salida", "orden", "sortOrder", "physicalOrder", "OrdenSalida"];
  let rawOrden: any = null;
  for (const k of ordenKeys) {
    if (raw[k] !== undefined && raw[k] !== null) {
      rawOrden = raw[k];
      break;
    }
  }

  let finalOrden: number[] = [];
  if (Array.isArray(rawOrden)) {
    finalOrden = rawOrden.map(x => Number(String(x).trim())).filter(x => !isNaN(x) && x >= 1 && x <= 28);
  } else if (typeof rawOrden === "string" && rawOrden.trim() !== "") {
    finalOrden = rawOrden.split(/[\s,;\-\/]+/).map(x => Number(x.trim())).filter(x => !isNaN(x) && x >= 1 && x <= 28);
  }

  if (finalOrden.length !== 5) {
    finalOrden = [...result.combinacion];
  }
  result.ordenSalida = finalOrden.slice(0, 5);

  // 5. EXTRAER TIPO DE MALETÍN
  const maletinKeys = ["tipoMaletin", "tipo_maletin", "maletin", "suitcaseType", "suitcase_type", "Briefcase type", "BriefcaseType", "briefcase_type", "briefcaseType"];
  let foundMaletin = null;
  for (const k of maletinKeys) {
    if (raw[k] !== undefined && raw[k] !== null && String(raw[k]).trim() !== "") {
      foundMaletin = String(raw[k]).trim();
      break;
    }
  }
  result.tipoMaletin = foundMaletin || "Flujo Libre";

  // 6. EXTRAER PESAJES (Bolas de 1 a 28)
  const pesajesKeys = ["pesajes", "weights", "suitcaseWeights", "pesos", "pesajesBolas", "Weighings", "weighings"];
  let rawPesajes: any = null;
  for (const k of pesajesKeys) {
    if (raw[k] !== undefined && raw[k] !== null && typeof raw[k] === "object") {
      rawPesajes = raw[k];
      break;
    }
  }

  const finalPesajes: Record<string, number> = {};

  if (rawPesajes) {
    for (const [key, val] of Object.entries(rawPesajes)) {
      const keyLower = key.toLowerCase().trim();
      if (keyLower === "she was 28" || keyLower === "she_was_28" || keyLower === "bola 28" || keyLower === "bola_28") {
        finalPesajes["28"] = Number(val);
        continue;
      }
      const numKey = Number(key.replace(/\D/g, ""));
      if (numKey >= 1 && numKey <= 28 && !isNaN(Number(val))) {
        finalPesajes[String(numKey)] = Number(val);
      }
    }
  }

  // Buscar pesajes en las llaves raíz del objeto plano (ej. "peso28": 4.41, "b28_p": 4.31)
  for (const [key, val] of Object.entries(raw)) {
    const keyLower = key.toLowerCase().trim();
    if (['sorteo', 'concurso', 'id', 'combinacion', 'resultado', 'juego'].some(x => keyLower.includes(x))) continue;

    if (keyLower === "she was 28" || keyLower === "she_was_28" || keyLower === "bola 28" || keyLower === "bola_28") {
      finalPesajes["28"] = Number(val);
      continue;
    }

    const match = key.match(/\d+/);
    if (match) {
      const numKey = Number(match[0]);
      if (numKey >= 1 && numKey <= 28 && !isNaN(Number(val))) {
        const numVal = Number(val);
        if (numVal > 3.0 && numVal < 6.0) {
          finalPesajes[String(numKey)] = numVal;
        }
      }
    }
  }

  result.pesajes = finalPesajes;

  // 7. EXTRAER JUEGO
  const juegoKeys = ["juego", "product", "tipoSorteo", "tipoJuego", "category", "game", "Juego"];
  let foundJuego = "";
  for (const k of juegoKeys) {
    if (raw[k] !== undefined && raw[k] !== null) {
      foundJuego = String(raw[k]).trim();
      break;
    }
  }
  result.juego = foundJuego;

  return result;
}

// Guardar historial diagnóstico para el puente Make.com
function logWebhookDiagnostic(status: "success" | "error" | "ignored", details: string, rawPayload: any, normalizedPayload: any) {
  try {
    const diagPath = path.join(process.cwd(), "webhook_diagnostics.json");
    const diagLog = {
      lastReceivedAt: new Date().toISOString(),
      status,
      details,
      rawPayload,
      normalizedPayload
    };
    fs.writeFileSync(diagPath, JSON.stringify(diagLog, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing webhook diagnostics:", error);
  }
}

async function handleSync(payload: any, res: any) {
  let chispazoPayload = normalizeDrawingPayload(payload);

  // Si corresponde a un lote/lista de eventos de tómbolas enviados por Make
  if (Array.isArray(payload)) {
    const found = payload.find((item: any) => {
      const normalizedItem = normalizeDrawingPayload(item);
      return normalizedItem.sorteo && normalizedItem.combinacion && normalizedItem.combinacion.length === 5;
    });
    if (found) {
      chispazoPayload = normalizeDrawingPayload(found);
    } else {
      const msg = "Ignorado: Ninguno de los elementos del lote pertenece a Chispazo o contiene un vector de 5 números válidos.";
      logWebhookDiagnostic("ignored", msg, payload, null);
      return res.status(200).json({
        success: true,
        message: msg
      });
    }
  }

  // Filtrado de otros sorteos como Melate o Tris de forma segura
  const juegoName = String(chispazoPayload.juego || "").toLowerCase();
  if (juegoName && (juegoName.includes("melate") || juegoName.includes("tris") || juegoName.includes("progol"))) {
    const msg = `Bloque ignorado de forma segura: El sorteo recibido (${juegoName}) no corresponde a la tómbola Chispazo.`;
    logWebhookDiagnostic("ignored", msg, payload, chispazoPayload);
    return res.status(200).json({
      success: true,
      message: msg
    });
  }

  // Validar campos requeridos
  const { sorteo, fecha, combinacion, ordenSalida, tipoMaletin, pesajes } = chispazoPayload;
  
  if (!sorteo || !combinacion || !Array.isArray(combinacion) || combinacion.length !== 5) {
    const errorMsg = "Estructura inválida: Falta número de 'sorteo' o 'combinacion' de 5 números entre 1 y 28.";
    logWebhookDiagnostic("error", errorMsg, payload, chispazoPayload);
    return res.status(400).json({ 
      success: false, 
      error: errorMsg,
      received: payload,
      normalizedAttempt: chispazoPayload
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
      await setDoc(doc(adminDb, "draws", String(sorteo)), {
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
      const weightsDocRef = doc(adminDb, "settings", "weights");
      const existingWeightsDoc = await getDoc(weightsDocRef);
      let currentWeightsMap = existingWeightsDoc.exists() ? (existingWeightsDoc.data()?.weights || {}) : {};
      
      if (pesajes && typeof pesajes === "object") {
        for (const [key, val] of Object.entries(pesajes)) {
          const numKey = Number(key.replace(/\D/g, ""));
          if (numKey >= 1 && numKey <= 28) {
            currentWeightsMap[String(numKey)] = Number(val);
          }
        }
      }
      await setDoc(weightsDocRef, {
        weights: currentWeightsMap,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 3. Guardar el historial de maletín
      await setDoc(doc(adminDb, "suitcaseHistory", String(sorteo)), {
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
  
  logWebhookDiagnostic(
    "success",
    `Sorteo #${sorteo} procesado exitosamente con combinación ordenada: ${sortedCombination.join(', ')}.`,
    payload,
    chispazoPayload
  );

  return res.json({
    success: true,
    message: "Sorteo sincronizado y calibración guardada exitosamente de forma antifrágil",
    drawResult,
    weightsUpdated: pesajes || {},
    suitcaseEntry
  });
}

app.get("/api/webhook-diagnostics", (req, res) => {
  const diagPath = path.join(process.cwd(), "webhook_diagnostics.json");
  if (fs.existsSync(diagPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(diagPath, "utf-8"));
      return res.json(data);
    } catch (e: any) {
      return res.json({ error: "Failed to read diagnostics: " + e.message });
    }
  }
  return res.json({ 
    status: "none", 
    message: "No se han recibido solicitudes en el webhook automático del búnker aún. Esperando transmisión de Make.com." 
  });
});

app.all(["/api/sync-automatic", "/api/sync-data", "/api/webhook"], async (req, res) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST or PUT." });
  }
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
