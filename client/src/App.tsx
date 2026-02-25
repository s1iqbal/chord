import { Routes, Route, NavLink } from 'react-router-dom';
import { ConsolePage } from './pages/ConsolePage';
import { ManagePage } from './pages/ManagePage';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.navActive : styles.navLink
          }
          end
        >
          Console
        </NavLink>
        <NavLink
          to="/manage"
          className={({ isActive }) =>
            isActive ? styles.navActive : styles.navLink
          }
        >
          Manage Pools
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<ConsolePage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </div>
  );
}

export default App;
