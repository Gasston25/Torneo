const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const DATA_PATH = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static('public')); // para servir index.html y admin.html

// Leer datos desde data.json
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH));
  } catch {
    return { jugadores: {}, equipos: {} };
  }
}

// Guardar datos en data.json
function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Endpoint para obtener datos
app.get('/api/datos', (req, res) => {
  const data = readData();
  res.json(data);
});

// Endpoint para actualizar datos
app.post('/api/datos', (req, res) => {
  const newData = req.body;
  saveData(newData);

  // Avisar a todos los clientes conectados por WS
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'update', data: newData }));
    }
  });

  res.json({ status: 'ok' });
});

// WebSocket conexión
wss.on('connection', ws => {
  console.log('Cliente WS conectado');

  // Opcional: mandar datos actuales al conectar
  const data = readData();
  ws.send(JSON.stringify({ type: 'update', data }));

  ws.on('message', message => {
    // Aquí podrías manejar mensajes WS si querés enviar cambios por WS
  });

  ws.on('close', () => {
    console.log('Cliente WS desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
