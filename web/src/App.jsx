import React from "react"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login.jsx"
import Dashboard from "./pages/dashboard/Dashboard.jsx"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}
