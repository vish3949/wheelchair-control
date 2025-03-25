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
  Home,
  Github,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function WheelchairControl() {
  const [status, setStatus] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Fixed header with padding to prevent overlap */}
      <div className="pt-20 sm:pt-16 px-4 relative">
        {/* Navigation bar - fixed at top */}
        <div className="fixed top-0 left-0 right-0 bg-gray-900 p-3 flex justify-between items-center z-10">
          <Link href="/">
            <button
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              aria-label="Back to Home"
            >
              <Home className="h-5 w-5" />
            </button>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Wheelchair Control
          </h1>

          <div className="flex gap-2">
            <button
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              aria-label="Gesture Off"
              onClick={() => sendCommand("gesture_off")}
            >
              <Power className="h-5 w-5" />
            </button>
            <button
              className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              aria-label="Gesture On"
              onClick={() => sendCommand("gesture_on")}
            >
              <Power className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status display */}
        <div className="text-center mb-8">
          <p className="text-lg font-medium bg-gray-800 inline-block px-4 py-2 rounded-full">
            Status:{" "}
            <span className="text-blue-400">{status || "Waiting..."}</span>
          </p>
        </div>

        {/* Direction controls */}
        <div className="max-w-xs mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-start-2">
              <button
                className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
                aria-label="Front"
                onClick={() => sendCommand("front")}
              >
                <ArrowUp className="h-10 w-10" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <button
              className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Left"
              onClick={() => sendCommand("left")}
            >
              <ArrowLeft className="h-10 w-10" />
            </button>

            <button
              className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Stop"
              onClick={() => sendCommand("stop")}
            >
              <Square className="h-10 w-10" />
            </button>

            <button
              className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Right"
              onClick={() => sendCommand("right")}
            >
              <ArrowRight className="h-10 w-10" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="col-start-2">
              <button
                className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
                aria-label="Back"
                onClick={() => sendCommand("back")}
              >
                <ArrowDown className="h-10 w-10" />
              </button>
            </div>
          </div>
        </div>

        {/* Project info section */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Info className="h-5 w-5" />
              <span>{showInfo ? "Hide Info" : "Show Project Info"}</span>
            </button>

            <a
              href="https://github.com/vish3949/wheelchair-control"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
          </div>

          {showInfo && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-xl animate-fadeIn">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                ESP32 Wheelchair Control System
              </h2>
              <p className="text-sm text-gray-300 mb-3">
                This interface communicates with an ESP32 microcontroller to
                send movement commands to the wheelchair motors.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Web interface for remote control from any device</p>
                <p>• Gesture control using MPU 6050 motion sensor</p>
                <p>• Bluetooth connectivity for direct control</p>
                <p>• Emergency stop functionality for safety</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
