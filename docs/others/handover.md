# Project Handover Document
## Frontend Development (Expo)
The frontend is built using Expo, allowing for cross-platform mobile development. 
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

## Backend Development (Flask)
The backend is a Python/Flask application. It requires Python 3.10+. 
### Environment Setup:
You must initialize a virtual environment (.venv) before installing dependencies to keep the global environment clean. 
#### Linux/Mac:
``` bash
cd backend 
python3 -m venv .venv. 
.venv/bin/activate
pip install -r requirements.txt
```  
#### Windows
```bash
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