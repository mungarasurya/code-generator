import fetch from "node-fetch";

const GEMINI_API_KEY = AIzaSyBznZcm_wiIx2nM74Ajuc97R_i5gaImIQU;

export async function generateTestSummaries(files) {
    const prompt = `
You are an AI generating test case ideas. 
Given the following files:
${files.map(f => f.name + ":\n" + f.content).join("\n\n")}
Return a JSON array of test case summaries.
`;
    return callGeminiAPI(prompt);
}

export async function generateTestCode(summary) {
    const prompt = `Generate test case code for: ${summary}`;
    return callGeminiAPI(prompt);
}

async function callGeminiAPI(prompt) {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No output";
}
