import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const args = process.argv.slice(2);

function readArg(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1 || index === args.length - 1) {
    return fallback;
  }

  return args[index + 1];
}

const port = Number.parseInt(readArg('--port', '43173'), 10);
const rootArg = readArg('--root', './src');
const workspaceRoot = process.cwd();
const rootDir = path.resolve(workspaceRoot, rootArg);
let keepAliveTimer = null;

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon']
]);

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relativePath = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\/+/, '');
  const absolutePath = path.resolve(rootDir, relativePath);

  if (!absolutePath.startsWith(rootDir)) {
    return null;
  }

  return absolutePath;
}

const server = http.createServer(async (req, res) => {
  const filePath = resolveRequestPath(req.url);

  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    let finalPath = filePath;
    const stat = await fs.promises.stat(finalPath);

    if (stat.isDirectory()) {
      finalPath = path.join(finalPath, 'index.html');
    }

    const ext = path.extname(finalPath).toLowerCase();
    const contentType = mimeTypes.get(ext) || 'application/octet-stream';
    const stream = fs.createReadStream(finalPath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store'
    });

    stream.pipe(res);
    stream.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
    });
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

function startKeepAliveProcess() {
  if (!keepAliveTimer) {
    keepAliveTimer = setInterval(() => {}, 60_000);
  }
}

function stopKeepAliveProcess() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

function waitForExistingServer(retries = 20, delayMs = 250) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    const probe = () => {
      const request = http.get(`http://127.0.0.1:${port}/`, (response) => {
        response.resume();

        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 500) {
          resolve();
          return;
        }

        if (attempt >= retries) {
          reject(new Error(`Existing server on port ${port} did not become ready`));
          return;
        }

        attempt += 1;
        setTimeout(probe, delayMs);
      });

      request.on('error', () => {
        if (attempt >= retries) {
          reject(new Error(`Existing server on port ${port} did not become reachable`));
          return;
        }

        attempt += 1;
        setTimeout(probe, delayMs);
      });
    };

    probe();
  });
}

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    waitForExistingServer()
      .then(() => {
        process.stdout.write(`Static server port ${port} already in use; reusing compatible server.\n`);
        startKeepAliveProcess();
      })
      .catch((waitError) => {
        process.stderr.write(`${waitError?.stack || waitError}\n`);
        process.exit(1);
      });
    return;
  }

  process.stderr.write(`${error?.stack || error}\n`);
  process.exit(1);
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Static server listening on http://127.0.0.1:${port}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopKeepAliveProcess();

    if (server.listening) {
      server.close(() => process.exit(0));
      return;
    }

    process.exit(0);
  });
}
