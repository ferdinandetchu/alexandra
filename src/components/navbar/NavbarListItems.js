import React from 'react';
import { Link } from 'react-router-dom';

const NavbarListItems = () => {
  return (
    <>
      <li className='navbar-list-item'>
        <Link to='/' className='navbar-link'>
          Dom
        </Link>
      </li>
      <li className='navbar-list-item'>
        <Link to='/experience' className='navbar-link'>
          Mapa
        </Link>
      </li>
      <li className='navbar-list-item'>
        <Link to='/kanban' className='navbar-link'>
          Koniugacja
        </Link>
      </li>
      <li className='navbar-list-item'>
        <Link to='/profile' className='navbar-link'>
          Rzeczowniki
        </Link>
      </li>
      <li className='navbar-list-item'>
        <Link to='/notatki' className='navbar-link'>
          Notatki
        </Link>
      </li>
    </>
  );
};

export default NavbarListItems;
