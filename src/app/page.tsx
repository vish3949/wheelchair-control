import Link from "next/link";
import { Github, MousePointer, Bluetooth } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Wheelchair Control with ESP32
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            A microcontroller-based solution for accessible mobility
          </p>

          {/* Moved buttons after title line */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link
              href="/wheelchair-control"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center min-w-[180px] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Control Panel
            </Link>

            <a
              href="https://github.com/vish3949/wheelchair-control"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 min-w-[180px] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Github className="h-5 w-5" />
              GitHub
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                Project Overview
              </h2>
              <p className="mb-4 text-gray-300">
                This project implements a web-based control system for electric
                wheelchairs using ESP32 microcontrollers. The interface allows
                users to control wheelchair movement through an intuitive web
                interface or gesture controls.
              </p>
              <p className="text-gray-300">
                Designed for individuals with mobility challenges, this system
                provides an alternative control method that can be operated from
                any device with a web browser.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                Control Methods
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <MousePointer className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Gesture Control</h3>
                    <p className="text-gray-300">
                      Using MPU 6050 sensor for motion-based control, allowing
                      hands-free operation through natural movements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Bluetooth className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Bluetooth Control</h3>
                    <p className="text-gray-300">
                      Direct control via Bluetooth connection for reliable
                      short-range operation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                Project Details
              </h2>
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="font-medium text-gray-200">Subject:</span>
                  <p>Microprocessors and Microcontrollers</p>
                </div>
                <div>
                  <span className="font-medium text-gray-200">University:</span>
                  <p>Vellore Institute of Technology</p>
                </div>
                <div>
                  <span className="font-medium text-gray-200">Faculty:</span>
                  <p>Nisha JS</p>
                </div>
                <div>
                  <span className="font-medium text-gray-200">
                    Team Members:
                  </span>
                  <ul className="list-disc list-inside pl-4">
                    <li>Vishwakanth G</li>
                    <li>Thufail Ahamed</li>
                    <li>Harshitha S</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                Technical Implementation
              </h2>
              <p className="mb-4 text-gray-300">
                The system uses an ESP32 microcontroller as the main processing
                unit, which controls the wheelchair's motors based on commands
                received via a web server. The front-end interface is built with
                React and Next.js, providing a responsive and accessible user
                experience.
              </p>
              <p className="text-gray-300">
                Communication between the web interface and the ESP32 happens
                over a local WiFi network, allowing for real-time control with
                minimal latency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
