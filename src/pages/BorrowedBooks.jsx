import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { getEmprunt, getClientData, deleteEmprunt } from "../Api";
import TopBody from "../components/TopBody";
import Alert from "../components/Alert";
import "../styles/Cart.css";

const Books = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ajouter une alerte
  const addAlert = (message, link, linkText, type) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, link, linkText, type, id: Date.now() },
    ]);
  };

  // Supprimer une alerte
  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const deleteEmpruntHandler = async (id) => {
    try {
      await deleteEmprunt(id);
      addAlert("The book was returned successfully!", null, null, "success");
      const updatedBooks = borrowedBooks.filter((book) => book.id !== id);
      setBorrowedBooks(updatedBooks);
    } catch (error) {
      //console.error("Error deleting emprunt", error);
      addAlert("Error deleting book.", null, null, "warning");
    }
  };

  useEffect(() => {
    const fetchBorrowBooks = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          addAlert(
            "Please log in to view your Borrowed Books.",
            "/login",
            "Login",
            "warning"
          );
          setIsLoading(false);
          return;
        }

        const user = await getClientData();
        const books = await getEmprunt(user?.id);
        setBorrowedBooks(books);
      } catch (error) {
        //console.error("Error getting cart", error);
        addAlert(
          "Failed to fetch borrow books. Please try again later.",
          null,
          null,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowBooks();
  }, []);

  return (
    <>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          link={alert.link}
          linkText={alert.linkText}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}

      <section>
        <div className="shopping">
          <p>Borrowed Books</p>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div> // Afficher le message de chargement
        ) : borrowedBooks.length > 0 ? (
          <section className="cartContent">
            {borrowedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handler1={deleteEmpruntHandler}
                handler2={null}
                isCart={false}
                isFavorites={false}
              />
            ))}
          </section>
        ) : (
          <div className="cart vide" id="emptyCartMessage">
            <i className="uil uil-shopping-cart-alt"></i>
            <p>Borrowed Is Empty</p>
          </div>
        )}
      </section>
    </>
  );
};

function BorrowedBooks() {
  return (
    <>
      <TopBody visibility="true" name="Borrowed Books" />
      <Books />
    </>
  );
}

export default BorrowedBooks;
