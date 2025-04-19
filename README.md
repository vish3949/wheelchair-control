# Smart Wheelchair Control System

This project is a hybrid hardware-software solution that enables control of a wheelchair using an interactive web interface built with Next.js and a ESP32 microcontroller programmed with Arduino. It's aimed at enhancing accessibility and independence for people with mobility challenges.

## 🧠 Features

- ✋ **Gesture Control**: Detects hand gestures to control wheelchair movement for intuitive navigation.
- 🌐 **Web App Control**: A user-friendly interface built with Next.js allows remote control through a web browser.
- 🔵 **Bluetooth Connectivity**: Sends commands to the wheelchair hardware via Bluetooth for real-time execution.

## 📁 Project Structure

```
├── wheelchair.ino              # Arduino sketch for controlling wheelchair hardware
├── public/                     # SVG icons and static assets
├── src/app/                    # App layout, styles, and favicon
│   ├── favicon.ico             # Favicon used by the web application
│   ├── globals.css             # Global CSS styles for the web interface
│   └── page.tsx                # Main page rendering the control interface
```

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Arduino IDE

### Installation (Frontend)

```bash
git clone https://github.com/vish3949/wheelchair-control.git
cd wheelchair-control
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Arduino Setup

1. Open `wheelchair.ino` in the Arduino IDE.
2. Select the correct board (ESP32) and port.
3. Upload the sketch to the microcontroller.

## 🤝 Contributing

Feel free to fork this repo and suggest improvements via pull requests!

## 📜 License

This project is licensed under the MIT License.

---

Made with ❤️ to help improve accessibility through tech.
