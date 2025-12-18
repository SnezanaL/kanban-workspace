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

// ✅ “Moćno”: latency + random error simulator
server.use((req, res, next) => {
  const delayMs = 400; // deluje realno
  const failRate = req.method !== 'GET' ? 0.15 : 0.05; // češće puca na write

  setTimeout(() => {
    if (Math.random() < failRate) {
      return res.status(500).json({ message: 'Random server error (simulated)' });
    }
    next();
  }, delayMs);
});

// (Auth sloj json-server-auth je privremeno isključen zbog konflikta
// sa path-to-regexp u verziji paketa; mock API radi bez toga.)

// ✅ “Moćno”: server-side paginacija + total count
server.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
});

server.use(router);

server.listen(3001, () => console.log('Mock API running at http://localhost:3001'));
