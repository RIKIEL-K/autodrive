import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const ContactDriverPage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    try {
      await api.post(`/chat/manual/${id}`, {
        sender: "user",
        content: message,
        courseId: id
      });
      setSent(true);
      setMessage("");
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Contacter votre chauffeur</h5>
              </div>
              <div className="card-body">
                {sent && (
                  <div className="alert alert-success">
                    Message envoyé au conducteur.
                  </div>
                )}
                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Décrivez votre situation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  disabled={!message.trim()}
                  onClick={handleSend}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDriverPage;
