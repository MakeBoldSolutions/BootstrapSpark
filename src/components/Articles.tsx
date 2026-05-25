import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Badge, Form, InputGroup, Pagination } from "react-bootstrap";
import {
  JournalRichtext,
  Calendar3,
  ArrowUpRightSquare,
  Search,
  ExclamationTriangle,
  InfoCircle,
  SortDown,
  SortUp,
} from "react-bootstrap-icons";
import { format } from "date-fns";
import {
  fetchArticles,
  Article,
  getArticleUrl,
  getArticleImageUrl,
} from "../services/ArticleService";

type SortDirection = "newest" | "oldest";

/**
 * Articles component displays a searchable, filterable, and paginated list of RSS articles.
 *
 * Features:
 * - Fetches articles from RSS feed with caching
 * - Search functionality across titles and content
 * - Category filtering
 * - Sorting by date (newest/oldest)
 * - Pagination with configurable items per page
 * - Data source and cache status indicators
 *
 * @component
 * @example
 * ```tsx
 * <Articles />
 * ```
 *
 * @returns {JSX.Element} The rendered Articles page with search, filter, and pagination controls
 */
const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 6;

  // Sorting state
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        setLoading(true);
        setDebugInfo("Attempting to fetch articles...");

        // Use our service to fetch articles from markhazleton.com/articles.json
        const articleData = await fetchArticles();

        // Only update state if component is still mounted
        if (!isMounted) return;

        setDebugInfo(`Successfully loaded ${articleData.length} articles`);

        // Extract unique categories
        const categorySet = new Set<string>(["all"]);
        articleData.forEach((article) => {
          if (article.Section) {
            categorySet.add(article.Section);
          }
        });

        setArticles(articleData);
        setCategories(Array.from(categorySet));

        // Check localStorage for metadata
        const articlesLastUpdated = localStorage.getItem("articlesLastUpdated");

        if (articlesLastUpdated) {
          setLastUpdated(articlesLastUpdated);
        }

        setLoading(false);
      } catch (err) {
        // Only update state if component is still mounted
        if (!isMounted) return;

        console.error("Error loading articles:", err);
        setError(err instanceof Error ? err.message : "Unknown error loading articles");
        setDebugInfo(
          `Error loading articles: ${err instanceof Error ? err.message : "Unknown error"}`
        );
        setLoading(false);
      }
    };

    loadArticles();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      // Check if the date is valid before formatting
      if (!isNaN(date.getTime())) {
        return format(date, "MMMM d, yyyy");
      }

      return "Unknown date";
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Unknown date";
    }
  };

  // Filter articles based on search term and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm === "" ||
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || article.Section === filter;

    return matchesSearch && matchesFilter;
  });

  // Sort articles by date
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const dateA = new Date(a.publishedDate).getTime();
    const dateB = new Date(b.publishedDate).getTime();

    return sortDirection === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the articles section
    window.scrollTo({
      top: document.getElementById("articles-section")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // Handle sort direction change
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "newest" ? "oldest" : "newest");
  };

  // Force refresh the RSS feed
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo("Refreshing RSS feed...");

      // Clear cached data to force a fresh fetch
      localStorage.removeItem("cachedArticlesData");
      localStorage.removeItem("articlesLastUpdated");
      localStorage.removeItem("articlesCount");

      const articleData = await fetchArticles();

      setDebugInfo(`Successfully refreshed ${articleData.length} articles`);

      // Extract unique categories
      const categorySet = new Set<string>(["all"]);
      articleData.forEach((article) => {
        if (article.Section) {
          categorySet.add(article.Section);
        }
      });

      setArticles(articleData);
      setCategories(Array.from(categorySet));

      // Check localStorage for updated metadata
      const articlesLastUpdated = localStorage.getItem("articlesLastUpdated");

      if (articlesLastUpdated) {
        setLastUpdated(articlesLastUpdated);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error refreshing articles:", err);
      setError(err instanceof Error ? err.message : "Unknown error refreshing articles");
      setDebugInfo(
        `Error refreshing articles: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-theme" id="articles-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <h2 className="mb-0 d-flex align-items-center text-theme">
              <JournalRichtext size={28} className="text-primary me-2" />
              Articles from MarkHazleton.com
            </h2>
            <p className="text-theme-muted mt-2">
              Explore insights from Mark's personal blog
              {lastUpdated && (
                <small className="ms-2">(Last updated: {formatDate(lastUpdated)})</small>
              )}
            </p>
            {debugInfo && (
              <div className="small text-theme-muted mt-1">
                <div>
                  <strong>Status:</strong> {debugInfo}
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <div className="d-flex gap-2 mb-3">
              <InputGroup className="flex-grow-1">
                <InputGroup.Text className="bg-theme-alt border-theme">
                  <Search className="text-theme" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to page 1 when searching
                  }}
                  className="bg-theme text-theme border-theme"
                />
              </InputGroup>
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={toggleSortDirection}
                title={`Sort by ${sortDirection === "newest" ? "oldest" : "newest"} first`}
              >
                {sortDirection === "newest" ? (
                  <>
                    <SortDown className="me-1" /> Newest
                  </>
                ) : (
                  <>
                    <SortUp className="me-1" /> Oldest
                  </>
                )}
              </button>
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={handleRefresh}
                disabled={loading}
                title="Refresh articles from source"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Display article count for better visibility */}
            {articles.length > 0 && (
              <small className="d-block mb-2 text-theme-muted">
                <strong>Total articles:</strong> {articles.length}
              </small>
            )}

            {categories.length > 1 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {categories.map((category, index) => (
                  <Badge
                    key={index}
                    bg={filter === category ? "primary" : "secondary"}
                    className={`py-2 px-3 ${filter !== category ? "bg-opacity-25" : ""}`}
                    onClick={() => {
                      setFilter(category);
                      setCurrentPage(1); // Reset to page 1 when filter changes
                    }}
                    role="button"
                    aria-pressed={filter === category ? "true" : "false"}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-theme-muted">Loading articles...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <ExclamationTriangle className="me-2 flex-shrink-0" />
            <div>{error}</div>
          </Alert>
        )}

        {!loading && !error && sortedArticles.length === 0 && (
          <Alert variant="info" className="d-flex align-items-center">
            <InfoCircle className="me-2 flex-shrink-0" />
            <div>No articles found matching your search criteria.</div>
          </Alert>
        )}

        {!loading && !error && sortedArticles.length > 0 && (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
              {currentArticles.map((article, index) => (
                <div className="col" key={index}>
                  <Card className="h-100 shadow-sm border-theme transition">
                    <Card.Img
                      variant="top"
                      src={getArticleImageUrl(article.image_metadata.thumbnail)}
                      alt={article.name}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        borderBottom: "1px solid var(--bs-border-color)",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <Card.Body className="bg-card">
                      <Card.Title className="mb-3">
                        <a
                          href={getArticleUrl(article.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme text-decoration-none stretched-link"
                        >
                          {article.name}
                        </a>
                      </Card.Title>

                      {article.description && (
                        <Card.Text className="text-theme-muted mb-3 small">
                          {article.description.length > 150
                            ? `${article.description.substring(0, 150)}...`
                            : article.description}
                        </Card.Text>
                      )}

                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="d-flex align-items-center text-theme-muted small">
                          <Calendar3 className="me-1" />
                          {formatDate(article.publishedDate)}
                        </div>

                        <div className="d-flex gap-1 align-items-center">
                          {article.estimatedReadTime > 0 && (
                            <Badge bg="info" className="bg-opacity-25 py-1 px-2 text-theme-alt">
                              {article.estimatedReadTime} min
                            </Badge>
                          )}
                          {article.Section && (
                            <Badge
                              bg="secondary"
                              className="bg-opacity-25 py-1 px-2 text-theme-alt"
                            >
                              {article.Section}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer className="border-top border-theme bg-card">
                      <small className="text-theme-muted d-flex align-items-center justify-content-end">
                        Read more <ArrowUpRightSquare className="ms-1" size={12} />
                      </small>
                    </Card.Footer>
                  </Card>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="pagination-theme">
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {/* Show limited page numbers for better UX */}
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, first page, last page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <Pagination.Ellipsis key={pageNumber} />;
                    }

                    return null;
                  })}

                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-theme-muted small">
                Showing {indexOfFirstArticle + 1}-
                {Math.min(indexOfLastArticle, sortedArticles.length)} of {sortedArticles.length}{" "}
                articles
              </div>
              <div className="text-theme-muted small">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Article Component Explanation */}
      <div className="container mt-5 pt-3 border-top border-theme">
        <div className="row">
          <div className="col-12">
            <h3 className="h4 mb-4 d-flex align-items-center text-theme">
              <InfoCircle className="text-primary me-2" />
              How This Articles Component Works
            </h3>

            <div className="card shadow-sm mb-4 border-theme">
              <div className="card-header bg-theme-alt">
                <h4 className="h5 mb-0 text-theme">Component Overview</h4>
              </div>
              <div className="card-body bg-card">
                <p className="text-theme">
                  This Articles component provides a dynamic, responsive interface for fetching and
                  displaying blog posts from markhazleton.com/articles.json. It demonstrates several
                  modern React patterns and techniques:
                </p>

                <div className="row">
                  <div className="col-md-6">
                    <h5 className="h6 mb-2 text-theme">Key Features:</h5>
                    <ul className="small mb-3 text-theme-alt">
                      <li>Dynamic fetching with error handling and fallback mechanisms</li>
                      <li>Client-side search functionality with instant filtering</li>
                      <li>Category filtering via interactive badges</li>
                      <li>Responsive pagination with dynamic page navigation</li>
                      <li>Sorting capabilities (newest/oldest)</li>
                      <li>Dark/light theme integration</li>
                      <li>Data caching to minimize unnecessary API calls</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5 className="h6 mb-2 text-theme">Technologies Used:</h5>
                    <ul className="small text-theme-alt">
                      <li>React Hooks for state management (useState, useEffect)</li>
                      <li>Bootstrap/React Bootstrap for UI components</li>
                      <li>Fetch API for data retrieval</li>
                      <li>LocalStorage for caching and persistence</li>
                      <li>date-fns for date formatting</li>
                      <li>Context API for theme management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mb-4 border-theme">
              <div className="card-header bg-theme-alt">
                <h4 className="h5 mb-0 text-theme">Data Flow</h4>
              </div>
              <div className="card-body bg-card">
                <ol className="mb-3 text-theme">
                  <li className="mb-2">
                    <strong>Fetching Data:</strong> The component loads data using the{" "}
                    <code className="bg-theme-alt text-theme-alt px-1 rounded">
                      fetchArticles()
                    </code>{" "}
                    service, which retrieves article data from markhazleton.com/articles.json via a
                    CORS proxy, with localStorage caching for performance.
                  </li>
                  <li className="mb-2">
                    <strong>State Management:</strong> Multiple state variables track different
                    aspects of the component:
                    <ul className="small mt-1 text-theme-alt">
                      <li>
                        <code className="bg-theme-alt text-theme-alt px-1 rounded">articles</code>:
                        The main data store for all retrieved articles
                      </li>
                      <li>
                        <code className="bg-theme-alt text-theme-alt px-1 rounded">loading</code>:
                        Tracks loading state for UI feedback
                      </li>
                      <li>
                        <code className="bg-theme-alt text-theme-alt px-1 rounded">error</code>:
                        Captures any errors during data fetching
                      </li>
                      <li>
                        <code className="bg-theme-alt text-theme-alt px-1 rounded">searchTerm</code>{" "}
                        & <code className="bg-theme-alt text-theme-alt px-1 rounded">filter</code>:
                        Control content filtering
                      </li>
                      <li>
                        <code className="bg-theme-alt text-theme-alt px-1 rounded">
                          currentPage
                        </code>{" "}
                        &{" "}
                        <code className="bg-theme-alt text-theme-alt px-1 rounded">
                          sortDirection
                        </code>
                        : Control content presentation
                      </li>
                    </ul>
                  </li>
                  <li className="mb-2">
                    <strong>Filtering & Sorting:</strong> The component combines multiple filters
                    (search text and category) with sorting logic to display the most relevant
                    subset of articles.
                  </li>
                  <li className="mb-2">
                    <strong>Pagination:</strong> Articles are divided into pages for better
                    performance and user experience. The pagination controls dynamically adjust
                    based on the current position.
                  </li>
                </ol>
              </div>
            </div>

            <div className="card shadow-sm mb-4 border-theme">
              <div className="card-header bg-theme-alt">
                <h4 className="h5 mb-0 text-theme">Behind the Scenes</h4>
              </div>
              <div className="card-body bg-card">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="h6 mb-2 text-theme">Caching Strategy</h5>
                    <p className="small text-theme-alt">
                      The component implements a sophisticated caching strategy to minimize API
                      calls and provide a smooth user experience:
                    </p>
                    <ul className="small text-theme-alt">
                      <li>RSS data is cached in localStorage after fetching</li>
                      <li>Timestamps track when data was last refreshed</li>
                      <li>Users can manually force a refresh if needed</li>
                      <li>Debug information shows the data source and status</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5 className="h6 mb-2 text-theme">Error Handling</h5>
                    <p className="small text-theme-alt">
                      Robust error handling ensures users aren't left with a broken experience:
                    </p>
                    <ul className="small text-theme-alt">
                      <li>Multi-level fallback mechanisms for data loading</li>
                      <li>Clear error messages with friendly UI presentation</li>
                      <li>Debug information for troubleshooting</li>
                      <li>Safe date parsing with fallbacks for malformed dates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-theme">
              <div className="card-header bg-theme-alt">
                <h4 className="h5 mb-0 text-theme">Component Architecture</h4>
              </div>
              <div className="card-body bg-card">
                <p className="small text-theme">
                  This component follows several React best practices:
                </p>
                <ul className="small mb-3 text-theme-alt">
                  <li>
                    <strong>Separation of concerns:</strong> UI rendering is separated from data
                    fetching
                  </li>
                  <li>
                    <strong>Conditional rendering:</strong> Different UI states (loading, error,
                    empty results) are handled elegantly
                  </li>
                  <li>
                    <strong>Memoization:</strong> Expensive filtering and sorting operations are
                    performed efficiently
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Proper ARIA attributes and semantic HTML
                    structure
                  </li>
                  <li>
                    <strong>Responsive design:</strong> Adapts to different screen sizes with
                    Bootstrap's grid system
                  </li>
                </ul>
                <p className="small text-theme">
                  The architecture prioritizes user experience by providing immediate feedback
                  during loading, clear error messages when things go wrong, and an intuitive
                  interface for interacting with the content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;
