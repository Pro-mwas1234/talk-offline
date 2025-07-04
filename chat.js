// LAN WebSocket Connection
const socket = new WebSocket(`ws://${window.location.hostname}:3000`);
const user = { name: prompt("Enter your name:") || "Anonymous" };

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const darkModeToggle = document.getElementById('darkModeToggle');

// Send message
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  socket.send(JSON.stringify({
    user: user.name,
    text: text,
    timestamp: Date.now()
  }));
  
  messageInput.value = '';
}

// Receive messages
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  displayMessage(message);
};

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${message.user === user.name ? 'sent' : 'received'}`;
  
  messageElement.innerHTML = `
    <div class="message-header">
      <span class="message-username">${message.user}</span>
    </div>
    <div class="message-text">${message.text}</div>
    <span class="timestamp">
      ${new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  `;
  
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
});
