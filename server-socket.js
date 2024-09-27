// Server socket to simulate realtime data
const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Simulate real-time data updates
  setInterval(() => {
    const data = [
      { year: '2020', numInstalls: Math.floor(Math.random() * 100) },
      { year: '2021', numInstalls: Math.floor(Math.random() * 100) },
      { year: '2022', numInstalls: Math.floor(Math.random() * 100) },
      { year: '2023', numInstalls: Math.floor(Math.random() * 100) },
      { year: '2024', numInstalls: Math.floor(Math.random() * 100) }
    ];

    // Send data to the client
    ws.send(JSON.stringify(data));
  }, 5000);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
