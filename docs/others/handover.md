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

## Cloud Deployment (AWS)

The backend is hosted on AWS using EC2 instances running Ubuntu. The architecture is split into two environments, one for production and one for deployment, running on the same machine (or separate machines, depending on the configuration):
* Main Environment (production): Runs on port 8000, accessed via the /api/ Nginx route
* Test Environment (deployment): Runs on port 8001, accessed via the /test/ Nginx route

### Backend Deployment (AWS EC2)

The backend uses Gunicorn as the application server and Nginx as the reverse proxy to handle external traffic.

#### 1. Connecting to the Server
You must have the .pem SSH key provided by the AWS administrator to access the server.
1. Open your local terminal
2. Ensure your key has the correct permissions: `chmod 400 your-key.pem`
3. Connect to the EC2 instance: `ssh -i "your-key.pem" ubuntu@<YOUR_EC2_IP>`

#### 2. Environment Setup & Pulling Code
The repository is cloned on the server.
1. Navigate to the backend directory (example for the test server): `cd /home/ubuntu/test/2025-SecondhandMarketplace2/backend`
2. Pull the latest code (Requires Personal Acess Token (PAT) if not fully automated):
```
git fetch origin
git checkout dev
git pull origin dev
```
3. Activate the virtual environment and install dependencies:
```
source venv/bin/activate
pip install -r requirements.txt
```
#### 3. Running the Server (Systemd)
Unlike local development where you run flask run, the AWS server uses Systemd to keep the app running in the background automatically.
1. Restart the service after pulling new code: `sudo systemctl restart marketplace-test` (Use marketplace for production)
2. Check the server health/status: `sudo systemctl status marketplace-test`

### Web Server Routing (Nginx)
Nginx receives requests from the frontend and routes them to the correct Flask environment.
If you add new base routes or need to debug routing, the configuration file is located at: `/etc/nginx/sites-available/default`
#### Important Nginx Commands:
* Test configuration for syntax errors: `sudo nginx -t`
* Apply changes to Nginx: `sudo systemctl restart nginx`
* View live traffic logs: `sudo tail -f /var/log/nginx/access.log`

### Frontend Configuration for AWS
To connect your local Expo development environment to the live AWS servers, you must update the base URL in your React Native code.
`. Locate your backend address variable (e.g., in .env or your auth context).
2. Change it to point to the EC2 IP and the correct Nginx route:
* To test against Production: `const FLASK_SERVER_ADDRESS = 'http://<YOUR_EC2_IP>/api';`
* To test against Development: `const FLASK_SERVER_ADDRESS = 'http://<YOUR_EC2_IP>/test';`

### Automated CI/CD Workflow (GitHub Actions)
Deployments to the main and test server are automated using GitHub Actions.
#### Test Server Deployment:
1. When a Pull Request is opened, GitHub Actions triggers a workflow.
2. The Action SSHs into the EC2 instance, navigates to the test directory, pulls the new code, installs requirements, and restarts the `marketplace-test` service automatically.
#### Main Server Deployment:
1. When a Pull Request is merged into `dev`, GitHub Actions triggers a workflow.
2. The Action SSHs into the EC2 instance, navigates to the main directory, pulls the new code, installs requirements, and restarts the `marketplace` service automatically.
