import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";

const FinanceLayout = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      number: "**** **** **** 7852",
      expiration: "11/24",
      cvv: "123",
      holder: "Jack Peterson",
    },
    {
      id: 2,
      number: "**** **** **** 5248",
      expiration: "08/26",
      cvv: "456",
      holder: "Jane Smith",
    },
  ]);

  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || null);
  const selectedCard = cards.find((card) => card.id === selectedCardId);

  const handleDeleteCard = (id) => {
    const updatedCards = cards.filter((card) => card.id !== id);
    setCards(updatedCards);

    // Si la carte supprimée était sélectionnée, sélectionner la première restante
    if (selectedCardId === id && updatedCards.length > 0) {
      setSelectedCardId(updatedCards[0].id);
    } else if (updatedCards.length === 0) {
      setSelectedCardId(null);
    }
  };

  const invoices = [
    { date: "March, 01, 2020", id: "#MS-415646", amount: "$180" },
    { date: "February, 10, 2021", id: "#RV-126749", amount: "$250" },
    { date: "April, 05, 2020", id: "#FB-212562", amount: "$560" },
  ];

  return (
    <div>
      <Navbar/>
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f4f9ff" }}
    >
      <div className="row">
       
        <div className="col-lg-8">
          <div className="row g-4">
           
            <div className="col-xl-6">
              {selectedCard ? (
                <div className="card border-0 shadow-lg bg-primary text-white rounded-4">
                  <div className="p-4">
                    <i className="fas fa-wifi mb-3"></i>
                    <h5 className="mb-4">{selectedCard.number}</h5>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-sm mb-1">Card Holder</p>
                        <h6>{selectedCard.holder}</h6>
                      </div>
                      <div>
                        <p className="text-sm mb-1">Expires</p>
                        <h6>{selectedCard.expiration}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info">No card selected</div>
              )}
            </div>

            
            <div className="col-xl-6">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card shadow-sm border-0 text-center rounded-4">
                    <div className="card-header bg-primary text-white rounded-top-4 py-3">
                      <i className="fas fa-landmark fa-2x"></i>
                    </div>
                    <div className="card-body">
                      <h6>Salary</h6>
                      <span className="text-muted small">
                        Belong Interactive
                      </span>
                      <hr />
                      <h5 className="text-success">+$2000</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="col-12">
              <div className="card shadow-sm rounded-4">
                <div className="card-header d-flex justify-content-between align-items-center bg-light rounded-top-4 px-4 py-3">
                  <h6 className="mb-0 text-primary">Payment Method</h6>
                  <a href="./addCard" className="btn btn-primary btn-sm"><i className="fas fa-plus me-2"></i>Add New Card</a>
                </div>
                <div className="card-body px-4">
                  <div className="row g-3">
                    {cards.map((card) => (
                      <div className="col-md-6" key={card.id}>
                        <div
                          className={`border rounded p-3 shadow-sm ${
                            selectedCardId === card.id
                              ? "border-primary"
                              : "bg-white"
                          }`}
                        >
                          <div className="form-check d-flex justify-content-between align-items-center">
                            <input
                              className="form-check-input me-2"
                              type="radio"
                              name="selectedCard"
                              checked={selectedCardId === card.id}
                              onChange={() => setSelectedCardId(card.id)}
                            />
                            <h6 className="mb-0">{card.number}</h6>
                            <div className="d-flex gap-2">
                              <i className="fas fa-pencil-alt text-primary cursor-pointer"></i>
                              <i
                                className="fas fa-trash-alt text-danger cursor-pointer"
                                title="Delete Card"
                                onClick={() => handleDeleteCard(card.id)}
                              ></i>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-2">
                            <div>
                              <small className="text-muted d-block">
                                Expiration
                              </small>
                              <span className="fw-bold">{card.expiration}</span>
                            </div>
                            <div>
                              <small className="text-muted d-block">CVV</small>
                              <span className="fw-bold">{card.cvv}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {cards.length === 0 && (
                      <div className="text-center text-muted py-3">
                        No cards available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm rounded-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center px-4 py-3">
              <h6 className="mb-0 text-primary">Invoices</h6>
              <button className="btn btn-outline-primary btn-sm">
                View All
              </button>
            </div>
            <div className="card-body px-4 pt-3 pb-0">
              <ul className="list-group list-group-flush">
                {invoices.map((invoice, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-center px-0 py-2"
                  >
                    <div>
                      <h6 className="mb-1 text-dark">{invoice.date}</h6>
                      <small className="text-muted">{invoice.id}</small>
                    </div>
                    <div className="text-end">
                      <span className="d-block fw-bold">{invoice.amount}</span>
                      <button className="btn btn-link text-primary text-sm px-0 mt-1">
                        <i className="fas fa-file-pdf me-1"></i> PDF
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FinanceLayout;
