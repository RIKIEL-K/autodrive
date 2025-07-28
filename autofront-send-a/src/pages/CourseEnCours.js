import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../utils/api";
import Loading from "../components/Loading";

const CourseEnCours = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const WS_URL = "http://backend:8080/ws";

  const [remainingTime, setRemainingTime] = useState(10);
  const [course, setCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [alert, setAlert] = useState(false);
  const [client, setClient] = useState(null);
  const [loadingAfterCompletion, setLoadingAfterCompletion] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`chat-${id}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const [courseRes, messagesRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/chat/${id}`)
      ]);
      setCourse(courseRes.data);
      setMessages(messagesRes.data);
    };
    fetchData();

    const stompClient = new Client({
      webSocketFactory: () => {
        console.log("Tentative de connexion WebSocket à", WS_URL);
        return new SockJS(WS_URL);
      },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connecté au serveur STOMP");

        stompClient.subscribe(`/topic/messages/${id}`, (message) => {
          try {
            console.log("Message reçu :", message.body);
            const msg = JSON.parse(message.body);
            setMessages((prev) => {
              const updated = [...prev, msg];
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
        console.error("Erreur STOMP (niveau protocole) :", frame.headers['message']);
        console.error(" Détail :", frame.body);
      },

      onDisconnect: () => {
        console.warn("Déconnecté du serveur STOMP");
      },

      debug: (str) => {
        console.log("DEBUG STOMP :", str);
      }
    });


    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAlert(true);
          api.put(`/courses/${id}/complete`)
            .then(() => {
              setTimeout(() => {
                setLoadingAfterCompletion(true);
                setTimeout(() => navigate(`/list-course-disponible/${id}`), 10000);
              }, 5000);
            })
            .catch(err => console.error("Erreur statut course :", err));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [id, navigate]);

  const sendMessage = (text = input) => {
    if (text.trim() && client?.connected) {
      const msg = { sender: "taxi", content: text, courseId: id };
      client.publish({ destination: `/app/chat/${id}`, body: JSON.stringify(msg) });
      setInput("");
    }
  };

  if (loadingAfterCompletion) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-4" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <h4 className="text-primary mb-3">Course #{id}</h4>

        {alert && (
          <div className="alert alert-success">
            Vous êtes arrivés à destination.<br />
            <span className="text-muted small">Redirection dans 5 secondes...</span>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body">
                <h6 className="text-primary">Temps restant : {Math.floor(remainingTime / 60)}m {remainingTime % 60}s</h6>
                <h6 className="text-primary">Distance : {course?.distanceKm?.toFixed(1)} km</h6>
                <h6 className="text-primary">Messagerie</h6>

                <div className="bg-light rounded p-3 mb-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`mb-2 ${msg.sender === "taxi" ? "text-end" : "text-start"}`}>
                      <span className="badge bg-primary text-wrap">{msg.content}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-2">
                  <input
                    className="form-control"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Votre message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button className="btn btn-primary" onClick={sendMessage}>Envoyer</button>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-outline-secondary" onClick={() => sendMessage("Je suis à proximité.")}>
                    Je suis à proximité
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => sendMessage("Je suis arrivé.")}>
                    Je suis arrivé
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-primary text-white">
                <h6><i className="fas fa-user me-2"></i>Chauffeur</h6>
              </div>
              <div className="card-body text-center">
                <h5 className="text-primary">{course?.chauffeurNom}</h5>
                <p><strong>Véhicule :</strong> {course?.vehicule}</p>
                <p><strong>Plaque :</strong> {course?.plaque}</p>
                <button className={`btn w-100 ${remainingTime === 0 ? "btn-danger" : "btn-success"}`} disabled>
                  Passager à bord
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEnCours;
