import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const CAT_API_URL = "https://api.thecatapi.com/v1/images/search";
const CAT_API_KEY =
  "live_WO7FSuPTA6IpuZDgvZdsiFMNzHhXnnFMIQr2QG2KLS8xdL2us0wAqsJKLasgFqgI";

function useCatAPI(banList) {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCat = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(CAT_API_URL, {
        headers: {
          "x-api-key": CAT_API_KEY,
        },
      });
      setCat(response.data[0]);
    } catch (error) {
      setError("Unable to fetch cat data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCat();
  }, [banList]);

  return { cat, loading, error, refetch: fetchCat };
}

function App() {
  const [banList, setBanList] = useState([]);
  const { cat, loading, error, refetch } = useCatAPI(banList);

  const handleBanAttribute = (attribute) => {
    setBanList([...banList, attribute]);
  };

  return (
    <div className="app-container">
      <h1>Veni Vici!</h1>
      <h2>Discover cats from your wildest dreams!</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {cat && (
        <>
          <CatDisplay cat={cat} onBanAttribute={handleBanAttribute} />
          <BanList banList={banList} />
          <button onClick={() => refetch()}>Discover!</button>
        </>
      )}
    </div>
  );
}

function CatDisplay({ cat, onBanAttribute }) {
  const attributes = [
    { key: "name", value: cat.name },
    { key: "origin", value: cat.origin },
  ];

  const handleAttributeClick = (attribute) => {
    onBanAttribute(attribute);
  };

  return (
    <div>
      <h3>{cat.name}</h3>
      <img src={cat.url} alt={`A cute cat named ${cat.name}`} />
      <ul>
        {attributes.map((attribute, index) => (
          <li key={index} onClick={() => handleAttributeClick(attribute)}>
            {attribute.key}: {attribute.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BanList({ banList }) {
  return (
    <div>
      <h4>Ban List</h4>
      <ul>
        {banList.map((attribute, index) => (
          <li key={index}>
            {attribute.key}: {attribute.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
