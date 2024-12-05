import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { BookList, BookImage } from "../components/BookList";
import { getLivres } from "../Api.js";
import { useNavigate } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const navigation = () => {
    navigate("/library#showMore");
  };

  useEffect(() => {
    const livres = async () => {
      try {
        const books = await getLivres();
        setBooks(books);
      } catch (error) {
        //console.error(`Error retrieving books: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    livres();
  }, []);

  const lastThreeIds = books
    .sort((a, b) => b.id - a.id) // Trier par ID décroissant
    .slice(0, 3) // Prendre les 3 premiers livres
    .map((book) => book.id); // Extraire les IDs des 3 premiers livres

  const mostPopulary = books
    .sort((a, b) => b.nbrEmprunt - a.nbrEmprunt) // Trier par nombre d'emprunts décroissant
    .slice(0, 5); // Prendre les 5 livres les plus empruntés

  return (
    <div className="home">
      {/* Section de bienvenue */}
      <section className="welcome">
        <h1>Welcome to the Library</h1>
        <p>Explore our books and discover exciting new reads!</p>
      </section>

      {/* Section Carrousel ou bannière d'images */}
      <section className="carousel">
        <h2>Our New Books</h2>
        {isLoading ? (
          <div className="loading">Loading...</div> // Afficher le message de chargement
        ) : lastThreeIds.length > 0 ? (
          <div className="carousel-images">
            <BookImage bookId={lastThreeIds[0]} />
            <BookImage bookId={lastThreeIds[1]} />
            <BookImage bookId={lastThreeIds[2]} />
          </div>
        ) : (
          <p className="no-books">No books found</p>
        )}
      </section>

      {isLoading ? (
        <div className="loading">Loading...</div> // Afficher le message de chargement
      ) : mostPopulary.length > 0 ? (
        <BookList name={"Our Popular Books"} books={mostPopulary} />
      ) : (
        <p className="no-books">No books found</p>
      )}

      {/* Section Informations supplémentaires */}
      <section className="info">
        <h2>Why Choose Our Library?</h2>
        <p>
          A vast collection of books, easy access, and an unforgettable reading
          experience.
        </p>
      </section>

      {/* Bouton "Voir plus" */}
      <section className="load-more">
        <button className="load-more-btn" onClick={navigation}>
          See more
        </button>
      </section>
    </div>
  );
}

export default Home;
