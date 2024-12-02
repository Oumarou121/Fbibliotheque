import React from "react";
import "../styles/Dashboard.css";

const MessagesPage = () => {
  return (
    <div className="admin-container">
      <h1 className="page-title">Messages</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Jane Smith</td>
              <td>Hello, I have a question about...</td>
              <td className="table-actions">
                <button className="edit-btn">View</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesPage;
