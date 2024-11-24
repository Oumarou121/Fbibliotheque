import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import { BookList, BookImage } from "../components/BookList";

function Home({ onAddToFavorites, onAddToCart, onBorrowBook }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/livres")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des livres :", error);
      });
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
          {/* <img src={Livre1} alt="Nouveau livre 1" />
          <img src={Livre2} alt="Nouveau livre 2" />
          <img src={Livre3} alt="Nouveau livre 3" /> */}
          <BookImage bookId={lastThreeIds[0]} />
          <BookImage bookId={lastThreeIds[1]} />
          <BookImage bookId={lastThreeIds[2]} />
        </div>
      </section>

      {mostPopulary.length > 0 ? (
        <BookList
          name={"Nos Livres Populaires"}
          books={mostPopulary}
          onAddToCart={onAddToFavorites}
          onAddToFavorites={onAddToFavorites}
        />
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
        <button className="load-more-btn">Voir plus</button>
      </section>
    </div>
  );
}

// const BookImage = ({ bookId = 1 }) => {
//   const [imageUrl, setImageUrl] = useState(null);
//   useEffect(() => {
//     let isMounted = true;

//     const fetchImage = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/livres/${bookId}/image`, { responseType: 'blob' });
//           if (response.status === 200 && isMounted) {
//             setImageUrl(URL.createObjectURL(response.data));
//           }
//       } catch (error) {
//         // console.error("Error fetching image:", error);
//       }
//     };

//     fetchImage();

//     return () => {
//       isMounted = false;
//       if (imageUrl) {
//         URL.revokeObjectURL(imageUrl);
//       }
//     };
//   }, [bookId]);

//   return (
//     <div>
//       {imageUrl ? <img src={imageUrl} className="book-image" alt="Book" /> : <p>Loading image...</p>}
//     </div>
//   );
// };

// (
//   mostPopulary.map((book) => (
//     <div key={book.id} className="book-card">
//       <BookImage bookId={book.id}/>
//       <h3>{book.titre}</h3>
//       <p>{book.auteur}</p>
//       <div className="book-actions">
//         {/* Conteneur pour les boutons "Favori" et "Ajouter" sur la même ligne */}
//         <div className="top-actions">
//           {/* Bouton Favori avec icône bi-heart */}
//           <button
//             className="action-btn favorite-btn"
//             onClick={() => onAddToFavorites(book.id)}
//           >
//             <BiHeart size={20} /> Favori
//           </button>
//           {/* Bouton Ajouter au Panier avec icône FaBook */}
//           <button
//             className="action-btn cart-btn"
//             onClick={() => onAddToCart(book.id)}
//           >
//             <FaBook size={20} /> Ajouter
//           </button>
//         </div>
//         {/* Bouton Emprunter avec icône FaHandHolding */}
//         <button
//           className="action-btn borrow-btn"
//           onClick={() => onBorrowBook(book.id)}
//         >
//           <FaHandHolding size={20} /> Emprunter
//         </button>
//       </div>
//     </div>
//   ))
// )

export default Home;
