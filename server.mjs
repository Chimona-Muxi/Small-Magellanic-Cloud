import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "public");
const port = Number(process.env.PORT || 5226);
const host = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function cleanPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  return normalize(decoded).replace(/^(\.\.[/\\])+/, "");
}

async function resolveFile(pathname) {
  const clean = cleanPath(pathname);
  let filePath = join(publicDir, clean);
  if (!filePath.startsWith(publicDir)) return null;

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) {
      filePath = join(filePath, "index.html");
    }
  } catch {
    if (!extname(filePath)) filePath = join(filePath, "index.html");
  }

  if (!filePath.startsWith(publicDir)) return null;
  return filePath;
}

function redirect(res, location) {
  res.writeHead(308, { Location: location });
  res.end();
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);

    if (url.pathname !== "/" && !extname(url.pathname) && !url.pathname.endsWith("/")) {
      return redirect(res, `${url.pathname}/${url.search}`);
    }

    const filePath = await resolveFile(url.pathname);
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const data = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mime[extname(filePath)] || "application/octet-stream",
      "Cache-Control": extname(filePath) === ".html" ? "no-store" : "public, max-age=300"
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log("Small Magellanic Cloud 已启动：");
  console.log(`本机访问：http://localhost:${port}`);
});
