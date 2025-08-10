import React from "react";
import axios from "axios";

export default function SummaryList({ summaries, setCode }) {
    const generateCode = async (summary) => {
        const res = await axios.post("http://localhost:5000/api/ai/code", { summary });
        setCode(res.data.code);
    };

    return (
        <div>
            <h2>Test Case Summaries</h2>
            {summaries.map((s, idx) => (
                <div key={idx}>
                    <p>{s}</p>
                    <button onClick={() => generateCode(s)}>Generate Code</button>
                </div>
            ))}
        </div>
    );
}
