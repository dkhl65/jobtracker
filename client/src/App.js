import "./App.css";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Account from "./components/Account";
import Layout from "./components/Layout";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((data) => {
      fetch("https://visitortracker.vercel.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipaddr: data.ip, website: "jobtracking" }),
      }).catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

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
              <Route path="account" element={<Account />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
