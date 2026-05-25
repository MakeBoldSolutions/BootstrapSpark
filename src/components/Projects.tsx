import React, { useState, useEffect } from "react";
import Project from "../models/Project";
import { clearProjectsCache, getProjectsCacheInfo } from "../services/ProjectService";
import {
  ArrowRightCircle,
  Github,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { useTheme } from "../contexts/ThemeContext";

type SortOption = "name-asc" | "name-desc" | "id-asc" | "id-desc";

/**
 * Projects component displays a searchable, sortable, and paginated portfolio showcase.
 *
 * Features:
 * - Fetches project data with multi-layer caching (remote → cache → local)
 * - Search functionality across project names and descriptions
 * - Sorting by name or ID (ascending/descending)
 * - Pagination with 6 projects per page
 * - Cache management with refresh capability
 * - Responsive card-based layout with theme support
 *
 * @component
 * @example
 * ```tsx
 * <Projects />
 * ```
 *
 * @returns {JSX.Element} The rendered Projects page with portfolio showcase
 */
function Projects() {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Sorting state
  const [sortOption, setSortOption] = useState<SortOption>("id-desc");

  // Cache info state
  const [cacheInfo, setCacheInfo] = useState(getProjectsCacheInfo());

  // Load projects data
  const loadProjects = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      if (forceRefresh) {
        clearProjectsCache();
        console.log("Cache cleared, fetching fresh data...");
      }

      const loadedProjects = await Project.loadProjects();
      setProjects(loadedProjects);
      setCacheInfo(getProjectsCacheInfo());

      if (loadedProjects.length === 0) {
        setError("No projects available at the moment.");
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchTerm === "" ||
      project.p.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.d.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.keywords && project.keywords.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Sort projects based on selected sort option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.p.localeCompare(b.p);
      case "name-desc":
        return b.p.localeCompare(a.p);
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of projects section
    window.scrollTo({
      top: document.getElementById("projects-section")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // Handle sort option change
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  // Generate pagination controls
  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];

    // Previous button
    pageNumbers.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
      </li>
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      // Show current page, first, last, and one page before and after current
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        // Add ellipsis
        pageNumbers.push(
          <li key={`ellipsis-${i}`} className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Next button
    pageNumbers.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </li>
    );

    return (
      <nav aria-label="Projects pagination" className="mt-4">
        <ul className="pagination justify-content-center">{pageNumbers}</ul>
      </nav>
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    loadProjects(true);
  };

  if (loading) {
    return (
      <section className="py-5" id="projects-section">
        <div className="container">
          <h2 className="text-center mb-5">My Projects</h2>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5" id="projects-section">
        <div className="container">
          <h2 className="text-center mb-5">My Projects</h2>
          <div className={`alert ${theme === "dark" ? "alert-dark" : "alert-danger"} text-center`}>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <br />
            <button
              className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-primary"} mt-2`}
              onClick={() => loadProjects(true)}
            >
              <ArrowClockwise className="me-1" /> Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-5" id="projects-section">
        <div className="container">
          <h2 className="text-center mb-5">My Projects</h2>
          <div className={`alert ${theme === "dark" ? "alert-dark" : "alert-info"}`}>
            <i className="bi bi-info-circle me-2"></i>
            No projects available at the moment.
            <button
              className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-primary"} ms-2`}
              onClick={() => loadProjects(true)}
            >
              <ArrowClockwise className="me-1" /> Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5" id="projects-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="mb-0">My Projects</h2>
          <div className="d-flex align-items-center gap-3">
            {cacheInfo.hasCache && (
              <small className="text-muted">
                Last updated: {cacheInfo.lastUpdated?.toLocaleString()}({cacheInfo.source})
              </small>
            )}
            <button
              className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-primary"}`}
              onClick={handleRefresh}
              title="Refresh projects from server"
            >
              <ArrowClockwise className="me-1" /> Refresh
            </button>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="row mb-4">
          <div className="col-md-8 mb-3 mb-md-0">
            <div className="input-group">
              <span
                className={`input-group-text ${theme === "dark" ? "bg-dark text-light border-secondary" : "bg-light"}`}
              >
                <Search />
              </span>
              <input
                type="text"
                className={`form-control ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className={`form-select ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              aria-label="Sort projects"
            >
              <option value="id-desc">Newest First</option>
              <option value="id-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Project Stats */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-body-secondary">
            Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, sortedProjects.length)}{" "}
            of {sortedProjects.length} projects
          </small>
          {totalPages > 1 && (
            <small className="text-body-secondary">
              Page {currentPage} of {totalPages}
            </small>
          )}
        </div>

        {/* Project Cards */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {currentProjects.map((project: Project) => (
            <div className="col" key={project.id}>
              <div
                className={`card h-100 shadow-sm hover-shadow transition ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
              >
                <img
                  src={project.getThumbnailUrl()}
                  className="card-img-top img-project"
                  alt={project.formatTitle()}
                />
                <div className="card-body">
                  <h5 className="card-title">{project.formatTitle()}</h5>
                  {project.category && (
                    <span
                      className={`badge mb-2 ${theme === "dark" ? "bg-secondary" : "bg-light text-dark border"}`}
                    >
                      {project.category}
                    </span>
                  )}
                  <p
                    className={`card-text small ${theme === "dark" ? "text-light-emphasis" : "text-body-secondary"}`}
                  >
                    {project.formatDescription()}
                  </p>
                </div>
                <div
                  className={`card-footer border-top-0 d-flex justify-content-between ${theme === "dark" ? "bg-dark" : "bg-white"}`}
                >
                  <a
                    href={project.formatLink()}
                    className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-primary"} d-flex align-items-center`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Site <ArrowRightCircle className="ms-1" />
                  </a>
                  {project.repository?.url && (
                    <a
                      href={project.repository.url}
                      className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"} d-flex align-items-center`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="me-1" /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {renderPaginationControls()}

        {sortedProjects.length === 0 && (
          <div className={`alert ${theme === "dark" ? "alert-dark" : "alert-warning"} mt-4`}>
            <i className="bi bi-exclamation-triangle me-2"></i>
            No projects match your search criteria. Try different terms.
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
