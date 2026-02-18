import jsonServer from 'json-server';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(__dirname + '/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Latency + random error simulator (makes the API feel realistic)
server.use((req, res, next) => {
  const delayMs = 400; // simulated network delay
  const failRate = req.method !== 'GET' ? 0.15 : 0.05; // higher failure rate for write operations

  setTimeout(() => {
    if (Math.random() < failRate) {
      return res.status(500).json({ message: 'Random server error (simulated)' });
    }
    next();
  }, delayMs);
});

// Note: json-server-auth is temporarily disabled due to a conflict with
// path-to-regexp in the current package version; the mock API works without it.

// Expose X-Total-Count header to support server-side pagination
server.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
});

server.use(router);

server.listen(3001, () => console.log('Mock API running at http://localhost:3001'));
