import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'
import axios from 'axios';

const ChatIA = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: 'Vous', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/ai/chat/ask', {
        question: trimmed,
        chat_context: [...messages, userMessage].map(m => `${m.sender}: ${m.text}`),
        doc_context: "Politique de réservation, trajets, chauffeurs disponibles, annulation, etc."
      });

      const aiMessage = { sender: 'Autodrive', text: res.data.answer };
      setMessages(prev => [...prev, aiMessage]);
      localStorage.setItem('lastMessageFromIA', `${Date.now()}`);
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'Autobot',
        text: "Erreur lors de la réponse de l'IA. Veuillez réessayer."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Chat avec autobot, notre assistant IA</h4>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>

      <div className="border rounded p-3 mb-4 bg-light" style={{ height: '60vh', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-${msg.sender === 'Vous' ? 'end' : 'start'}`}
          >
            <span
              className={`badge px-3 py-2 text-start text-wrap bg-${msg.sender === 'Vous' ? 'primary' : 'secondary'}`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-start mb-2">
            <span className="badge bg-secondary">Autobot : Réflexion en cours...</span>
          </div>
        )}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Pose ta question à propos de ta réservation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatIA;
