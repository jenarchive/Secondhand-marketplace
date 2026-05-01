# Overview
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started
### Installation & Startup server: 
1. #### Install dependencies
    1. Navigate to the frontend root directory and install dependencies:
        `npm install`
    2. Start the development server:
        `npx expo start`
2. #### Network Troubleshooting:
If you are on a restricted network (e.g., eduroam), use a tunnel to expose the local server:
```bash
npx expo install @expo/ngrok 
npx expo start --tunnel 
```
### Running the App: 
#### Mobile (recommend): 
1. Download the Expo Go app 
2. Start the server 
3. Check terminal display is "Using Expo Go" 
    * If not, press s to switch modes
4. Scan the QR code in terminal display 
    * If using iOS, use Camera to scan
    * If using android, use Expo Go app to scan

#### Simulators: 
* **Android Simulator on Windows:** 
    #### Prerequisites
    1. Install Android Studio from the official site.
    2. Open Android Studio, go to Settings > Languages & Frameworks > Android SDK. Ensure the latest Android version (e.g., Android 14) is installed. 
    3. Open "Device Manager" in Android Studio.
    4. Click "Create Device," pick a phone (like Pixel 7), and download a system image.
    5. Launch the emulator from the Device Manager before running your code. 
    #### Run the app
    1. Start the server 
    2. Press 'a' in terminal 

Note: iOS simulator does not run on Windows 

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
│   ├── auth                       # Authentication flow
│   ├── items                      # Item details for sub-pages 
│   └── _layout.tsx                # Root layout and theme providers
├── components                     # Reusable UI components (Headers, Buttons)
├── constants                      # Design tokens (Colours, Spacing)
├── contexts                       
├── hooks                          # Custom React hooks (Theme, Colour schemes)
├── store                          
├── test-data.json                 # Mock data for frontend testing
├── __tests__                      
├── package.json                   # Frontend dependencies and scripts
└── *                              # Set up files for linting / testing
```