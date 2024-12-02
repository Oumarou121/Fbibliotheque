import React from "react";
import "../styles/Dashboard.css";

const DashboardPage = () => {
  return (
    <>
      <div className="admin-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="cards-grid">
          <div className="card">
            <h3>Customers</h3>
            <p>Manage all your customers</p>
          </div>
          <div className="card">
            <h3>Products</h3>
            <p>Manage product inventory</p>
          </div>
          <div className="card">
            <h3>Messages</h3>
            <p>Respond to user queries</p>
          </div>
        </div>
      </div>
      <div className="admin-container">
        <h1 className="page-title">Customers</h1>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>john.doe@example.com</td>
                {/* <td className="table-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="admin-container">
        <h1 className="page-title">Products</h1>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>101</td>
                <td>Product A</td>
                <td>$50</td>
                <td>20</td>
                {/* <td className="table-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="admin-container">
        <h1 className="page-title">Recente Messages</h1>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Sender</th>
                <th>Message</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>001</td>
                <td>Jane Smith</td>
                <td>Hello, I have a question about...</td>
                {/* <td className="table-actions">
                  <button className="edit-btn">View</button>
                  <button className="delete-btn">Delete</button>
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
