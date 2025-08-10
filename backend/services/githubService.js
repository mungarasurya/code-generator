import fetch from "node-fetch";

export async function listFilesFromRepo(owner, repo, token, path = "") {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json"
    };

    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    let allFiles = [];

    for (const item of data) {
        if (item.type === "file") {
            allFiles.push({
                name: item.name,
                path: item.path,
                sha: item.sha,
                download_url: item.download_url,
                size: item.size
            });
        } else if (item.type === "dir") {
            const subFiles = await listFilesFromRepo(owner, repo, token, item.path);
            allFiles = allFiles.concat(subFiles);
        }
    }

    return allFiles;
}
