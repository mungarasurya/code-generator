import React from "react";

export default function CodeViewer({ code }) {
    return (
        <div>
            <h2>Generated Code</h2>
            <pre>{code}</pre>
        </div>
    );
}
