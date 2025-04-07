"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Home,
  Github,
  Info,
  Battery,
  Wifi,
  Gauge,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function WheelchairControl() {
  const [status, setStatus] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [connectionStrength, setConnectionStrength] = useState(4);
  const [mode, setMode] = useState("indoor");

  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts

    // Auto-hide warning after 10 seconds
    const timer = setTimeout(() => {
      setShowWarning(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const sendCommand = async (command: string) => {
    try {
      if (gestureEnabled && command !== "gesture_off") {
        setStatus("Please disable gesture control first");
        setShowWarning(true);
        return;
      }

      const response = await axios.get(`http://{ESP-32 IP ADDRESS}/${command}`);
      setStatus(response.data.status);

      if (command === "gesture_off") {
        setGestureEnabled(false);
        setShowWarning(false);
      } else if (command === "gesture_on") {
        setGestureEnabled(true);
      }
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

          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm text-gray-300">Off</span>
              <div className="relative">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={gestureEnabled}
                  onChange={() =>
                    sendCommand(gestureEnabled ? "gesture_off" : "gesture_on")
                  }
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </div>
              <span className="ml-2 text-sm text-gray-300">On</span>
            </label>
          </div>
        </div>

        {/* Warning notification */}
        {showWarning && (
          <div className="fixed top-16 left-0 right-0 mx-auto max-w-sm bg-yellow-600 text-white p-3 rounded-lg shadow-lg z-20 animate-bounce-slow flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="text-sm">
                Please disable gesture control to use manual controls
              </p>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-white hover:text-gray-200 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Status display */}
        <div className="text-center mb-8 py-5">
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
                className={`w-20 h-20 ${
                  gestureEnabled
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer"
                } rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
                aria-label="Front"
                onClick={() => sendCommand("front")}
                disabled={gestureEnabled}
              >
                <ArrowUp className="h-10 w-10" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <button
              className={`w-20 h-20 ${
                gestureEnabled
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer"
              } rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
              aria-label="Left"
              onClick={() => sendCommand("left")}
              disabled={gestureEnabled}
            >
              <ArrowLeft className="h-10 w-10" />
            </button>

            <button
              className={`w-20 h-20 ${
                gestureEnabled
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 cursor-pointer"
              } rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
              aria-label="Stop"
              onClick={() => sendCommand("stop")}
              disabled={gestureEnabled}
            >
              <Square className="h-10 w-10" />
            </button>

            <button
              className={`w-20 h-20 ${
                gestureEnabled
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer"
              } rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
              aria-label="Right"
              onClick={() => sendCommand("right")}
              disabled={gestureEnabled}
            >
              <ArrowRight className="h-10 w-10" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="col-start-2">
              <button
                className={`w-20 h-20 ${
                  gestureEnabled
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer"
                } rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
                aria-label="Back"
                onClick={() => sendCommand("back")}
                disabled={gestureEnabled}
              >
                <ArrowDown className="h-10 w-10" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional controls and status indicators */}
        <div className="mt-8 max-w-md mx-auto">
          {/* Status indicators */}
          <div className="grid grid-cols-3 gap-4 mb-6"></div>

          {/* Project info section */}
          <div className="mb-6">
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

          {/* Wheelchair orientation visualization */}
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
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
}
