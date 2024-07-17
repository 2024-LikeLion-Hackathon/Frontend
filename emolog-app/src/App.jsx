import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import WriteLog from "./page/WriteLog/WriteLog";
import Home from "./Home";

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/write" element={<WriteLog />} />
        </Routes>
      </Router>
  );
}

export default App;
