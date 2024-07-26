import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import WriteLog from "./page/WriteLog/WriteLog";
import Home from "./Home";
import Signup from "./page/SignUp/SignUp";
import Userform from "./page/UserForm/UserForm";
<<<<<<< HEAD
import Chat from "./page/Chat/Chat";
=======
import Weekly from "./page/Weekly/Weekly";
import Monthly from "./page/Monthly/Monthly";
>>>>>>> 74a1b6e96b14dffad488fe97cc1dbe6bb707f5a4

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userform" element={<Userform />} />
          <Route path="/write" element={<WriteLog />} />
<<<<<<< HEAD
          <Route path="/chat" element={<Chat/>}/>
=======
          <Route path="/weekly" element={<Weekly />} />
          <Route path="/monthly" element={<Monthly />} />

>>>>>>> 74a1b6e96b14dffad488fe97cc1dbe6bb707f5a4
        </Routes>
      </Router>
  );
}

export default App;
