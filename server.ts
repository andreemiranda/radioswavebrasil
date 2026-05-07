/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";

const RADIO_BROWSER_BASE = "https://de1.api.radio-browser.info/json";

async function startServer() {
  const app  = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/health", (_, res) => res.json({ 
    status: "ok",
    service: "Radio Wave Brasil API",
    version: "1.0.0"
  }));

  // Radio Browser API Endpoints
  
  // Search stations (Always filters for Brazil)
  app.get("/api/stations/search", async (req, res) => {
    try {
      const { name, tag, state, limit = 20, offset = 0 } = req.query;
      
      const params = new URLSearchParams();
      if (name) params.append("name", name as string);
      if (tag) params.append("tag", tag as string);
      if (state) params.append("state", state as string);
      
      params.append("country", "Brazil"); // Strict Brazil requirement
      params.append("limit", limit as string);
      params.append("offset", offset as string);
      params.append("order", "votes");
      params.append("reverse", "true");
      params.append("hidebroken", "true");

      // First, get the items for this page
      const response = await fetch(`${RADIO_BROWSER_BASE}/stations/search?${params}`, {
        headers: { 'User-Agent': 'RadioWaveBrasil/1.0' }
      });
      
      if (!response.ok) {
        throw new Error(`Radio Browser API responded with status ${response.status}`);
      }
      
      const stations = await response.json();

      // Second, get the total count for this search (to support pagination)
      // We use the same filters but without limit/offset to get the "potential" total
      // NOTE: Radio Browser doesn't have a direct "search count" endpoint that's faster than search,
      // but we can at least return the page and a "hasMore" flag OR we can attempt a count query if cheap.
      // For now, we'll return a big enough total or the actual length if it's less than limit.
      
      res.json({
        success: true,
        data: stations,
        // Since we don't have a cheap way to get the true total for complex searches without fetching all,
        // we'll return a high fixed number for "Brasil" search, or a best effort.
        total: stations.length === Number(limit) ? 2000 : stations.length + Number(offset)
      });
    } catch (error: any) {
      console.warn("⚠️ Search Error:", error.message);
      res.json({ 
        success: false, 
        data: [], 
        total: 0,
        error: "Erro ao buscar estações brasileiras."
      });
    }
  });

  // Brazil top stations (Ordered by votes)
  app.get("/api/stations/brazil", async (req, res) => {
    try {
      const { limit = 24, offset = 0 } = req.query;
      
      const response = await fetch(`${RADIO_BROWSER_BASE}/stations/bycountry/Brazil?limit=${limit}&offset=${offset}&order=votes&reverse=true&hidebroken=true`, {
        headers: { 'User-Agent': 'RadioWaveBrasil/1.0' }
      });
      
      if (!response.ok) {
        throw new Error(`Radio Browser API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      res.json({
        success: true,
        data: data,
        total: 3500 // Approximate number of active Brazilian stations in Radio Browser
      });
    } catch (error: any) {
      console.warn("⚠️ Brazil Stations Error:", error.message);
      res.json({ 
        success: false, 
        data: [], 
        total: 0,
        error: "Erro ao carregar rádios populares do Brasil."
      });
    }
  });

  // Alias for radioService compatibility
  app.get("/api/stations/bycountry/Brazil", async (req, res) => {
    const { limit, offset } = req.query;
    res.redirect(`/api/stations/brazil?limit=${limit || 24}&offset=${offset || 0}`);
  });

  // Tags (Popular tags)
  app.get("/api/tags", async (req, res) => {
    try {
      const { limit = 30 } = req.query;
      
      const response = await fetch(`${RADIO_BROWSER_BASE}/tags?limit=${limit}&order=stationcount&reverse=true&hidebroken=true`, {
        headers: { 'User-Agent': 'RadioWaveBrasil/1.0' }
      });
      
      if (!response.ok) {
        throw new Error(`Radio Browser API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      res.json({
        success: true,
        data: data,
        total: data.length
      });
    } catch (error: any) {
      console.warn("⚠️ Tags Error:", error.message);
      res.json({ 
        success: false, 
        data: [], 
        total: 0,
        error: "Erro ao carregar gêneros."
      });
    }
  });

  // Audio Proxy to bypass Mixed Content (HTTP on HTTPS)
  app.get("/api/proxy-audio", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).send("URL is required");
    }

    try {
      // Use axios for streaming as it's more reliable in Node for this purpose
      const axios = (await import("axios")).default;
      const https = await import("https");
      const http = await import("http");
      
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Icy-MetaData': '1'
        },
        maxRedirects: 10,
        // @ts-ignore - node-specific option to handle non-standard HTTP responses (like ICY)
        insecureHTTPParser: true,
        httpsAgent: new https.Agent({ 
          rejectUnauthorized: false,
          // @ts-ignore
          insecureHTTPParser: true
        }),
        // @ts-ignore - node-specific option to handle non-standard HTTP responses (like ICY)
        httpAgent: new http.Agent({ insecureHTTPParser: true })
      });

      // Forward headers and add CORS
      const contentType = response.headers['content-type'];
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');

      if (contentType) {
        res.setHeader('Content-Type', contentType);
      } else {
        // Default to audio/mpeg if missing, most radio streams are MP3
        res.setHeader('Content-Type', 'audio/mpeg');
      }

      // We should not forward content-length for live streams as it can be misleading or huge
      // response.data.pipe will handle the stream correctly
      
      // Pipe the stream
      response.data.pipe(res);

      // Handle stream errors
      response.data.on('error', (err: any) => {
        console.error('Proxy Stream Error:', err.message);
        res.end();
      });

    } catch (error: any) {
      console.error("Proxy Error:", error.message);
      if (error.response) {
        res.status(error.response.status).send(error.message);
      } else {
        res.status(500).send("Proxy Error: " + error.message);
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️ Starting Vite middleware...");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("✅ Vite middleware attached.");
    } catch (viteError) {
      console.error("❌ Failed to start Vite server:", viteError);
    }
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Radio Wave Brasil Backend running on http://localhost:${PORT}`);
  });
}

startServer();
