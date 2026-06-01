# 2025-Secondhand Marketplace
[![Static Badge](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Static Badge](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Static Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Amazon RDS](https://img.shields.io/badge/AWS%20RDS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/rds/)
[![Amazon S3](https://img.shields.io/badge/AWS%20S3-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/)
[![Amazon EC2](https://img.shields.io/badge/AWS%20EC2-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/ec2/)

## Contents
* [Project overview](#project-overview)
* [Technology Stack](#technology-stack)
* [Client Information](#client-information)
* [Stakeholders](#stakeholders)
* [User Stories](#user-stories)
* [User Flow](#user-flow)
* [Project Structure](#project-structure)
* [Dev Instructions](#dev-instructions)
* [Project Management](#project-management)
* [Team Members](#team-members)

## Project overview

Secondhand Marketplace is an online platform for selling, browsing and purchasing secondhand items that emphasises user engagement and efficiency, through polished features and an interactive user interface. This includes an advanced user reputation system and a smart recommendation engine under a wrapper of a gamification system.

## Technology Stack


### Backend:
* Python
* PostgreSQL
### Frontend:
* React native
*  expo (react-native framework) 
### Development tools:
* Git
* Github 
* Github Actions

<p align="left">
  <img width="918" alt="architecture image" src="docs/others/architecture diagram.jpg" style="box-shadow: 5px 5px 10px rgba(0,0,0,0.5)";>
</p>

### Cloud Architecture 
<p align="left">
<img width="918" alt="architecture image" src="docs/others/image-2.png" style="box-shadow: 5px 5px 10px rgba(0,0,0,0.5)";>
</p>

## Client Information 
### Client: 
Marius Jurt has a strong passion for an online second-hand marketplace platform that masters engagement, user-friendliness, and gamification. He loves working with students and has tasked us with building this online experience.

## Stakeholders
* Buyers
     - Buyers are the users looking to purchase items. They will be able to find specific items they are looking for that fit their requirements, or discover items recommended by the platform. Many buyers will care about the reliability of sellers, so they will be able to view reviews of individual sellers and the platform's top rated sellers. They will also want a user-friendly system for contacting the seller for queries related to an item or purchase.
* Viewers
     - Viewers are the users who browse the platform to see what items are available or to help curate their taste in aesthetic items, such as clothes, without the original intent of buying anything. They will want a fun and interactive system for finding items that match the style they're looking for, and to easily find sellers they might be interested in.
* Sellers: 
     - Sellers are the users of the list items for sale. They want to list and manage items with ease and to be recognised for delivering what they promised and on time, with a review and rating system used by potential buyers.
* Postal Service Providers:
     - Postal service providers are the external service responsible for delivering items from sellers to buyers. They require accurate address information and effective integration into the app to operate efficiently. It is critical that they have reliable delivery speed and conditions, as this will impact the reputation of sellers and the trustworthiness of the marketplace.
* Payment Service Providers:
     - Payment service providers are the external partners that facilitate secure financial transactions between buyers and sellers. They require reliable security protocols to handle payments and manage refunds, which is essential for users' trust in purchasing from the marketplace.

## User Stories
- As a **Buyer**, I want my experience of online second-hand shopping to feel playful and exciting, unlike other online stores. I want an engaging and interactive marketplace to easily find the items I'm looking for, and to explore reviews and ratings of sellers. I would also like to browse or be recommended items that would interest me, with the option to filter by specific requirements.
- As a **Seller**, I want a user-friendly marketplace to conveniently list the items I want to sell, and for them to reach the right audience of potential buyers. This will encourage me to contribute to the community, instead of throwing away items I don't want anymore.
- As a **Highly rated Seller**, I want a reliable system allowing buyers to trust me, and enabling me to have an impactful and leading role in the community, potentially building a brand/identity.

## User Flow
### Basic Flow
#### Buyer: 
1. Open the app 
2. Sign up / Log in
3. Search/Browse to like / buy: 
     - Scroll through the marketplace
     - Swipe on the explore page (able to match if the buyer has a listing)
4. Head to the likes page to check items that they liked
5. Choose one that they like and buy
6. Fill in the details for the transaction page and send the offer 
7. Wait for the seller to accept the offer 
8. Rate the seller after the offer is accepted

#### Seller: 
1. Open the app 
2. Sign up / Log in
3. Add listing using the add items page
4. Edit details or remove listings in the MyListings page 
5. Accept or decline the offer sent by buyers


## Project Structure
```text
├── .github                            # Templates & workflows
├── README.md                          # Main project overview
├── ai-tools                           # Overview of AI tools
├── backend                            # Flask API: Handles business logic and data processing
│   ├── README.md                      # Backend overview and structure
│   ├── app                            # Core Flask app (Routes: Auth, Home, Item listings, Upload Items)
│   ├── tests                          
│   ├── requirements.txt               # Backend dependencies (Flask, SQLAlchemy, etc.)
│   ├── run.py                         # Server entry point: Starts the Flask development server
│   └── .pylintrc                      # Adjustment for pylint in CI 
├── database                           # Data Layer: PostgreSQL configuration and scripts
│   ├── README.md                      # Database overview and structure 
│   ├── config.py                      
│   ├── main.py                        # Management script for DB init and migrations
│   └── *.sql                          # SQL scripts
├── frontend                           # Frontend React Native (Expo) application
│   ├── README.md                      # Frontend overview and structure 
│   ├── app                            # File-based Routing (Crucial for UI)
│   │   ├── (tabs)                     # Main pages for frontend
│   │   ├── auth                       # Authentication flow
│   │   ├── items                      # Item details for sub-pages 
│   │   └── _layout.tsx                # Root layout and theme providers
│   ├── components                     # Reusable UI components (Headers, Buttons)
│   ├── constants                      # Design tokens (Colours, Spacing)
│   ├── contexts                       
│   ├── hooks                          # Custom React hooks (Theme, Colour schemes)
│   ├── store                          
│   ├── test-data.json                 # Mock data for frontend testing
│   ├── __tests__                      
│   ├── package.json                   # Frontend dependencies and scripts
│   └── *                              # Set up files for linting/testing
├── doc                                # Project documentation and diagrams
    ├── previous project               # Files related to previous project
    ├── others                         # Diagrams and files for explaining / planning 
    └── meetings and feedback         # Meeting notes and feedback for review
```

## User Instructions 
Note: Ideally, this would be a mobile app that can work on both iOS and Android, and can be downloaded from app stores. However, we can't deploy it as a license is needed for deploying on iOS and Android. Users can now only experience this app by using dev instructions. 

## Dev Instructions
### Frontend

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```
   For some networks, such as eduroam, you will need to run the following instead
   ```bash
   npx expo install @expo/ngrok
   npx expo start --tunnel
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

For this current iteration, you can run the frontend in an Expo Go app on your phone if you scan the QR code that is shown in the terminal. 

Alternatively, if you have a Mac, you can run the frontend in an iOS simulator (docs above)

If when starting the frontend, underneath the QR code it says ```Using development build```, press s on your keyboard to switch to Expo Go. It should now say ``` Using Expo Go``` which is what we want. 

### Backend
#### Prerequisites

Ensure you have Python 3.10+ installed.

#### Setup Environment and Install Dependencies

<details>
<summary><strong> Linux/Mac </strong></summary>

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

</details>

<details>
<summary><strong> Windows </strong></summary>

```bash
cd backend
py -3 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

</details>

#### Run Locally

```bash
flask --app app run
```

## Project Management
- [Kanban Board](https://github.com/orgs/spe-uob/projects/348/views/1)
- [Gantt Chart](https://github.com/orgs/spe-uob/projects/348/views/4)
- [Project Roadmap](doc/others/Roadmap.md)

## Team Members

Name | Email 
--- | ---
Alex Hetherington | ss24495@bristol.ac.uk
Freddie De Bruyn | ii24783@bristol.ac.uk
Euan Chan | AH24354@bristol.ac.uk
Jen Lee | dm24602@bristol.ac.uk

