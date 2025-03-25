"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Power,
} from "lucide-react";

export default function WheelchairControl() {
  const [status, setStatus] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts
  }, []);

  const sendCommand = async (command: string) => {
    try {
      const response = await axios.get(`http://192.168.4.34/${command}`);
      setStatus(response.data.status);
    } catch (error) {
      setStatus("Error sending command");
      console.error(error);
    }
  };

  if (!isMounted) return null; // Don't render until mounted

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Control buttons container */}
      <div className="relative p-4 flex flex-col items-center">
        {/* On/Off buttons in top left */}
        <div className="absolute top-4 left-4 flex gap-4">
          <button
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
            aria-label="Gesture Off"
            onClick={() => sendCommand("gesture_off")}
          >
            <Power className="h-6 w-6" />
          </button>
          <button
            className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
            aria-label="Gesture On"
            onClick={() => sendCommand("gesture_on")}
          >
            <Power className="h-6 w-6" />
          </button>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl font-bold mt-8 mb-10">Wheelchair Control</h1>

        {/* Status display */}
        <p className="text-lg mb-6">Status: {status}</p>

        {/* Direction controls */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-start-2">
            <button
              className="w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
              aria-label="Front"
              onClick={() => sendCommand("front")}
            >
              <ArrowUp className="h-10 w-10" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <button
            className="w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
            aria-label="Left"
            onClick={() => sendCommand("left")}
          >
            <ArrowLeft className="h-10 w-10" />
          </button>

          <button
            className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center"
            aria-label="Stop"
            onClick={() => sendCommand("stop")}
          >
            <Square className="h-10 w-10" />
          </button>

          <button
            className="w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
            aria-label="Right"
            onClick={() => sendCommand("right")}
          >
            <ArrowRight className="h-10 w-10" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-start-2">
            <button
              className="w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
              aria-label="Back"
              onClick={() => sendCommand("back")}
            >
              <ArrowDown className="h-10 w-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
