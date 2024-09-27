class WebSocketService {
    constructor() {
      this.ws = null;
    }
  
    connect(url) {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connection established');
      };
  
      this.ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
      };
  
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    send(message) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(message);
      }
    }
  
    close() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }
  
  export default new WebSocketService();
  