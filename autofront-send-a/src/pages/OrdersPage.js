import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/courses/driver/${id}/all`);
        setOrders(res.data);
      } catch (err) {
        console.error("Erreur de chargement des commandes :", err);
      }
    };

    fetchOrders();
  }, [id]);

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-header bg-primary text-white px-4 py-3">
            <h5 className="mb-0">Historique des commandes</h5>
          </div>

          <div className="card-body px-4 py-4">
            {orders.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Chargement des commandes...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Temps</th>
                        <th>Distance</th>
                        <th>Prix</th>
                        <th>Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order, index) => (
                        <tr key={order._id || index}>
                          <td>{order._id}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>{order.duration || "N/A"}</td>
                          <td>{order.distanceKm?.toFixed(1)} km</td>
                          <td>{order.prix?.toFixed(2)} $</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/order/${id}`)}
                            >
                              Voir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <nav className="d-flex justify-content-center mt-4">
                  <ul className="pagination pagination-sm mb-0">
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
