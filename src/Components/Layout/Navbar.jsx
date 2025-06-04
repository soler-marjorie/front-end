import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-yellow-400' : 'hover:text-gray-300'
              }
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/univariateFunction"
              className={({ isActive }) =>
                isActive ? 'text-yellow-400' : 'hover:text-gray-300'
              }
            >
              Univariate Function
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'text-yellow-400' : 'hover:text-gray-300'
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
    
  );
}