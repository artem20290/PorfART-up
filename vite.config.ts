import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsDir = path.resolve(__dirname, "projects");

function shouldCopyProjectPath(filePath: string) {
  const rel = path.relative(projectsDir, filePath);
  if (rel.startsWith("..")) return true;
  const parts = rel.split(path.sep);
  return !parts.includes("node_modules") && !parts.includes("dist");
}

/** Serve /projects/* in dev and copy them into dist on build. */
function projectDemosPlugin(): Plugin {
  return {
    name: "portfolio-project-demos",
    configureServer(server) {
      server.middlewares.use("/projects", (req, res, next) => {
        try {
          const rawUrl = req.url ?? "/";
          const rel = decodeURIComponent(rawUrl.split("?")[0] || "/");
          const filePath = path.resolve(projectsDir, "." + rel);
          if (!filePath.startsWith(projectsDir)) {
            res.statusCode = 403;
            res.end("Forbidden");
            return;
          }
          const target = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
            ? path.join(filePath, "index.html")
            : filePath;
          if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
            next();
            return;
          }
          res.setHeader("Cache-Control", "no-cache");
          const ext = path.extname(target).toLowerCase();
          const types: Record<string, string> = {
            ".html": "text/html; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".json": "application/json",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".ico": "image/x-icon",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".map": "application/json",
          };
          res.setHeader("Content-Type", types[ext] || "application/octet-stream");
          fs.createReadStream(target).pipe(res);
        } catch {
          next();
        }
      });
    },
    closeBundle() {
      const outDir = path.resolve(__dirname, "dist/projects");
      fs.mkdirSync(path.dirname(outDir), { recursive: true });
      fs.cpSync(projectsDir, outDir, {
        recursive: true,
        filter: shouldCopyProjectPath,
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), projectDemosPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
