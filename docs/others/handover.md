# Project Handover Document
## Frontend Development (Expo)
The frontend is built using Expo, allowing for cross-platform mobile development. 
### Installation & Startup: 
#### Navigate to the frontend root directory and install dependencies:
`npm install`
#### Start the development server:
`npx expo start`
#### Network Troubleshooting:
If you are on a restricted network (e.g., eduroam), use a tunnel to expose the local server:
```
npx expo install @expo/ngrok 
npx expo start --tunnel 
```
### Running the App: 
Mobile (Recommended): Scan the QR code in the terminal using the Expo Go app. 
Simulators: Press the corresponding key in the terminal to open in an iOS Simulator (Mac only) or Android Emulator. 
Configuration Note: Ensure the terminal displays "Using Expo Go." If it says "Using development build," press s to switch modes.

## Backend Development (Flask)
The backend is a Python/Flask application. It requires Python 3.10+. 
### Environment Setup:
You must initialize a virtual environment (.venv) before installing dependencies to keep the global environment clean. 
#### Linux/Mac:
``` 
cd backend 
python3 -m venv .venv. 
.venv/bin/activate
pip install -r requirements.txt
```  
#### Windows
```
cd backend
py -3 -m venv 
.venv.venv\Scripts\activate
pip install -r requirements.txt
```
### Running Locally: 
Once the virtual environment is active and dependencies are installed, start the server:
` flask --app app run3. `
#### Development Workflow 
Checklist
* Verify Node.js and Python 3.10+ are installed.
* Ensure the Backend is running before performing frontend actions that require API calls.
* If using a physical device via Expo Go, ensure the phone and computer are on the same Wi-Fi network (unless using the --tunnel flag).
Note: Always keep the .venv active when installing new Python packages or running the Flask server to avoid dependency conflicts.