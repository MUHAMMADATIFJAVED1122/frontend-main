import React, { useState } from "react";
import axios from "axios";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public"); // default public
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userId = localStorage.getItem("userId"); // assume you store it after login
      const res = await axios.post("http://localhost:3000/repo/create", {
        name,
        description,
        visibility, // sending "public"/"private"
        owner: userId,
      });

      if (res.data) {
        setSuccess("✅ Repository created successfully!");
        setName("");
        setDescription("");
        setVisibility("public");
      }
    } catch (err) {
      console.error("Error creating repository:", err);
      setError("❌ Failed to create repository. Please try again.");
    }
  };

  return (
    <div className="create-repo">
      <h2>Create New Repository</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Repository Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button type="submit">Create Repository</button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateRepo;
