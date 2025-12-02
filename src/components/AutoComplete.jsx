import React, { useState, useEffect, useRef, useTransition } from "react";

// Przykładowy komponent AutoComplete dla miast
const AutoComplete = () => {
  const [query, setQuery] = useState(""); // Wartość wpisana przez użytkownika
  const [suggestions, setSuggestions] = useState([]); // Lista sugestii z API
  const [selectedIndex, setSelectedIndex] = useState(-1); // Indeks wybranego elementu (do nawigacji klawiaturą)
  const debounceRef = useRef(null); // Ref do timera debounce
  const inputRef = useRef(null); // Ref do inputa
  const listRef = useRef(null); // Ref do listy sugestii
  const ApiUrl = import.meta.env.VITE_API_URL; // URL API z pliku .env

  const [isPending, startTransition] = useTransition(); // Nowy hook do zarządzania przejściami

  // Funkcja do pobierania sugestii z API (przykład z Nominatim OpenStreetMap)
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `${ApiUrl}?format=json&city=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      const cities = data.map((item) => item.display_name);
      startTransition(() => {
        setSuggestions(cities);
      });
    } catch (error) {
      console.error("Błąd podczas pobierania sugestii:", error);
      setSuggestions([]);
    }
  };

  // Debounce: opóźnienie wywoływania fetch o 300ms
  const debouncedFetch = (searchQuery) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        fetchSuggestions(searchQuery);
      });
    }, 300);
  };

  // Obsługa zmiany w input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1); // Resetuj wybór
    debouncedFetch(value);
  };

  // Obsługa nawigacji klawiaturą
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  // Wybór sugestii
  const handleSelect = (selectedCity) => {
    setQuery(selectedCity);
    setSuggestions([]);
    setSelectedIndex(-1);
    // Tutaj możesz dodać logikę, np. wysłanie formularza lub inne akcje
    console.log("Wybrano:", selectedCity);
  };

  // Highlight: podświetlenie pasujących części tekstu
  const highlightMatch = (text) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      )
    );
  };

  // Zamknij listę po kliknięciu poza komponentem
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        id="city"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Wpisz nazwę miasta..."
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />
      {isPending && <div>Ładowanie...</div>}
      {suggestions.length > 0 && (
        <ul
          ref={listRef}
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
            position: "absolute",
            width: "100%",
            background: "white",
            zIndex: 1,
          }}
        >
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSelect(city)}
              style={{
                padding: "8px",
                cursor: "pointer",
                background: index === selectedIndex ? "#f0f0f0" : "white",
              }}
            >
              {highlightMatch(city)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
