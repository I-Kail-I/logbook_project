import React, { useState } from "react";

export default function App() {

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        catch(error) {
          throw error
        }
      })
    }

  }

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="cards px-7 py-2 bg-gray-800 rounded-lg shadow-lg">
        <div className="header mx-auto">
          <h1 className="text-2xl font-bold text-white">
            Register your account now!
          </h1>
        </div>

        <div className="form-login mt-5">
          <form action="" className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="enter your user"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mx-auto w-full p-2 rounded-md bg-gray-700 text-white"
            />

            <input
              type="password"
              placeholder="enter your password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mx-auto w-full p-2 rounded-md bg-gray-700 text-white"
            />

            <button className="px-3 py-2 bg-white rounded-lg">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
