// components/TransactionsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import api from '../utils/api';
const UserTransactionsList = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    api.get(`/transactions/user/${userId}`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error("Erreur : ", err));
  }, [userId]);

  return (
    <div>
      <Navbar/>
      <div className="card shadow-sm border-0 rounded-4 mt-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Historique des transactions</h5>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Départ</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Tarif</th>
                <th>Prix</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t, index) => (
                  <tr key={index}>
                    <td>{t.depart}</td>
                    <td>{t.destination}</td>
                    <td>{t.distance} km</td>
                    <td>{t.tarif}</td>
                    <td>{t.prix.toFixed(2)} $</td>
                    <td>{new Date(t.date).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Aucune transaction</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTransactionsList;

