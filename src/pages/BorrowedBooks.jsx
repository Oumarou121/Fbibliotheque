import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { getEmprunt, getClientData, deleteEmprunt } from "../Api";
import TopBody from "../components/TopBody";
import Alert from "../components/Alert";
import "../styles/Cart.css";

const Books = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  // const [userData, setUserData] = useState(null);

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
      addAlert("Le livre a bien été rendu.!", null, null, "success");
      const updatedBooks = borrowedBooks.filter((book) => book.id !== id);
      setBorrowedBooks(updatedBooks);
    } catch (error) {
      console.error("Error deleting emprunt", error);
      addAlert(
        "Erreur lors de la suppression du livre.",
        null,
        null,
        "warning"
      );
    }
  };

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Utilisateur non authentifié.");
      }
      try {
        const user = await getClientData();
        const books = await getEmprunt(user?.id);
        setBorrowedBooks(books);
        // setUserData(user);
      } catch (error) {
        console.log("Error getting emprunts", error);
      }
    };

    fetchBorrowedBooks();
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
          <p>Livres Empruntés</p>
        </div>

        {borrowedBooks.length > 0 ? (
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
      <TopBody visibility="true" name="Livres Empruntés" />
      <Books />
    </>
  );
}

export default BorrowedBooks;
