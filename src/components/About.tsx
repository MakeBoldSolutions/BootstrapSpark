import React, { useState, useEffect } from "react";
import {
  JournalText,
  BookmarkStar,
  Github,
  ArrowRight,
  LightningCharge,
  Braces,
  FileEarmarkCode,
  Gear,
  Calendar3,
  InfoCircle,
} from "react-bootstrap-icons";
import { Alert, Spinner } from "react-bootstrap";
import { format } from "date-fns";
import profile from "../data/profile.json";
import { fetchArticles, Article, getArticleUrl } from "../services/ArticleService";
import { useSEO } from "../contexts/useSEO";
import "../styles/About.css"; // Import the external CSS file

/**
 * About component displays personal profile information and recent BootstrapSpark articles.
 *
 * Features:
 * - Displays profile information from JSON configuration
 * - Fetches and shows up to 3 most recent BootstrapSpark articles from RSS feed
 * - Handles loading and error states gracefully
 * - Responsive design with icon-based navigation
 *
 * @component
 * @example
 * ```tsx
 * <About />
 * ```
 *
 * @returns {JSX.Element} The rendered About page with profile and articles
 */
const About: React.FC = () => {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setTitle, setDescription } = useSEO();

  // Set page-specific SEO information
  useEffect(() => {
    setTitle("About | BootstrapSpark");
    setDescription(
      "Learn about BootstrapSpark - a modern SPA built with React, TypeScript and Bootstrap showcase examples."
    );
  }, [setTitle, setDescription]);

  useEffect(() => {
    const loadRecentArticles = async () => {
      try {
        setLoading(true);

        const articles = await fetchArticles();

        // Sort by publishedDate (newest first) and take up to 3
        const sorted = [...articles]
          .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
          .slice(0, 3);

        setRecentArticles(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Error loading recent articles:", err);
        setError(err instanceof Error ? err.message : "Unknown error loading articles");
        setLoading(false);
      }
    };

    loadRecentArticles();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (!isNaN(date.getTime())) {
        return format(date, "MMMM d, yyyy");
      }

      return "Unknown date";
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Unknown date";
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="display-5 fw-bold mb-3">{profile.name}</h1>
            <p className="lead mb-4 mx-auto">{profile.introduction}</p>
            <div className="d-flex justify-content-center gap-2 mb-4">
              <a
                href="https://github.com/markhazleton/BootstrapSpark"
                className="btn btn-outline-primary d-inline-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="me-2" size={18} /> View on GitHub
              </a>
              <a
                href="https://markhazleton.com/webspark"
                className="btn btn-outline-secondary d-inline-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <JournalText className="me-2" size={18} /> WebSpark Suite
              </a>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Left Column */}
          <div className="col-lg-6 mb-4">
            {/* About Section */}
            <div className="card h-100 shadow-sm border-theme">
              <div className="card-body">
                <h2 className="h4 mb-4 d-flex align-items-center border-bottom pb-3">
                  <BookmarkStar className="text-primary me-2" /> About BootstrapSpark
                </h2>
                <p className="lead mb-3">
                  BootstrapSpark is the latest addition to the WebSpark suite-an elegant,
                  high-performance single-page application (SPA) built with React that showcases how
                  dynamic web frontends can be powered by robust APIs.
                </p>

                <p className="mb-4">
                  This app demonstrates how modern React development practices can be used to build
                  dynamic, maintainable, and extensible web applications. BootstrapSpark consumes
                  data and services from the existing .NET-powered WebSpark APIs, offering a
                  seamless integration between frontend and backend technologies.
                </p>

                <div className="card bg-theme-alt mb-4">
                  <div className="card-body">
                    <h3 className="h5 mb-3">🔍 Purpose</h3>
                    <p className="mb-2">
                      BootstrapSpark bridges the gap between backend services and rich user
                      experiences. While WebSpark's previous apps demonstrate server-side
                      capabilities, BootstrapSpark focuses on:
                    </p>
                    <ul className="mb-0">
                      <li>Demonstrating real-time data binding and dynamic routing</li>
                      <li>Showcasing React + Vite for rapid frontend development</li>
                      <li>Utilizing modern React libraries and state management</li>
                      <li>Surfacing data from various WebSpark APIs</li>
                    </ul>
                  </div>
                </div>

                <div className="card bg-theme-alt">
                  <div className="card-body">
                    <h3 className="h5 mb-3">💡 Design Philosophy</h3>
                    <p className="mb-3">BootstrapSpark follows a clean separation of concerns:</p>
                    <ul className="mb-3">
                      <li>UI logic lives entirely in the React frontend</li>
                      <li>
                        Data access, business rules, and caching are handled by the WebSpark API
                      </li>
                      <li>Layout and navigation are declaratively defined and driven by data</li>
                    </ul>
                    <p className="mb-0">
                      It reflects the core philosophy of WebSpark:{" "}
                      <strong>"Show, not just tell."</strong> BootstrapSpark is built to be
                      dissected, forked, and extended for your own projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-6">
            {/* Technical Highlights Section */}
            <div className="card shadow-sm border-theme mb-4">
              <div className="card-body">
                <h3 className="h4 mb-4 d-flex align-items-center border-bottom pb-3">
                  <Gear className="text-primary me-2" /> Technical Highlights
                </h3>

                <div className="card bg-theme-alt mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h4 className="h6 mb-2">Frontend Stack:</h4>
                        <ul className="mb-0 small">
                          <li>React 18+</li>
                          <li>Vite for ultra-fast bundling</li>
                          <li>TypeScript</li>
                          <li>React Router</li>
                          <li>Axios for API communication</li>
                        </ul>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h4 className="h6 mb-2">Backend Integration:</h4>
                        <ul className="mb-0 small">
                          <li>RESTful APIs from WebSpark</li>
                          <li>Shared data models</li>
                          <li>Dynamic content rendering</li>
                          <li>SignalR for real-time updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-primary text-light d-flex align-items-center p-2">
                    <Braces className="me-1" /> React 18+
                  </span>
                  <span className="badge bg-info text-dark d-flex align-items-center p-2">
                    <FileEarmarkCode className="me-1" /> TypeScript
                  </span>
                  <span className="badge bg-success text-light d-flex align-items-center p-2">
                    <LightningCharge className="me-1" /> Vite
                  </span>
                </div>

                <div className="card bg-theme-alt mb-4">
                  <div className="card-body">
                    <h3 className="h5 mb-3">🎯 Use Cases</h3>
                    <p className="mb-0">BootstrapSpark is ideal for:</p>
                    <ul className="mb-0">
                      <li>Developers looking to see how to consume .NET APIs in a React app</li>
                      <li>
                        Teams modernizing legacy frontends with React while preserving .NET backends
                      </li>
                      <li>
                        Students and professionals learning modern frontend integration patterns
                      </li>
                    </ul>
                  </div>
                </div>

                {/* BootstrapSpark Articles Section */}
                <h3 className="h5 mb-3 border-top pt-4">Recent Articles from Mark Hazleton</h3>

                {loading && (
                  <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border" role="status" size="sm" className="me-2" />
                    <span>Loading articles...</span>
                  </div>
                )}

                {error && (
                  <Alert variant="warning" className="d-flex align-items-center">
                    <InfoCircle className="me-2 flex-shrink-0" />
                    <div className="small">Couldn't load articles: {error}</div>
                  </Alert>
                )}

                {!loading && !error && recentArticles.length === 0 && (
                  <Alert variant="info" className="d-flex align-items-center">
                    <InfoCircle className="me-2 flex-shrink-0" />
                    <div className="small">No articles found. Check back soon for updates!</div>
                  </Alert>
                )}

                {!loading && !error && recentArticles.length > 0 && (
                  <div className="list-group list-group-flush">
                    {recentArticles.map((article, index) => (
                      <a
                        key={index}
                        href={getArticleUrl(article.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-0 py-2"
                        title={article.name}
                      >
                        <div className="d-flex align-items-center">
                          <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-3 article-badge">
                            {index + 1}
                          </span>
                          <div>
                            <h5 className="h6 mb-0 small text-theme">{article.name}</h5>
                            <small className="text-theme-muted d-flex align-items-center mt-1">
                              <Calendar3 className="me-1" size={12} />{" "}
                              {formatDate(article.publishedDate)}
                            </small>
                          </div>
                        </div>
                        <ArrowRight className="text-primary" size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
