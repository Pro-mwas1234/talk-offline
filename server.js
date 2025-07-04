const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname)));

// WebSocket handling
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });
});

// Get LAN IP
function getLocalIP() {
  const interfaces = require('os').networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const { address, family, internal } of iface) {
      if (family === 'IPv4' && !internal) return address;
    }
  }
  return 'localhost';
}

// Start server
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
  Server running at:
  - Local:   http://localhost:${PORT}
  - Network: http://${getLocalIP()}:${PORT}
  `);
});
