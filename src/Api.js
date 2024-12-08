// const BASE_URL = "http://localhost:8080/api/client";
const BASE_URL = "https://bbibliotheque-production.up.railway.app/api";

const IVALID_TOKEN = "Error: Token invalide";

export const registerClient = async (clientData) => {
  try {
    const response = await fetch(`${BASE_URL}/client/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const token = await response.text();
    window.location.reload();
    localStorage.setItem("authToken", token);
    return token;
  } catch (error) {
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await fetch(`${BASE_URL}/client/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const id = await response.text();
    // localStorage.setItem("authToken", token);
    return id;
  } catch (error) {
    throw error;
  }
};

export const deleteClient = async (clientId) => {
  try {
    const response = await fetch(`${BASE_URL}/client/${clientId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (error) {
    throw error;
  }
};

export const loginClient = async (loginData) => {
  try {
    const response = await fetch(`${BASE_URL}/client/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    window.location.reload();
    return await response.text();
  } catch (error) {
    throw error;
  }
};

export const logoutClient = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    //console.error("Aucun token trouvé. L'utilisateur est déjà déconnecté.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/client/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // localStorage.removeItem("authToken");
      // window.location.reload();
    } else {
      await response.text();
      //console.error("Erreur de déconnexion:", error);
    }
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
  } finally {
    localStorage.removeItem("authToken");
    window.location.reload();
  }
};

export const getClientData = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    //console.error("Aucun token trouvé.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/client/me`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const clientData = await response.json();
    return clientData;
  } catch (error) {
    const e = error.toString();
    if (e.includes(IVALID_TOKEN)) {
      //console.log("Token Invalide");
      localStorage.removeItem("authToken");
    }
    // console.error(
    //   "Erreur lors de la récupération des données du client:",
    //   error
    // );
  }
};

export const isInCart = async (cartData) => {
  try {
    const cartItems = await GetCartByClient(cartData.clientId);

    const itemInCart = cartItems.find(
      (item) => item.livreId === cartData.livreId
    );

    if (itemInCart) {
      await RemoveFromCart(itemInCart.id);
      console.log(
        `Le livre (ID: ${cartData.livreId}) a été supprimé du panier.`
      );
      await getTotalQuantityInCart(cartData.clientId);
      return "removed";
    } else {
      await AddToCart(cartData);
      console.log(`Le livre (ID: ${cartData.livreId}) a été ajouté au panier.`);
      await getTotalQuantityInCart(cartData.clientId);
      return "added";
    }
  } catch (error) {
    console.error(`Erreur dans isInCart : ${error.message}`);
  }
};

export const GetCartByClient = async (clientId) => {
  // const { showLoader, hideLoader } = useLoader();
  // showLoader();
  const token = localStorage.getItem("authToken");
  //console.log(token);
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/cart/${clientId}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération du panier: ${error.message}`
    );
  } finally {
    // hideLoader();
  }
};

export const AddToCart = async (cartData) => {
  // const { showLoader, hideLoader } = useLoader();
  // showLoader();
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout au panier: ${error.message}`);
  } finally {
    // hideLoader();
  }
};

export const RemoveFromCart = async (cartId) => {
  // const { showLoader, hideLoader } = useLoader();
  // showLoader();
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/cart/${cartId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    //console.log("Article supprimé du panier avec succès.");
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression du panier: ${error.message}`
    );
  } finally {
    // hideLoader();
  }
};

export const isInFavorite = async (favoriteData) => {
  try {
    const favoriteItems = await GetFavoritesByClient(favoriteData.clientId);

    const itemInFavorite = favoriteItems.find(
      (item) => item.livreId === favoriteData.livreId
    );

    if (itemInFavorite) {
      await RemoveFromFavorite(itemInFavorite.id);
      //console.log(
      //  `Le livre (ID: ${favoriteData.livreId}) a été retiré des favoris.`
      //);
      // await getTotalQuantityInCart(favoriteData.clientId);
      return "removed";
    } else {
      await AddToFavorite(favoriteData);
      //console.log(
      //  `Le livre (ID: ${favoriteData.livreId}) a été ajouté aux favoris.`
      //);
      // await getTotalQuantityInCart(favoriteData.clientId);
      return "added";
    }
  } catch (error) {
    //console.error(`Erreur dans isInFavorite : ${error.message}`);
  }
};

export const GetFavoritesByClient = async (clientId) => {
  // const { showLoader, hideLoader } = useLoader();
  // showLoader();
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/favorites/${clientId}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des favoris: ${error.message}`
    );
  } finally {
    // hideLoader();
  }
};

export const AddToFavorite = async (favoriteData) => {
  // const { showLoader, hideLoader } = useLoader();
  // showLoader();
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/favorites`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favoriteData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout aux favoris: ${error.message}`);
  } finally {
    // hideLoader();
  }
};

export const RemoveFromFavorite = async (favoriteId) => {
  // const { showLoader, hideLoader } = useLoader();
  // showLoader();
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/favorites/${favoriteId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    //console.log("Livre supprimé des favoris avec succès.");
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression des favoris: ${error.message}`
    );
  } finally {
    // hideLoader();
  }
};

export const getTotalQuantityInCart = async (Id) => {
  const bagQuantityElement = document.getElementById("cart-box");
  if (bagQuantityElement) {
    try {
      const cart = await GetCartByClient(Id);
      bagQuantityElement.setAttribute("data-quantity", cart.length);
    } catch (error) {
      bagQuantityElement.setAttribute("data-quantity", 0);
    }
  }
};

export const getTotalMessageInCart = async () => {
  const bagQuantityElement = document.getElementById("message-box");
  const token = localStorage.getItem("authToken");
  if (bagQuantityElement && token) {
    try {
      const data = await getClientData();
      const message = await getMessagesByReceiver(data?.email);
      bagQuantityElement.setAttribute("data-quantity", message.length);
    } catch (error) {
      bagQuantityElement.setAttribute("data-quantity", 0);
    }
  }
};

export const getAdherentByClient = async (clientId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/adherents/${clientId}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la recuperation des adherent: ${error.message}`
    );
  }
};

export const addAdherent = async (Data) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/adherents`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    // //console.log(response.json());
    // return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de l'adherent: ${error.message}`);
  }
};

export const updateAdherent = async (Data) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/adherents`, {
      method: "PUT",
      headers: {
        // Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de l'adherent: ${error.message}`);
  }
};

export const deleteAdherentByClient = async (clientId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/adherents/client/${clientId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    //console.log("Adherent supprimé avec succès.");
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression de l'adherent: ${error.message}`
    );
  }
};

export const addEmprunt = async (Data) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/emprunts`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de l'emprunt du livre: ${error.message}`);
  }
};

// export const updateEmprunt = async (empruntId, Data) => {
//   const token = localStorage.getItem("authToken");
//   if (!token) {
//     throw new Error("Unauthenticated user.");
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/emprunts/${empruntId}`, {
//       method: "PUT",
//       headers: {
//         Authorization: token,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(Data),
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error);
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(
//       `Erreur lors de la mise à jour de l'emprunt du livre: ${error.message}`
//     );
//   }
// };

export const updateEmprunt = async (Data) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/emprunts`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la mise à jour de l'emprunt du livre: ${error.message}`
    );
  }
};

export const getEmprunt = async (clientId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/emprunts/${clientId}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la recuperation des emprunts : ${error.message}`
    );
  }
};

export const getAllEmprunt = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/emprunts`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la recuperation des emprunts : ${error.message}`
    );
  }
};

export const deleteEmprunt = async (empruntId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/emprunts/${empruntId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    //console.log("Emprunt supprimer");
  } catch (error) {
    throw new Error(
      `Erreur lors de la recuperation des emprunts : ${error.message}`
    );
  }
};

export const getLivreById = async (livreId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/livres/${livreId}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la recuperation du livre : ${error.message}`
    );
  }
};

export const getLivres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/livres`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    //console.error("Erreur dans getLivres:", error);
    throw new Error(
      `Erreur lors de la récupération des livres : ${error.message}`
    );
  }
};

export const updateClient = async (clientId, clientData) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/client/${clientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erreur lors de la mise à jour (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    //console.error("Erreur dans updateClient:", error);
    throw new Error(`Erreur lors de la mise à jour : ${error.message}`);
  }
};

export const getClients = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/client`, {
      method: "GET",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erreur lors de la récupération des clients (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    //console.error("Erreur dans getClients:", error);
    throw new Error(
      `Erreur lors de la recuperation des livres : ${error.message}`
    );
  }
};

export const createLivre = async (Data) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/livres`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(Data),
      body: JSON.stringify(Data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erreur lors de la creation du livre (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    //console.error("Erreur dans createLivre:", error);
    throw new Error(`Erreur lors de la création du livre : ${error.message}`);
  }
};

export const updateLivre = async (livreId, Data) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/livres/${livreId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erreur lors de la mise à jour du livre (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    //console.error("Erreur dans updateLivre:", error);
    throw new Error(
      `Erreur lors de la mise à jour du livre : ${error.message}`
    );
  }
};

export const deleteLivre = async (livreId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Unauthenticated user.");
  }

  try {
    const response = await fetch(`${BASE_URL}/livres/${livreId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erreur lors de la suppression du livre (${response.status}): ${errorText}`
      );
    }
  } catch (error) {
    //console.error("Erreur dans updateLivre:", error);
    throw new Error(
      `Erreur lors de la suppression du livre : ${error.message}`
    );
  }
};

export const getAllMessages = async () => {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des messages: ${error.message}`
    );
  }
};

export const getMessagesByReceiver = async (receiver) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/${receiver}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des messages pour ${receiver}: ${error.message}`
    );
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression du message: ${error.message}`
    );
  }
};

export const sendClientMessage = async (message) => {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
  }
};

export const sendAdminMessage = async (message) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
  }
};

export const getEmailById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/client/email/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.text();
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération du email: ${error.message}`
    );
  }
};

export const getTitreById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/livres/titre/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.text();
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération du titre: ${error.message}`
    );
  }
};
