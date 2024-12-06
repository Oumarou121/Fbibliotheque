import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { getClients, getLivres, getAllMessages, getClientData } from "../Api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [books, setBooks] = useState([]);
  // const [loans, setLoans] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  const navigation1 = () => {
    navigate("/admin/customers");
  };

  const navigation2 = () => {
    navigate("/admin/products");
  };

  // const navigation3 = () => {
  //   navigate("/admin/loans");
  // };

  const navigation4 = () => {
    navigate("/admin/messages");
  };

  const truncateByLetters = (message, charLimit = 20) => {
    if (message.length > charLimit) {
      return message.slice(0, charLimit) + " ...";
    }
    return message;
  };

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await getClientData();
          setRole(user?.role);

          const allCustomers = await getClients();
          const lastCustomers = allCustomers.slice(-3); // Récupère les 3 derniers
          setCustomers(lastCustomers);

          const allBooks = await getLivres();
          const lastBooks = allBooks.slice(-3); // Récupère les 3 derniers
          setBooks(lastBooks);

          const allMessages = await getAllMessages();
          const lastMessages = allMessages.slice(-3); // Récupère les 3 derniers
          setMessages(lastMessages);
        } catch (error) {
          //console.error("Error retrieving data", error);
          setCustomers([]);
          setBooks([]);
          setMessages([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <>
      <div className="admin-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="cards-grid">
          <button disabled={role !== "admin"} className="card" onClick={navigation1}>
            <h3>Customers</h3>
            <p>Manage all your customers</p>
          </button>
          <button disabled={role !== "admin"} className="card" onClick={navigation2}>
            <h3>Products</h3>
            <p>Manage product inventory</p>
          </button>
          <button disabled={role !== "admin"} className="card" onClick={navigation4}>
            <h3>Messages</h3>
            <p>Respond to user queries</p>
          </button>
        </div>
      </div>
      <div className="admin-container">
        <h1 className="page-title">Latest customers</h1>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div className="loading">Loading...</div> // Afficher le message de chargement
              ) : role === "admin" ? (
                customers.map((customer) => {
                  return (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.nom}</td>
                      <td>{customer.email}</td>
                      <td>{customer.role}</td>
                    </tr>
                  );
                })
              ) : (
                <p>Unauthenticated user or insufficient access rights</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="admin-container">
        <h1 className="page-title">Latest Products</h1>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th title="Number of loans">Nbr</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div className="loading">Loading...</div> // Afficher le message de chargement
              ) : role === "admin" ? (
                books.map((book) => {
                  return (
                    <tr key={book.id}>
                      <td>{book.id}</td>
                      <td>{book.titre}</td>
                      <td>{book.nbrEmprunt}</td>
                      <td>{book.quantite}</td>
                    </tr>
                  );
                })
              ) : (
                <p>Unauthenticated user or insufficient access rights</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="admin-container">
        <h1 className="page-title">Recent Messages</h1>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Sender</th>
                <th>Message</th>
                <th>Receiver</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div className="loading">Loading...</div>
              ) : role === "admin" ? (
                messages.map((message) => {
                  return (
                    <tr key={message.id}>
                      <td>{message.id}</td>
                      <td>{message.admin ? "Admin" : message.expediteur}</td>
                      <td>{truncateByLetters(message.message)}</td>
                      <td>{message.admin ? message.recepteur : "Admin"}</td>
                    </tr>
                  );
                })
              ) : (
                <p>Unauthenticated user or insufficient access rights</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
