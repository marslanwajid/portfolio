import { Link, useLocation } from 'react-router-dom';

// Header Component
// This is the navigation bar that appears at the top of every page

function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
            My Portfolio
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex list-none m-0 p-0 gap-8">
            <li>
              <Link
                to="/"
                className={`no-underline font-medium transition-colors ${
                  isActive('/') ? 'text-blue-400' : 'text-white hover:text-blue-400'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/portfolio"
                className={`no-underline font-medium transition-colors ${
                  isActive('/portfolio') ? 'text-blue-400' : 'text-white hover:text-blue-400'
                }`}
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`no-underline font-medium transition-colors ${
                  isActive('/about') ? 'text-blue-400' : 'text-white hover:text-blue-400'
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`no-underline font-medium transition-colors ${
                  isActive('/contact') ? 'text-blue-400' : 'text-white hover:text-blue-400'
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

