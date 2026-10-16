#!/usr/bin/env python3
"""Local static server with Cache-Control: no-store (so image/JS updates show on F5)."""
from __future__ import annotations

import functools
import http.server
import os
import sys


class NoCacheRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **getattr(http.server.SimpleHTTPRequestHandler, "extensions_map", {}),
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".css": "text/css",
        ".wasm": "application/wasm",
    }

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))


def main() -> int:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    bind = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)

    handler = functools.partial(NoCacheRequestHandler, directory=root)
    with http.server.ThreadingHTTPServer((bind, port), handler) as httpd:
        print(f"Serving {root}")
        print(f"http://{bind}:{port}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
