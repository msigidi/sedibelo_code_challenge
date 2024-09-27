const WebSocket = require('ws');

// Replace this with the string you want to send
const originalString = "I'm so good";

// Create a WebSocket client and connect to the server
const ws = new WebSocket('wss://challenge.sedilink.co.za:3006');

ws.on('open', function open() {
    console.log('WebSocket connection established.');
    
    // Send the original string
    ws.send(originalString);
    console.log(`Sent: ${originalString}`);
});

ws.on('message', function incoming(data) {
    console.log(`Received: ${data}`);
    
    // Reverse the original string
    const reversedString = originalString.split('').reverse().join('');
    
    // Verify the returned string matches the reversed version
    if (data === reversedString) {
        console.log('The received string matches the expected reversed string.');
    } else {
        console.error('Mismatch: The received string does not match the expected reversed string.');
    }
    
    // Close the connection after receiving the message
    ws.close();
});

ws.on('error', function (error) {
    console.error(`WebSocket error: ${error.message}`);
});

ws.on('close', function () {
    console.log('WebSocket connection closed.');
});
