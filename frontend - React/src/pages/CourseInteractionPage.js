import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { Modal, Button } from "react-bootstrap";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const CourseInteractionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [client, setClient] = useState(null);
  const [countdown, setCountdown] = useState(10); // Durée de la course en secondes

  useEffect(() => {
    const saved = localStorage.getItem(`chat-${id}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        setIsCompleted(res.data.status === "TERMINEE");
      } catch (err) {
        console.error("Erreur chargement course :", err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const stomp = new Client({
      webSocketFactory: () => {
        console.log("Tentative de connexion WebSocket à http://backend:8080/ws");
        return new SockJS("http://backend:8080/ws");
      },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log(" Connecté au serveur STOMP");

        stomp.subscribe(`/topic/messages/${id}`, (msg) => {
          try {
            console.log("Message reçu :", msg.body);
            const newMsg = JSON.parse(msg.body);
            setMessages((prev) => {
              const updated = [...prev, newMsg];
              localStorage.setItem(`chat-${id}`, JSON.stringify(updated));
              return updated;
            });
          } catch (err) {
            console.error("Erreur de parsing du message STOMP :", err);
          }
        });

        console.log(` Abonné à /topic/messages/${id}`);
      },

      onWebSocketError: (error) => {
        console.error("Erreur WebSocket bas niveau :", error);
      },

      onStompError: (frame) => {
        console.error(" Erreur STOMP (niveau protocole) :", frame.headers['message']);
        console.error(" Détail :", frame.body);
      },

      onDisconnect: () => {
        console.warn("Déconnecté du serveur STOMP");
      },

      debug: (str) => {
        console.log("DEBUG STOMP :", str);
      }
    });


    stomp.activate();
    setClient(stomp);
    return () => stomp.deactivate();
  }, [id]);

  useEffect(() => {
    if (!isCompleted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000); //
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isCompleted) {
      setShowArrivalModal(true);
    }
  }, [countdown, isCompleted]);

  const sendMessage = () => {
    if (client && message.trim()) {
      const payload = {
        sender: "user",
        content: message,
        courseId: id,
      };
      client.publish({
        destination: `/app/chat/${id}`,
        body: JSON.stringify(payload),
      });
      setMessage("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-4" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <h4 className="text-primary mb-3">Course #{id}</h4>

        {!isCompleted && (
          <div className="alert alert-info text-center">
            Temps restant de la course : {countdown} secondes
          </div>
        )}

        {isCompleted && (
          <div className="alert alert-success">Course terminée. Merci d’avoir voyagé avec Autodrive !</div>
        )}

        <div className="card mb-4 shadow border-0 rounded-4">
          <div className="card-body">
            <h6 className="text-primary">Chat avec le chauffeur</h6>
            <div className="bg-light p-2 rounded mb-2" style={{ maxHeight: 200, overflowY: "auto" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-end" : "text-start"}`}>
                  <span className="badge bg-primary text-wrap">{msg.content}</span>
                </div>
              ))}
            </div>
            <div className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="Votre message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn btn-primary" onClick={sendMessage}>Envoyer</button>
            </div>
          </div>
        </div>

        <Modal show={showArrivalModal} onHide={() => {}} backdrop="static" keyboard={false} centered>
          <Modal.Header><Modal.Title>Fin du trajet</Modal.Title></Modal.Header>
          <Modal.Body>Le temps est écoulé. Êtes-vous bien arrivé ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => navigate(`/contact-driver/${id}`)}>Non</Button>
            <Button variant="primary" onClick={() => navigate(`/comment/${id}`)}>Oui</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CourseInteractionPage;
