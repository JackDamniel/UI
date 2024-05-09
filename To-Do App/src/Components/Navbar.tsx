import { Link } from '@tanstack/react-router';
import '../index.css';

export function Navbar() {
  return (
      <nav className="navbar navbar-expand-lg navbar-light bg-primary text-white py-3 mb-3">
          <div className="container">
              <Link className="navbar-brand text-white" to="/">Web App</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                          <Link className="nav-link text-white" aria-current="page" to="/">Home</Link>
                      </li>
                      <li className="nav-item">
                          <Link className="nav-link text-white" to="/ToDo">ToDo</Link>
                      </li>
                      <li className="nav-item">
                            <Link className="nav-link text-white" to="/Rick">Rick</Link>
                        </li>
                  </ul>
              </div>
          </div>
      </nav>
  );
}