import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starredRepos, setStarredRepos] = useState([]); // track starred repos

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      if (!userId) {
        console.warn("⚠️ No user logged in");
        setRepositories([]);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        const repos = data.repositories || [];
        setRepositories(repos);
      } catch (err) {
        console.error("❌ Error while fetching repositories:", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("❌ Error while fetching suggested repositories:", err);
        setSuggestedRepositories([]);
      }
    };

    Promise.all([fetchRepositories(), fetchSuggestedRepositories()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  // Star a repository
  const handleStarRepo = (repo) => {
    if (!starredRepos.find((r) => r._id === repo._id)) {
      setStarredRepos([...starredRepos, repo]);
    }
  };

  if (loading) return <p>Loading Dashboard...</p>;

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.length > 0 ? (
            suggestedRepositories.map((repo) => (
              <div key={repo._id} className="suggested-repo">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <button onClick={() => handleStarRepo(repo)}>⭐ Star</button>
              </div>
            ))
          ) : (
            <p>No suggested repositories</p>
          )}
        </aside>

        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.length > 0 ? (
            searchResults.map((repo) => (
              <div key={repo._id} className="user-repo">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          ) : (
            <p>No repositories found</p>
          )}
        </main>

        <aside>
          <h3>Starred Repositories</h3>
          {starredRepos.length > 0 ? (
            starredRepos.map((repo) => (
              <div key={repo._id} className="starred-repo">
                <h4>{repo.name}</h4>
              </div>
            ))
          ) : (
            <p>No starred repositories yet</p>
          )}
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
