import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { getEmprunt, getClientData, deleteEmprunt } from "../Api";
import TopBody from "../components/TopBody";
import Alert from "../components/Alert";
import "../styles/Cart.css";
import ShowBorrow from "../components/ShowEmprunt";

const Books = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

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

  const handleCustomerModal = (data = null, isDel = false) => {
    if (!isDel) {
      const today = new Date();
      const dateRetourPrevue = new Date(data.dateRetourPrevue);
      if (today >= dateRetourPrevue) {
        addAlert(
          "you can't read the book anymore please return it",
          null,
          null,
          "warning"
        );
      } else {
        setCurrentBook(data);
        setIsModalOpen(true);
        setIsDelete(isDel);
      }
    } else {
      setCurrentBook(data);
      setIsModalOpen(true);
      setIsDelete(isDel);
    }
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
    } finally {
      setIsModalOpen(false);
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
            null,
            null,
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isModalOpen]);

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

      {/* Modale de confirmation d'emprunt */}
      {isModalOpen && (
        <ShowBorrow
          isDelete={isDelete}
          currentBook={currentBook}
          onClose={() => setIsModalOpen(false)}
          handleReturnBook={deleteEmpruntHandler}
        />
      )}

      <section>
        <div className="shopping">
          <p>Borrowed Books</p>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div> // Afficher le message de chargement
        ) : borrowedBooks.length > 0 ? (
          <section className="books-grid">
            {borrowedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handler1={() => handleCustomerModal(book, true)}
                handler2={() => handleCustomerModal(book, false)}
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
