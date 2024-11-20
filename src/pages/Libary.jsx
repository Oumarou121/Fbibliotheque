import TopBody from "../components/TopBody";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiHeart } from "react-icons/bi";
import { FaBook, FaHandHolding } from "react-icons/fa";
import "../styles/Libary.css";

function Libary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Récupérer les livres depuis l'API Spring Boot
    axios
      .get("http://localhost:8080/api/livres")
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des livres :", error));
  }, []);

  const handleAddToCart = (bookId) => {
    console.log(`Book ${bookId} added to cart`);
  };

  const handleAddToFavorites = (bookId) => {
    console.log(`Book ${bookId} added to favorites`);
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
      <TopBody visibility="true" name="Libary" />
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
      <BookList
        books={filteredBooks}
        onAddToCart={handleAddToCart}
        onAddToFavorites={handleAddToFavorites}
      />
    </>
  );
}

const BookList = ({ books, onAddToCart, onAddToFavorites, onBorrowBook }) => {
  return (
    <div className="booklist-container">
      <h2 className="booklist-title">Our Book Collection</h2>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            {/* <img src={book.image} alt={book.title} className="book-image" /> */}
            <BookImage bookId={book.id}/>
            <div className="book-info">
              <h3 className="book-title">{book.titre}</h3>
              <p className="book-author">by {book.auteur}</p>
              {/* <p className="book-description">{book.description}</p> */}
              <div className="book-actions">
                <div className="top-actions">
                  <button
                    className="action-btn favorite-btn"
                    onClick={() => onAddToFavorites(book.id)}
                  >
                    <BiHeart size={20} /> Favori
                  </button>
                  <button
                    className="action-btn cart-btn"
                    onClick={() => onAddToCart(book.id)}
                  >
                    <FaBook size={20} /> Ajouter
                  </button>
                </div>
                <button
                  className="action-btn borrow-btn"
                  onClick={() => onBorrowBook(book.id)}
                >
                  <FaHandHolding size={20} /> Emprunter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookImage = ({ bookId = 1 }) => {
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    let isMounted = true;
  
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/livres/${bookId}/image`);
        if (response.ok) {
          const imageBlob = await response.blob();
          const imageObjectUrl = URL.createObjectURL(imageBlob);
          if (isMounted) setImageUrl(imageObjectUrl);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
  
    fetchImage();
  
    return () => {
      isMounted = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [bookId]);

  return (
    <div>
      {imageUrl ? <img src={imageUrl} className="book-image" alt="Book" /> : <p>Loading image...</p>}
    </div>
  );
};

export default Libary;

