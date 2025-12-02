# React AutoComplete Component

Ten projekt zawiera komponent React o nazwie `AutoComplete`, który implementuje autouzupełnianie dla nazw miast. Komponent obsługuje debounce, pobieranie danych z API, nawigację klawiaturą oraz podświetlenie pasujących wyników. Dodatkowo, dołączony jest komponent `Form`, który integruje `AutoComplete` w prostym formularzu, oraz przykładowy plik HTML do szybkiego testowania.

## Funkcje
- **Debounce**: Opóźnienie zapytań do API o 300ms, aby uniknąć nadmiernych requestów podczas pisania.
- **API Fetch**: Pobieranie sugestii z API Nominatim (OpenStreetMap) dla nazw miast.
- **Keyboard Navigation**: Obsługa strzałek (w górę/dół), Enter (wybór), Escape (zamknięcie listy).
- **Highlight Wyników**: Podświetlenie pasujących fragmentów tekstu w sugestiach.
- **useTransition**: Użyty do poprawy responsywności UI podczas ładowania danych (React 18+).
- **Integracja z Formularzem**: Przykładowy formularz z walidacją i obsługą submit.
- **Obsługa Kliknięcia Poza Komponentem**: Zamknięcie listy sugestii po kliknięciu poza inputem/listą.

## Wymagania
- React 18+ (zalecany React 19 dla pełnej kompatybilności z useTransition).
- Brak zewnętrznych zależności (wszystko wbudowane w React).
- Przeglądarka wspierająca nowoczesny JavaScript.

## Instalacja
1. Sklonuj repozytorium:
   ```
   git clone <URL_REPOZYTORIUM>
   cd <NAZWA_FOLDERU>
   ```
2. Zainstaluj zależności (jeśli używasz create-react-app lub podobnego):
   ```
   npm install
   ```
   (Projekt nie wymaga dodatkowych paczek poza Reactem).

## Użycie
### Komponent AutoComplete
Zapisz w pliku `AutoComplete.jsx`:
```jsx
// Kod komponentu AutoComplete (wklej z poprzednich przykładów)
```

### Komponent Form
Zapisz w pliku `Form.jsx`:
```jsx
// Kod komponentu Form (wklej z poprzednich przykładów)
```

### Uruchomienie w Aplikacji React
W pliku `App.jsx`:
```jsx
import React from 'react';
import Form from './Form';

const App = () => <Form />;

export default App;
```

Uruchom aplikację:
```
npm start
```

### Testowanie Lokalne bez Budowania
Użyj pliku `index.html` z CDN React (wklej kod z poprzedniego przykładu). Otwórz plik w przeglądarce, aby przetestować formularz i autocomplete.

## Przykłady
- Wpisz "War" w pole miasta – sugestie jak "Warszawa" powinny się pojawić po debounce.
- Użyj strzałek do nawigacji, Enter do wyboru.
- Submit formularza sprawdzi walidację i zaloguje dane.

## Uwagi
- **API**: Używa publicznego API Nominatim – w produkcji dodaj obsługę CORS lub proxy, jeśli potrzeba. Ogranicz limity zapytań, aby uniknąć blokad.
- **Modyfikacje**: Możesz zmienić API na inne (np. Google Places) lub dostosować debounce time.
- **Wydajność**: useTransition zapewnia płynność, ale przetestuj na wolnych połączeniach.
- **Licencja**: MIT (wolne oprogramowanie).

Jeśli masz problemy lub sugestie, otwórz issue!