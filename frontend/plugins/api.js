// Create a WebSocket connection
const socket = new WebSocket('ws://localhost:3030/ws');

// Event listeners
socket.addEventListener('open', (event) => {
    console.log('Connected to the server');
    socket.send('Hello Server!'); // Sending data to the server
});

socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data); // Receiving data from the server
});

socket.addEventListener('close', (event) => {
    console.log('Connection closed', event);
});

socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
});