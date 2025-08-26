import React, { useState, useEffect } from "react";

function App() {
  const [numbers, setNumbers] = useState("");
  const [tree, setTree] = useState(null);
  const [previous, setPrevious] = useState([]);

  const submitNumbers = async () => {
    const res = await fetch("http://localhost:8080/process-numbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers }),
    });
    const data = await res.json();
    setTree(data);
  };

  const fetchPrevious = async () => {
    const res = await fetch("http://localhost:8080/previous-trees");
    const data = await res.json();
    setPrevious(data);
  };

  const renderTree = (node) => {
    if (!node) return null;
    return (
      <ul>
        <li>
          {node.value}
          {node.left || node.right ? (
            <div style={{ display: "flex", gap: "20px" }}>
              {renderTree(node.left)}
              {renderTree(node.right)}
            </div>
          ) : null}
        </li>
      </ul>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>BST Builder</h1>
      <input
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
        placeholder="Enter numbers (comma or space separated)"
      />
      <button onClick={submitNumbers}>Submit</button>
      <button onClick={fetchPrevious}>Show Previous</button>

      {tree && (
        <div>
          <h2>Current Tree</h2>
          {renderTree(tree)}
          <pre>{JSON.stringify(tree, null, 2)}</pre>
        </div>
      )}

      {previous.length > 0 && (
        <div>
          <h2>Previous Trees</h2>
          <ul>
            {previous.map((p) => (
              <li key={p.id}>
                {p.createdAt} — {p.inputNumbers}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
