import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavigationMenu from "./Components/Layout/NavigationMenu";
import SearchBar from "./Components/Layout/SearchBar";

function App() {
  return (
    <div className="App">
      <SearchBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <NavigationMenu />
    </div>
  );
}

export default App;
