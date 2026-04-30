# Overview
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   cd frontend
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

## Testing 
1. Install dependencies

   ```bash
   cd frontend
   npm install
   ```

2. Run tests

   ```bash
   npm run test 
   ```

3. Get test coverage

   ```bash
   npm test -- --coverage
   ```

## Project Structure
```text
frontend                           # Frontend React Native (Expo) application
├── README.md                      # Frontend overview and structure 
├── app                            # File-based Routing (Crucial for UI)
│   ├── (tabs)                     # Main pages for frontend
│   │   ├── _layout.tsx            # Layout for navigation bar and pages
│   │   ├── sell.tsx               # Sell Page: Item registration
│   │   ├── profile.tsx            # User Profile: Account and my listings 
│   │   ├── explore.tsx            # Explore Page: Swiping and gamification
│   │   ├── liked-items.tsx        # Liked-items Page: Record and edit which items are liked 
│   │   └── index.tsx              # App landing page - Marketplace: Item listings (Matches Figma)
│   ├── auth                       # Authentication flow
│   │   ├── login.tsx              # Sign-in screen
│   │   └── signup.tsx             # New user registration
│   ├── items                      # Item details for sub-pages 
│   │   ├── edit                   # Folder for editing details of my listing
│   │   ├── transaction            # Folder for "what happens after buy button is pressed"
│   │   ├── [id].tsx               # Dynamic Route: Individual item detail view
│   │   ├── current-listing.tsx    # Page showing my current listing items 
│   │   └── notification.tsx       # Page for showing notifications
│   └── _layout.tsx                # Root layout and theme providers
├── assets                         # Images, icons, and animations
├── components                     # Reusable UI components (Headers, Buttons)
├── constants                      # Design tokens (Colours, Spacing)
├── contexts                       # Context used for checking in other pages 
├── hooks                          # Custom React hooks (Theme, Colour schemes)
├── scripts                        # To reset project
├── store                          # Storage for test-data 
├── test-data.json                 # Mock data for frontend testing
├── __tests__                      # Tests for testing frontend code
├── package.json                   # Frontend dependencies and scripts
└── *                              # Set up files for linting / testing
```