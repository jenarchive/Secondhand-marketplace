This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure
frontend                           # Frontend React Native (Expo) application
├── app                            # File-based Routing (Crucial for UI)
│   ├── (tabs)                     # Main navigation tab screens
│   │   ├── marketplace.tsx        # Main Marketplace: Item listings (Matches Figma)
│   │   ├── sell.tsx               # Sell Page: Item registration
│   │   ├── profile.tsx            # User Profile: Account and history
│   │   └── index.tsx              # App landing logic
│   ├── auth                       # Authentication flow
│   │   ├── login.tsx              # Sign-in screen
│   │   └── signup.tsx             # New user registration
│   ├── items                      # Item details
│   │   └── [id].tsx               # Dynamic Route: Individual item detail view 
│   └── _layout.tsx                # Root layout and theme providers
├── assets                         # Images, icons, and animations
├── components                     # Reusable UI components (Headers, Buttons)
├── constants                      # Design tokens (Colours, Spacing)
├── hooks                          # Custom React hooks (Theme, Colour schemes)
├── test-data.json                 # Mock data for frontend testing
└── package.json                   # Frontend dependencies and scripts