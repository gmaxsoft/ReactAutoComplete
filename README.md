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

## Technologie

### Główne zależności
- **React 19.2.0** - Biblioteka do budowania interfejsów użytkownika
- **React DOM 19.2.0** - Renderowanie React w przeglądarce

### Narzędzia deweloperskie
- **Vite 7.2.4** - Szybki bundler i dev server
- **Vitest 4.0.17** - Framework testowy (alternatywa dla Jest, zoptymalizowana pod Vite)
- **React Testing Library 16.3.1** - Narzędzie do testowania komponentów React
- **@testing-library/jest-dom 6.9.1** - Dodatkowe matchery dla testów DOM
- **@testing-library/user-event 14.6.1** - Symulacja interakcji użytkownika w testach
- **jsdom 27.4.0** - Środowisko DOM dla testów w Node.js

### Narzędzia jakości kodu
- **ESLint 9.39.1** - Linter JavaScript/React
- **@eslint/js** - Konfiguracja ESLint
- **eslint-plugin-react-hooks** - Reguły dla React Hooks
- **eslint-plugin-react-refresh** - Wsparcie dla React Fast Refresh

### Pluginy i kompilatory
- **@vitejs/plugin-react 5.1.1** - Plugin Vite dla React
- **babel-plugin-react-compiler 1.0.0** - Kompilator React dla lepszej wydajności

## Wymagania
- Node.js (zalecana wersja 18+)
- npm lub yarn
- React 18+ (zalecany React 19 dla pełnej kompatybilności z useTransition)
- Przeglądarka wspierająca nowoczesny JavaScript (ES6+)

## Instalacja
1. Sklonuj repozytorium:
   ```
   git clone <URL_REPOZYTORIUM>
   cd <NAZWA_FOLDERU>
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```

### Uruchomienie w Aplikacji React
W pliku `App.jsx`:
```jsx
import React from 'react';
import Form from './Form';

const App = () => <Form />;

export default App;
```

Uruchom aplikację w trybie deweloperskim:
```
npm run dev
```

Lub zbuduj aplikację do produkcji:
```
npm run build
npm run preview
```

## Testy

Projekt zawiera kompleksowe testy jednostkowe napisane przy użyciu Vitest i React Testing Library.

### Uruchamianie testów

Uruchom wszystkie testy (jednorazowo):
```bash
npm test -- --run
```

Uruchom testy w trybie watch (automatyczne uruchamianie przy zmianach):
```bash
npm test
```

Uruchom testy z interfejsem graficznym:
```bash
npm run test:ui
```

Uruchom testy z raportem pokrycia kodu:
```bash
npm run test:coverage
```

### Struktura testów

Projekt zawiera **24 testy jednostkowe** pokrywające wszystkie główne komponenty:

#### App Component (4 testy)
- Renderowanie nagłówka z tytułem
- Renderowanie głównej sekcji z komponentem Form
- Renderowanie stopki z informacją o prawach autorskich
- Weryfikacja wszystkich głównych sekcji

#### Form Component (8 testów)
- Renderowanie wszystkich pól formularza
- Aktualizacja pola imię podczas wpisywania
- Aktualizacja pola email podczas wpisywania
- Aktualizacja pola miasta przez AutoComplete
- Wyświetlanie błędów walidacji przy pustym formularzu
- Wysyłanie formularza z poprawnymi danymi
- Czyszczenie błędów po ponownym wysłaniu z poprawnymi danymi
- Zapobieganie domyślnemu zachowaniu przy wysyłaniu formularza

#### AutoComplete Component (12 testów)
- Renderowanie pola input z placeholderem
- Wyświetlanie wartości przekazanej przez props
- Wywoływanie onChange podczas wpisywania
- Pobieranie sugestii po debounce delay
- Wyświetlanie sugestii po otrzymaniu danych z API
- Podświetlanie pasujących fragmentów tekstu
- Wywoływanie onChange po kliknięciu sugestii
- Nawigacja klawiaturą (strzałki w górę/dół)
- Wybór sugestii klawiszem Enter
- Zamykanie listy klawiszem Escape
- Obsługa błędów API
- Brak zapytań do API dla pustego zapytania

### Pokrycie testami

Testy pokrywają:
- ✅ Renderowanie komponentów
- ✅ Interakcje użytkownika (kliknięcia, wpisywanie, nawigacja klawiaturą)
- ✅ Integracja z API (mockowanie fetch)
- ✅ Obsługa błędów
- ✅ Walidacja formularzy
- ✅ Stany komponentów i aktualizacje

### Linting

Sprawdź kod pod kątem błędów i ostrzeżeń:
```bash
npm run lint
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