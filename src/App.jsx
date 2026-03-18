import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Compose from "./pages/Compose";
import Composition from "./pages/Composition";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/composition/:id" element={<Composition />} />
        <Route path="/compose/:id" element={<Compose />} />
      </Routes>
    </BrowserRouter>
  );
}