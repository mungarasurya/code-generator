import React, { useState } from "react";
import axios from "axios";

export default function GitHubLogin({ setFiles }) {
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [token, setToken] = useState("");

    const fetchFiles = async () => {
        const res = await axios.get("http://localhost:5000/api/github/files", {
            params: { owner, repo, token }
        });
        setFiles(res.data);
    };

    return (
        <div className="mb-4">
            <input placeholder="Owner" value={owner} onChange={e => setOwner(e.target.value)} />
            <input placeholder="Repo" value={repo} onChange={e => setRepo(e.target.value)} />
            <input placeholder="GitHub Token" value={token} onChange={e => setToken(e.target.value)} />
            <button onClick={fetchFiles}>Fetch Files</button>
        </div>
    );
}
