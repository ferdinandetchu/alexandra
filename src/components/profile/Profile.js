import React from 'react';
import './Profile.css';

import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  const { name, picture, email } = user;

  return (
    <>
      <div className='profile-auth-json'>
        {isAuthenticated && (
          <pre className=''>{JSON.stringify(user, null, 2)}</pre>
        )}
      </div>
      <div className='profile-wrapper'>
        <div className='profile-image-wrapper'>
          <img src={picture} alt='Profile' className='profile-image' />
        </div>
        <div className='profile-name-email-wrapper'>
          <h2>{name}</h2>
        </div>
      </div>
    </>
  );
};

export default Profile;
