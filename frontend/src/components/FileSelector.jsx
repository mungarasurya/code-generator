import React, { useState } from "react";
import axios from "axios";

export default function FileSelector({ files, setSummaries }) {
    const [selected, setSelected] = useState([]);

    const toggleFile = (file) => {
        setSelected(prev => 
            prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
        );
    };

    const generateSummaries = async () => {
        const fileContents = selected.map(f => ({ name: f.name, content: f.content || "" }));
        const res = await axios.post("http://localhost:5000/api/ai/summaries", { files: fileContents });
        setSummaries(res.data.summaries);
    };

    return (
        <div>
            <h2>Files:</h2>
            {files.map((f, idx) => (
                <div key={idx}>
                    <input type="checkbox" onChange={() => toggleFile(f)} />
                    {f.name}
                </div>
            ))}
            <button onClick={generateSummaries}>Generate Summaries</button>
        </div>
    );
}
