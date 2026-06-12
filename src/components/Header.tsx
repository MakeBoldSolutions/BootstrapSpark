import { Link, useLocation } from "react-router-dom";
import {
  House,
  Person,
  Briefcase,
  Github,
  JournalText,
  EmojiLaughing,
  Cloud,
  CpuFill,
  Grid,
  Table,
  Window,
  Kanban,
  Bag,
  Envelope,
  PaletteFill,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";
import { useTheme } from "../contexts/ThemeContext";

const Header: React.FC = () => {
  const location = useLocation();
  const { activeTheme, currentColorMode, status } = useTheme();

  // Function to check if route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isShowcaseActive =
    location.pathname === "/components" ||
    location.pathname === "/advanced-components" ||
    location.pathname === "/data-tables";

  const isSiteDemosActive =
    location.pathname === "/site-demos/saas-dashboard" ||
    location.pathname === "/site-demos/team-collaboration" ||
    location.pathname === "/site-demos/product-catalog";

  const isAppsActive =
    location.pathname === "/projects" ||
    location.pathname === "/repositories" ||
    location.pathname === "/articles" ||
    location.pathname === "/joke" ||
    location.pathname === "/weather" ||
    location.pathname === "/variant";

  const isThemesActive = location.pathname === "/themes";

  const logoPath = "/assets/logo/makeboldspark-mark.svg";

  return (
    <>
      <a href="#main-content" className="visually-hidden-focusable">
        Skip to main content
      </a>
      <nav
        className="navbar navbar-expand-lg border-bottom bg-body"
        data-bs-theme={currentColorMode}
      >
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logoPath} alt="Make Bold Spark" width="24" height="24" className="me-2" />
            <div>
              <span className="fw-bold">BootstrapSpark</span>
              <small className="d-block text-muted header-subtitle">by Mark Hazleton</small>
            </div>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/") ? "active fw-semibold" : ""}`}
                  to="/"
                  aria-label="Home page"
                >
                  <House className="me-1" /> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/about") ? "active fw-semibold" : ""}`}
                  to="/about"
                  aria-label="About page"
                >
                  <Person className="me-1" /> About
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button
                  className={`nav-link dropdown-toggle btn btn-link text-decoration-none ${isAppsActive ? "active fw-semibold" : ""}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Apps
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/projects" aria-label="Projects page">
                      <Briefcase className="me-2" /> Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/repositories"
                      aria-label="Repositories page"
                    >
                      <Github className="me-2" /> Repositories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/articles" aria-label="Articles page">
                      <JournalText className="me-2" /> Articles
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/joke" aria-label="Joke page">
                      <EmojiLaughing className="me-2" /> Joke
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/weather" aria-label="Weather page">
                      <Cloud className="me-2" /> Weather
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/variant" aria-label="PromptSpark page">
                      <CpuFill className="me-2" /> PromptSpark
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <button
                  className={`nav-link dropdown-toggle btn btn-link text-decoration-none ${isShowcaseActive ? "active fw-semibold" : ""}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Grid className="me-1" /> Showcase
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/components">
                      <Grid className="me-2" /> Components
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/advanced-components">
                      <Grid className="me-2" /> Advanced Components
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/data-tables">
                      <Table className="me-2" /> Data Tables
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <button
                  className={`nav-link dropdown-toggle btn btn-link text-decoration-none ${isSiteDemosActive ? "active fw-semibold" : ""}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Window className="me-1" /> Site Demos
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/site-demos/saas-dashboard">
                      <Table className="me-2" /> SaaS Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/site-demos/team-collaboration">
                      <Kanban className="me-2" /> Team Collaboration
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/site-demos/product-catalog">
                      <Bag className="me-2" /> Product Catalog
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/community") || isActive("/contact") ? "active fw-semibold" : ""}`}
                  to="/community"
                  aria-label="Community page"
                >
                  <Envelope className="me-1" /> Community
                </Link>
              </li>
              <li className="nav-item ms-2 d-flex align-items-center">
                <Link
                  className={`btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 ${isThemesActive ? "active" : ""}`}
                  to="/themes"
                  aria-label={`Open theme selector. Current theme ${activeTheme.name}`}
                  title={`Current theme: ${activeTheme.name}`}
                >
                  {status === "fallback" ? (
                    <ExclamationTriangleFill size={16} />
                  ) : (
                    <PaletteFill size={16} />
                  )}
                  <span>Themes</span>
                  <span className="badge text-bg-secondary">{activeTheme.name}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
