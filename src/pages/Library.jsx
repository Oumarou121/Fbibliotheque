import TopBody from "../components/TopBody";
import React, { useState, useEffect } from "react";
import "../styles/Library.css";
import { BookList } from "../components/BookList";
import { getLivres } from "../Api.js";

function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const livres = async () => {
      try {
        const books = await getLivres();
        setBooks(books);
        setFilteredBooks(books);
      } catch (error) {
        //console.error(`Erreur lors de la récupération des livre : ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    livres();
  }, []);

  const handleAddToCart = (bookId) => {
    //console.log(`Book ${bookId} added to cart`);
  };

  const handleAddToFavorites = (bookId) => {
    //console.log(`Book ${bookId} added to favorites`);
  };

  // Filtrer les livres en fonction du texte saisi
  useEffect(() => {
    const results = books.filter(
      (book) =>
        book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.auteur.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  return (
    <>
      <TopBody visibility="true" name="Library" />
      <div className="library-container">
        <section className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un livre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>
      </div>
      {isLoading ? (
        <div className="loading">Loading...</div> // Afficher le message de chargement
      ) : books.length > 0 ? (
        <BookList
          name={"Our Book Collection"}
          books={filteredBooks}
          onAddToCart={handleAddToCart}
          onAddToFavorites={handleAddToFavorites}
        />
      ) : (
        <p>No books found...</p>
      )}
    </>
  );
}

export default Library;
