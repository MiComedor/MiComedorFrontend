import React from "react";
import { getCurrentUser } from "../../services/auth.service";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>No user logged in.</h3>
        </header>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Welcome, <strong>{currentUser.username}</strong>!</h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken}
      </p>
    </div>
  );
};

export default Profile;
