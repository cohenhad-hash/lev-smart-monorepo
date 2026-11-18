import React, { useEffect, useState } from "react";

function App() {
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((response) => response.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus("Backend connection failed"));
  }, []);

  return (
    <main>
      <h1>LEV Smart</h1>
      <p>Frontend is running!</p>
      <p>Backend status: {apiStatus}</p>
    </main>
  );
}

export default App;

