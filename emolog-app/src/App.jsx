import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import WriteLog from "./page/WriteLog/WriteLog";
import Signup from "./page/SignUp/SignUp";
import Userform from "./page/UserForm/UserForm";
import Chat from "./page/Chat/Chat";
import Weekly from "./page/Weekly/Weekly";
import Monthly from "./page/Monthly/Monthly";
import Select from "./page/Select/Select";
import Result from "./page/Result/Result";
import Mypage from "./page/Mypage/Mypage";
import Modify from "./page/Modify/Modify";
import { DiaryProvider } from "./context/DiaryContext"; // DiaryProvider import



function App() {
  return (
    <DiaryProvider>
      <Router>
        <Routes>
          
          <Route path="/signup" element={<Signup />} />
          <Route path="/userform" element={<Userform />} />
          <Route path="/write" element={<WriteLog />} />
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/weekly" element={<Weekly />} />
          <Route path="/" element={<Monthly />} />
          <Route path="/select" element={<Select/>}/>
          <Route path="/result" element={<Result/>}/>
          <Route path="/mypage" element={<Mypage/>}/>
          <Route path="/modify"element={<Modify/>}/>

        </Routes>
      </Router>
    </DiaryProvider>
  );
}

export default App;
