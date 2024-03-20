import React from 'react';

const Avatar = () => {
  const user = { name: 'John Doe', profilePicture: 'url-to-profile-picture' };

  return (
    <div>
      <img src={user.profilePicture} alt="User Avatar" />
      <p>{user.name}</p>
    </div>
  );
};

export default Avatar;
