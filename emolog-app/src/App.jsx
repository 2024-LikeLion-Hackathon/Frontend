import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import WriteLog from "./page/WriteLog/WriteLog";
import Home from "./Home";
import Signup from "./page/SignUp/SignUp";
import Userform from "./page/UserForm/UserForm";
import Weekly from "./page/Weekly/Weekly";
import Monthly from "./page/Monthly/Monthly";

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userform" element={<Userform />} />
          <Route path="/write" element={<WriteLog />} />
          <Route path="/weekly" element={<Weekly />} />
          <Route path="/monthly" element={<Monthly />} />

        </Routes>
      </Router>
  );
}

export default App;
