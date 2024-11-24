const BASE_URL = "http://localhost:8080/api/client";
const IVALID_TOKEN = "Error: Token invalide";

export const registerClient = async (clientData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
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
    localStorage.setItem("authToken", token);
    return token;
  } catch (error) {
    throw error;
  }
};

export const loginClient = async (loginData) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
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
    return await response.text();
  } catch (error) {
    throw error;
  }
};

export const logoutClient = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("Aucun token trouvé. L'utilisateur est déjà déconnecté.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      localStorage.removeItem("authToken");
      console.log("Déconnexion réussie.");
      window.location.reload();
    } else {
      const error = await response.text();
      console.error("Erreur de déconnexion:", error);
    }
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
  }
};

export const getClientData = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("Aucun token trouvé.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/me`, {
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
      console.log("Token Invalide");
      localStorage.removeItem("authToken");
    }
    console.error(
      "Erreur lors de la récupération des données du client:",
      error
    );
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
  console.log(token);
  if (!token) {
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch(`http://localhost:8080/api/cart/${clientId}`, {
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
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch("http://localhost:8080/api/cart", {
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
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
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

    console.log("Article supprimé du panier avec succès.");
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
      console.log(
        `Le livre (ID: ${favoriteData.livreId}) a été retiré des favoris.`
      );
      // await getTotalQuantityInCart(favoriteData.clientId);
      return "removed";
    } else {
      await AddToFavorite(favoriteData);
      console.log(
        `Le livre (ID: ${favoriteData.livreId}) a été ajouté aux favoris.`
      );
      // await getTotalQuantityInCart(favoriteData.clientId);
      return "added";
    }
  } catch (error) {
    console.error(`Erreur dans isInFavorite : ${error.message}`);
  }
};

export const GetFavoritesByClient = async (clientId) => {
  // const { showLoader, hideLoader } = useLoader();
  // showLoader();
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/favorites/${clientId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

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
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch("http://localhost:8080/api/favorites", {
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
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/favorites/${favoriteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    console.log("Livre supprimé des favoris avec succès.");
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
  try {
    const cart = await GetCartByClient(Id);
    bagQuantityElement.setAttribute("data-quantity", cart.length);
  } catch (error) {
    bagQuantityElement.setAttribute("data-quantity", 0);
  }
};

export const getAdherentByClient = async (clientId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/adherents/${clientId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
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
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch("http://localhost:8080/api/adherents", {
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
    throw new Error(`Erreur lors de l'ajout de l'adherent: ${error.message}`);
  }
};

export const deleteAdherentByClient = async (clientId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/adherents/client/${clientId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    console.log("Adherent supprimé avec succès.");
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression de l'adherent: ${error.message}`
    );
  }
};
