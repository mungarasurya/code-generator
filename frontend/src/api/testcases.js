// src/api/testcases.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// 1. Generate AI-based test case summaries
export const generateTestCaseSummary = async (fileContent) => {
  const res = await axios.post(`${API_BASE}/testcases/summary`, { fileContent });
  return res.data;
};

// 2. Generate test code for a given file
export const generateTestCode = async (fileContent, language) => {
  const res = await axios.post(`${API_BASE}/testcases/code`, {
    fileContent,
    language,
  });
  return res.data;
};

// 3. Create Pull Request with generated tests
export const createPullRequest = async (owner, repo, branchName, commitMessage, files) => {
  const res = await axios.post(`${API_BASE}/testcases/create-pr`, {
    owner,
    repo,
    branchName,
    commitMessage,
    files, // { filename: content }
  });
  return res.data;
};
