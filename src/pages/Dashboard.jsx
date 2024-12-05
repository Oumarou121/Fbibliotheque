import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { getClients, getLivres, getAllMessages } from "../Api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [books, setBooks] = useState([]);
  // const [loans, setLoans] = useState([]);
  const [messages, setMessages] = useState([]);

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
      try {
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
      }
    };
    getData();
  }, []);

  return (
    <>
      <div className="admin-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="cards-grid">
          <div className="card" onClick={navigation1}>
            <h3>Customers</h3>
            <p>Manage all your customers</p>
          </div>
          <div className="card" onClick={navigation2}>
            <h3>Products</h3>
            <p>Manage product inventory</p>
          </div>
          <div className="card" onClick={navigation4}>
            <h3>Messages</h3>
            <p>Respond to user queries</p>
          </div>
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
              {customers.map((customer) => {
                return (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.nom}</td>
                    <td>{customer.email}</td>
                    <td>{customer.role}</td>
                  </tr>
                );
              })}
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
              {books.map((book) => {
                return (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.titre}</td>
                    <td>{book.nbrEmprunt}</td>
                    <td>{book.quantite}</td>
                  </tr>
                );
              })}
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
              {messages.map((message) => {
                return (
                  <tr key={message.id}>
                    <td>{message.id}</td>
                    <td>{message.admin ? "Admin" : message.expediteur}</td>
                    <td>{truncateByLetters(message.message)}</td>
                    <td>{message.admin ? message.recepteur : "Admin"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
