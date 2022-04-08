import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  logout,
  getAllUsers,
  getUserDetail,
} from "../../firebase/firebase";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { uid, email } = user || {};

  const fetchUser = async () => {
    const userProfileData = await getUserDetail(uid);
    setUserProfile(userProfileData);
  };

  const fetchUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    // Get the list of all users
    fetchUsers();

    if (!user) {
      return navigate("/");
    }
    fetchUser();
  }, [user, loading]);

  // Function to render the table
  const renderTable = () => {
    if (users && users.length) {
      return users.map((user, idx) => {
        return (
          <tr key={idx}>
            <td>
              {user.firstname},{user.lastname}
            </td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
          </tr>
        );
      });
    }
  };

  return (
    <div className="dashboard">
      {/** User profile information */}
      <div className="user-profile-container">
        Logged in as
        <div>First Name: {userProfile && userProfile.firstname}</div>
        <div>Email: {userProfile && userProfile.email}</div>
        <div>Phone: {userProfile && userProfile.phone}</div>
        <button className="dashboard-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/** List of users */}

      <div className="users-container">
        <h3> Users</h3>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>{renderTable()}</tbody>
        </table>
      </div>
    </div>
  );
};
export default Dashboard;
