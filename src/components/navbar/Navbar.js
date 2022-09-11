import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import NavBarMenuIcon from './NavBarMenuIcon';
import NavbarLargeScreen from './NavbarLargeScreen';
import NavbarMobileScreen from './NavbarMobileScreen';
import LoginButton from '../auth/LoginButton';
import LogOutButton from '../auth/LogOutButton';
import { useAuth0 } from '@auth0/auth0-react';

import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const { user } = useAuth0();
  const location = useLocation();

  const toggleMenuIcon = () => setToggle(!toggle);
  const closeMobileMenu = () => setToggle(false);

  const screenSize = () => {
    setScreenWidth(window.innerWidth);
  };

  window.addEventListener('resize', screenSize);

  useEffect(() => {
    screenSize();
  }, []);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/home' className='navbar-logo'>
            <div className='navbar-flag-icon'></div>
            <div className='navbar-alphabet-icon'></div>
          </Link>

          {location.pathname === '/kanban' &&
            (!user ? <LoginButton /> : <LogOutButton />)}
          {}
          <NavbarLargeScreen screenWidth={screenWidth} />

          <NavBarMenuIcon
            screenWidth={screenWidth}
            toggleMenuIcon={toggleMenuIcon}
            toggle={toggle}
          />
        </div>
      </nav>
      {toggle && (
        <NavbarMobileScreen
          screenWidth={screenWidth}
          closeMobileMenu={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
