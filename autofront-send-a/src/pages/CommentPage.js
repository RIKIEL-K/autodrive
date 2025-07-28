import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const CommentPage = () => {
  const { id } = useParams(); // ✅ id = courseId
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !comment.trim()) return;

    try {
      const payload = {
        courseId: id,
        text: comment,
        date: new Date().toISOString()
      };

      await api.post(`/comments/create`, payload);
      setSent(true);
      setComment("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du commentaire :", err);
      setError("Une erreur s’est produite.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4 py-3 px-4">
                <h5 className="mb-0">Laisser un commentaire</h5>
              </div>

              <div className="card-body px-4 py-4">
                {error && <div className="alert alert-danger">{error}</div>}

                {sent ? (
                  <div className="alert alert-success" role="alert">
                    Merci pour votre commentaire ! À bientôt sur Autodrive.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="commentaire" className="form-label">Votre message</label>
                      <textarea
                        className="form-control"
                        id="commentaire"
                        rows="5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success"
                      style={{ width: "100%" }}
                      disabled={!comment.trim()}
                    >
                      Envoyer
                    </button>
                  </form>
                )}
              </div>
            </div>

            {sent && (
              <div className="text-center mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/user-dashboard`)}
                >
                  Retour à l'accueil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPage;
