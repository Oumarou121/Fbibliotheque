// import React, { useState, useEffect } from "react";
// import "../styles/BookCard.css";
// import { getLivreById } from "../Api";
// import { BookImage } from "./BookList";
// import { FaHandHolding, FaTrash, FaBook, FaRedo } from "react-icons/fa";

// const BookCard = ({ book, handler1, handler2, isCart, isFavorites }) => {
//   const [titre, setTitre] = useState("");
//   const [auteur, setAuteur] = useState("");

//   useEffect(() => {
//     const getBookData = async () => {
//       try {
//         const result = await getLivreById(book.livreId);
//         setTitre(result?.titre || "Titre inconnu");
//         setAuteur(result?.auteur || "Auteur inconnu");
//       } catch (error) {
//         //console.error("Erreur lors de la récupération du livre", error);
//       }
//     };

//     getBookData();
//   }, [book.livreId]);

//   return (
//     <div className="book-cart">
//       <div className="first">
//         <BookImage bookId={book.livreId} type="small" />
//         <div className="name">
//           <h3>{titre}</h3>
//           <p>{auteur}</p>
//         </div>
//       </div>
//       <DateRetour isFavorites={isFavorites} isCart={isCart} book={book} />
//       <div className="book-actions">
//         <div className="top-actions">
//           <Btn1
//             isFavorites={isFavorites}
//             isCart={isCart}
//             book={book}
//             handler1={handler1}
//           />
//           <Btn2
//             isFavorites={isFavorites}
//             isCart={isCart}
//             book={book}
//             handler2={handler2}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// function Btn1({ isFavorites, isCart, handler1, book }) {
//   if (!isFavorites && !isCart) {
//     return (
//       <button
//         className="action-btn borrow-btn"
//         onClick={() => handler1(book.id)}
//       >
//         <FaRedo size={20} /> Retourner
//       </button>
//     );
//   } else {
//     return (
//       <button
//         className="action-btn favorite-btn"
//         onClick={() => handler1(book.id)}
//       >
//         <FaTrash size={20} /> Supprimer
//       </button>
//     );
//   }
// }

// function DateRetour({ isFavorites, isCart, book }) {
//   if (!isFavorites && !isCart) {
//     return (
//       <p>
//         Livre emprunté jusqu'au : {book.dateRetourPrevue}, sinon vous devrez
//         payer un dédommagement.
//       </p>
//     );
//   }
//   return null;
// }

// function Btn2({ isFavorites, isCart, handler2, book }) {
//   if (isFavorites) {
//     return (
//       <button
//         className="action-btn cart-btn"
//         onClick={() => handler2(book.livreId)}
//       >
//         <FaBook size={20} /> Ajouter
//       </button>
//     );
//   }

//   if (isCart) {
//     return (
//       <button className="action-btn borrow-btn" onClick={() => handler2(book)}>
//         <FaHandHolding size={20} /> Emprunter
//       </button>
//     );
//   }
// }

// export default BookCard;

import React, { useState, useEffect } from "react";
import "../styles/BookCard.css";
import { getLivreById } from "../Api";
import { BookImage } from "./BookList";
import { FaHandHolding, FaTrash, FaBook, FaRedo } from "react-icons/fa";

const BookCard = ({ book, handler1, handler2, isCart, isFavorites }) => {
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");

  useEffect(() => {
    const getBookData = async () => {
      try {
        const result = await getLivreById(book.livreId);
        setTitre(result?.titre || "Titre inconnu");
        setAuteur(result?.auteur || "Auteur inconnu");
      } catch (error) {
        //console.error("Erreur lors de la récupération du livre", error);
      }
    };

    getBookData();
  }, [book.livreId]);

  return (
    // <div className="book-cart">
    //   <div className="first">
    //     <BookImage bookId={book.livreId} type="small" />
    //     <div className="name">
    //       <h3>{titre}</h3>
    //       <p>{auteur}</p>
    //     </div>
    //   </div>
    //   <DateRetour isFavorites={isFavorites} isCart={isCart} book={book} />
    //   <div className="book-actions">
    //     <div className="top-actions">
    //       <Btn1
    //         isFavorites={isFavorites}
    //         isCart={isCart}
    //         book={book}
    //         handler1={handler1}
    //       />
    //       <Btn2
    //         isFavorites={isFavorites}
    //         isCart={isCart}
    //         book={book}
    //         handler2={handler2}
    //       />
    //     </div>
    //   </div>
    // </div>

    <div key={book.livreId} className="book-card">
      <BookImage bookId={book.livreId} />
      <div className="book-info">
        <h3 className="book-title">{titre}</h3>
        <p className="book-author">by {auteur}</p>
        <div className="book-actions">
          <div className="top-actions">
            <Btn1
              isFavorites={isFavorites}
              isCart={isCart}
              book={book}
              handler1={handler1}
            />
            <Btn2
              isFavorites={isFavorites}
              isCart={isCart}
              book={book}
              handler2={handler2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function Btn1({ isFavorites, isCart, handler1, book }) {
  if (!isFavorites && !isCart) {
    return (
      <button
        className="action-btn cart-btn"
        onClick={() => handler1(book.id)}
      >
        <FaRedo size={20} /> Return
      </button>
    );
  } else {
    return (
      <button
        className="action-btn favorite-btn"
        onClick={() => handler1(book.id)}
      >
        <FaTrash size={20} /> Delete
      </button>
    );
  }
}

// function DateRetour({ isFavorites, isCart, book }) {
//   if (!isFavorites && !isCart) {
//     return (
//       <p>
//         Book borrowed until : {book.dateRetourPrevue}, otherwise you will have
//         to pay compensation.
//       </p>
//     );
//   }
//   return null;
// }

function Btn2({ isFavorites, isCart, handler2, book }) {
  if (!isFavorites && !isCart) {
    return (
      <button
        className="action-btn borrow-btn"
        onClick={() => handler2(book.id)}
      >
        <FaBook size={20} /> Read
      </button>
    );
  }

  if (isFavorites) {
    return (
      <button
        className="action-btn cart-btn"
        onClick={() => handler2(book.livreId)}
      >
        <FaBook size={20} /> Add
      </button>
    );
  }

  if (isCart) {
    return (
      <button className="action-btn borrow-btn" onClick={() => handler2(book)}>
        <FaHandHolding size={20} /> Borrow
      </button>
    );
  }
}

export default BookCard;
