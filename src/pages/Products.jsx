import React, { useEffect, useState } from "react";
import "../styles/Customers.css";
import { getLivres } from "../Api";
import ShowBook from "../components/ShowBook.jsx";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  const handleBookModal = (book = null, isDel = false) => {
    setCurrentBook(book);
    setIsModalOpen(true);
    setIsDelete(isDel);
  };

  useEffect(() => {
    const getBooks = async () => {
      try {
        const books = await getLivres();
        setBooks(books);
        setFilteredBooks(books);
      } catch (error) {
        //console.error("Error retrieving books", error);
        setBooks([]);
      }
    };
    getBooks();
  }, []);

  // Filtrer les livres en fonction du texte saisi
  useEffect(() => {
    const results = books.filter(
      (book) =>
        (book.titre &&
          book.titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.id && book.id === searchTerm)
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  return (
    <>
      {/* Modale de confirmation d'emprunt */}
      {isModalOpen && (
        <ShowBook
          isDelete={isDelete}
          currentBook={currentBook}
          onClose={() => setIsModalOpen(false)}
          updateBooks={(updatedBook) => {
            if (isDelete) {
              // Supprimer un client
              setBooks((prevBooks) =>
                prevBooks.filter((book) => book.id !== updatedBook.id)
              );
            } else {
              if (!updatedBook.isNew) {
                // Met à jour un client existant
                setBooks((prevBooks) =>
                  prevBooks.map((book) =>
                    book.id === updatedBook.id ? updatedBook : book
                  )
                );
              } else {
                // Ajoute un nouveau client avec un ID généré
                setBooks((prevBooks) => [...prevBooks, updatedBook]);
              }
            }
          }}
        />
      )}

      <div className="admin-dashboard">
        <h1>Manage Books</h1>

        <div className="product-actions">
          <input
            type="text"
            id="search"
            placeholder="Search book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => handleBookModal()}>Add New Book</button>
        </div>

        <table id="productTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>title</th>
              <th title="Number of loans">Nbr</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => {
              return (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.titre}</td>
                  <td>{book.nbrEmprunt}</td>
                  <td>{book.quantite}</td>
                  <td className="table-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleBookModal(book, false)}
                    >
                      Détails
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleBookModal(book, true)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductsPage;
