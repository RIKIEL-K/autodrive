import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

const UserComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
    const { userId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/user/${userId}`);
        setComments(res.data);
      } catch (error) {
        console.error("Erreur récupération des commentaires :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Confirmer la suppression du commentaire ?");
    if (!confirmed) return;

    try {
      await api.delete(`/comments/${id}`);
      setComments(prev => prev.filter(comment => comment.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Impossible de supprimer le commentaire.");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}
      >
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4 px-4 py-3">
                <h5 className="mb-0">
                  <i className="fas fa-comments me-2"></i>Commentaires postés
                </h5>
              </div>

              <div className="card-body px-4 py-4">
                {loading ? (
                  <div className="text-center text-muted">Chargement...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-muted">Aucun commentaire trouvé.</div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border rounded p-3 mb-3 bg-white position-relative"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-primary mb-1">{comment.driverName}</h6>
                          <small className="text-muted d-block">
                            Destination : {comment.destination}
                          </small>
                          <small className="text-muted">Posté le : {new Date(comment.createdAt).toLocaleString()}</small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <FaTrash className="me-1" />
                          Supprimer
                        </button>
                      </div>
                      <hr />
                      <p className="mb-0">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComments;
