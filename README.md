# 🤰 SafeWomb

[![Expo](https://img.shields.io/badge/Maintained%20with-Expo-000020.svg?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SafeWomb** is a specialized mobile application built to empower expectant mothers with the tools, tracking, and information they need for a healthy pregnancy. Developed using React Native and Expo, the app provides a high-performance, cross-platform experience with a focus on security and ease of use.

---

## 📖 Table of Contents
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Available Scripts](#-available-scripts)
* [Environment Variables](#-environment-variables)
* [Contributing](#-contributing)
* [License](#-license)

---

## ✨ Features

* **Pregnancy Progress Tracker:** Visual milestones and weekly updates on fetal development.
* **Health Metrics Logging:** Securely record weight, blood pressure, and daily symptoms.
* **Appointment Reminders:** Never miss a prenatal checkup with built-in scheduling.
* **Resource Library:** Expert-backed articles and tips for maternal wellness and nutrition.
* **Native Performance:** Fully optimized for both iOS and Android via Expo Prebuild.

---

## 🛠️ Tech Stack

* **Framework:** [React Native](https://reactnative.dev/)
* **Platform:** [Expo](https://expo.dev/) (Managed Workflow / Prebuild)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
* **Bundler:** [Metro](https://metrobundler.dev/)
* **Development:** [EAS (Expo Application Services)](https://expo.dev/eas)

---

## 📁 Project Structure

```text
├── .expo/                # Expo configuration and cache
├── android/              # Native Android project (generated)
├── ios/                  # Native iOS project (generated)
├── app/                  # Main application routes and screens
├── app-example/          # Reference implementation and boilerplate
├── assets/               # Local images, fonts, and splash screens
├── node_modules/         # Project dependencies
└── .gitignore            # Git exclusion rules
```

### 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

* **Node.js**: [Download and install Node.js](https://nodejs.org/) (LTS version recommended).
* **Git**: [Install Git](https://git-scm.com/) if you haven't already.
* **Expo Go**: Download the app on your [iOS](https://apps.apple.com/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) device to test the app.

### Installation & Setup

Copy and paste the following commands into your terminal:

```bash
# 1. Clone the repository
git clone [https://github.com/Raphael-Akinmoladun/safeWomb.git](https://github.com/Raphael-Akinmoladun/safeWomb.git)

# 2. Navigate into the project directory
cd safeWomb

# 3. Install the dependencies
npm install

# 4. Start the development server
npx expo start
```
---

## ⚙️ Available Scripts

In the project directory, you can run the following commands to develop, test, and build your application:

### Development
* **`npx expo start`**: Starts the Metro bundler. This is your primary command to begin development.
* **`npx expo start --tunnel`**: Starts the dev server using a tunnel (useful if your phone and computer are on different Wi-Fi networks).

### Native Execution
* **`npx expo run:android`**: Compiles and runs your app on a connected Android device or emulator.
* **`npx expo run:ios`**: Compiles and runs your app on an iOS simulator (requires macOS and Xcode).

### Production & Build
* **`eas build --platform android`**: Starts a production build for Android using Expo Application Services.
* **`eas build --platform ios`**: Starts a production build for iOS.
* **`npx expo export`**: Exports the static files for your application (useful for web hosting or self-hosting updates).

### Maintenance
* **`npx expo install --check`**: Checks your project's dependencies for compatibility with your current Expo version.

---
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api-endpoint.com

# Storage/Database Configuration
EXPO_PUBLIC_STORAGE_BUCKET=your_bucket_id

# Optional: Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
