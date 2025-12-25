import { UserCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/raghu.png'

const Home = () => {
  const navigate = useNavigate();

  const [roll, setRoll] = useState("");
  const [savedRolls, setSavedRolls] = useState([]);


  useEffect(() => {
    const storedRolls =
      JSON.parse(localStorage.getItem("rollNumbers")) || [];
    setSavedRolls(storedRolls);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedRoll = roll.toUpperCase().trim();

    if (!cleanedRoll) {
      alert("Please enter your Roll Number");
      return;
    }

    const updatedRolls = [...savedRolls];
    if (!updatedRolls.includes(cleanedRoll)) {
      updatedRolls.push(cleanedRoll);
      localStorage.setItem(
        "rollNumbers",
        JSON.stringify(updatedRolls)
      );
      setSavedRolls(updatedRolls);
    }

    navigate(`/attendance/${cleanedRoll}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center px-4">
      <div className="mt-16 text-center max-w-xl">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full">
            {/* <UserCircleIcon className="w-8 h-8 text-white" /> */}
            <img src={logo} alt="Raghu College" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Welcome Buddies 👋
        </h1>

        <p className="mt-3 text-gray-600 text-sm md:text-base">
          View your attendance instantly and stay on track.
        </p>

        <p className="mt-1 text-gray-500 text-sm">
          Enter your roll number to plan for{" "}
          <span className="font-semibold text-blue-600">SUCCESS</span>.
        </p>
      </div>

      <div className="w-full max-w-md mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          autoComplete="on"
        >
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Raghu Attendance
          </h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Select Campus
            </label>
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>REC</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Enter Roll Number
            </label>

            <input
              type="text"
              name="rollNumber"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              autoComplete="on"
              list="roll-suggestions"
              placeholder="Ex:- 25985A05**"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            <datalist id="roll-suggestions">
              {savedRolls.map((r, index) => (
                <option key={index} value={r} />
              ))}
            </datalist>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition shadow-md"
          >
            View Attendance
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
