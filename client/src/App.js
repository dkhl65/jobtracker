import "./App.css";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="/" element={<Home />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="jobs" element={<Jobs />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
