import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { BookList, BookImage } from "../components/BookList";
import { getLivres } from "../Api.js";
import { useNavigate } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
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
        console.error(`Erreur lors de la récupération des livre : ${error}`);
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
        <h1>Bienvenue à la Bibliothèque</h1>
        <p>
          Explorez nos livres et découvrez de nouvelles lectures passionnantes !
        </p>
      </section>

      {/* Section Carrousel ou bannière d'images */}
      <section className="carousel">
        <h2>Nos Nouveaux Livres</h2>
        <div className="carousel-images">
          <BookImage bookId={lastThreeIds[0]} />
          <BookImage bookId={lastThreeIds[1]} />
          <BookImage bookId={lastThreeIds[2]} />
        </div>
      </section>

      {mostPopulary.length > 0 ? (
        <BookList name={"Nos Livres Populaires"} books={mostPopulary} />
      ) : (
        <p>Aucun livre trouvé...</p>
      )}

      {/* Section Informations supplémentaires */}
      <section className="info">
        <h2>Pourquoi Choisir Notre Bibliothèque ?</h2>
        <p>
          Une vaste collection de livres, un accès facile, et une expérience de
          lecture inoubliable.
        </p>
      </section>

      {/* Bouton "Voir plus" */}
      <section className="load-more">
        <button className="load-more-btn" onClick={navigation}>Voir plus</button>
      </section>
    </div>
  );
}

export default Home;
