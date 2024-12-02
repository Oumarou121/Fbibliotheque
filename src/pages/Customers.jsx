import React, { useEffect, useState } from "react";
import "../styles/Customers.css";
import { getClients } from "../Api";
import ShowCustomer from "../components/ShowCustomer";

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  const handleCustomerModal = (customer = null, isDel = false) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
    setIsDelete(isDel);
  };

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const customers = await getClients();
        setCustomers(customers);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        setCustomers([]);
      }
    };
    getCustomers();
  }, []);

  // Filtrer les livres en fonction du texte saisi
  useEffect(() => {
    const results = customers.filter(
      (customer) =>
        (customer.nom &&
          customer.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email &&
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.role &&
          customer.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.id && customer.id === searchTerm)
    );
    setFilteredCustomers(results);
  }, [searchTerm, customers]);
  return (
    <>
      {/* Modale de confirmation d'emprunt */}
      {isModalOpen && (
        <ShowCustomer
          isDelete={isDelete}
          client={currentCustomer}
          onClose={() => setIsModalOpen(false)}
          updateCustomers={(updatedCustomer) => {
            if (isDelete) {
              // Supprimer un client
              setCustomers((prevCustomers) =>
                prevCustomers.filter(
                  (customer) => customer.id !== updatedCustomer.id
                )
              );
            } else {
              if (!updatedCustomer.isNew) {
                // Met à jour un client existant
                setCustomers((prevCustomers) =>
                  prevCustomers.map((customer) =>
                    customer.id === updatedCustomer.id
                      ? updatedCustomer
                      : customer
                  )
                );
              } else {
                // Ajoute un nouveau client avec un ID généré
                setCustomers((prevCustomers) => [
                  ...prevCustomers,
                  updatedCustomer,
                ]);
              }
            }
          }}
        />
      )}

      <div className="admin-dashboard">
        <h1>Manage Customers</h1>

        <div className="product-actions">
          <input
            type="text"
            id="search"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => handleCustomerModal()}>
            Add New Customer
          </button>
        </div>

        <table id="productTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => {
              return (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.nom}</td>
                  <td>{customer.email}</td>
                  <td>{customer.role}</td>
                  <td className="table-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleCustomerModal(customer, false)}
                    >
                      Détails
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleCustomerModal(customer, true)}
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

export default CustomersPage;