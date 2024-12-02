import "../styles/Modal.css";
import { BookImage } from "./BookList";


function Modal({ currentBook, confirmBorrow, setIsModalOpen, isBody = true }) {
  return (
    <div className="modal1">
      <div className="modal-content">
        <h2>Confirmer l'emprunt</h2>
        {/* <p>
          <strong>{currentBook.titre}</strong> par {currentBook.auteur}
        </p> */}
        <h3>{currentBook.titre}</h3>        
        <BookImage bookId={(isBody == true) ? currentBook.id : currentBook.livreId }/>
        <p>Êtes-vous sûr de vouloir emprunter ce livre ?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
            Annuler
          </button>
          <button className="confirm-btn" onClick={confirmBorrow}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
