// ChatCoursePage.js
import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const ChatCoursePage = () => {
  const { state } = useLocation();
  const conducteur = state?.conducteur;
  const [messages, setMessages] = useState([
    { from: "conducteur", text: "Bonjour ! Je suis en route." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  const sendPredefined = (text) => {
    setMessages([...messages, { from: "user", text }]);
  };

  useEffect(() => {
    const welcomeTimeout = setTimeout(() => {
      setMessages((prev) => [...prev, { from: "conducteur", text: "J’arrive dans 5 minutes." }]);
    }, 3000);
    return () => clearTimeout(welcomeTimeout);
  }, []);

  return (
    <div>
      <Navbar />
    <div className="container-fluid" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
      <div className="row g-0">

        <div className="col-md-4 bg-white border-end px-4 py-5">
          <h5 className="text-primary">Conducteur</h5>
          <p><strong>Nom :</strong> {conducteur?.nom}</p>
          <p><strong>Véhicule :</strong> {conducteur?.voiture}</p>
          <p><strong>Téléphone :</strong> {conducteur?.tel}</p>
          <p><strong>Distance :</strong> {conducteur?.distance}</p>
          <p><strong>Temps :</strong> {conducteur?.temps}</p>
        </div>

        {/* Messagerie */}
        <div className="col-md-8 px-4 py-5 d-flex flex-column justify-content-between">
          <div>
            <h5 className="text-primary mb-4">Messagerie</h5>
            <div className="bg-white border rounded-4 p-3 mb-3" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.from === "user" ? "text-end" : "text-start"}`}>
                  <span className={`badge ${msg.from === "user" ? "bg-primary" : "bg-secondary"}`}>
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="d-flex mb-3">
              <input
                type="text"
                className="form-control me-2"
                value={input}
                placeholder="Écrivez un message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="btn btn-primary" onClick={sendMessage}>Envoyer</button>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => sendPredefined("Je suis à l’entrée.")}>Je suis à l’entrée</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => sendPredefined("Je vous attends ici.")}>Je vous attends ici</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => sendPredefined("Je suis presque arrivé.")}>Je suis presque arrivé</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatCoursePage;
