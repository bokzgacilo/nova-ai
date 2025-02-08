import { BrowserRouter, Route, Routes } from "react-router-dom";
import SplashScreen from "./pages/splashscreen";
import Chat from "./pages/chat";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
