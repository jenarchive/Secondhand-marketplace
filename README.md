# 2025-Secondhand Marketplace
[![Static Badge](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Static Badge](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Static Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Amazon RDS](https://img.shields.io/badge/AWS%20RDS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/rds/)
[![Amazon S3](https://img.shields.io/badge/AWS%20S3-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/)
[![Amazon EC2](https://img.shields.io/badge/AWS%20EC2-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/ec2/)

---

## Project Overview

Secondhand Marketplace is an online platform for selling, browsing, and purchasing secondhand items. It bridges the gap between conventional e-commerce and interactive social experiences by focusing on user engagement, usability, and gamification.

### Core Focus Areas:
* **Reputation-Based User System:** Builds trust through transparent seller ratings, reviews, and community history.
* **Tinder-Style Product Discovery:** Enables intuitive swipe-based browsing where users can quickly like, skip, or save items, making product exploration fast and engaging.
* **Streamlined Transaction Flow:** Provides an intuitive end-to-end purchase experience, with easy chat access, an organised Likes list, and a fully manageable My Listings page for sellers.

---

## Technology Stack

### Frontend & Backend
* **Frontend:** React Native, Expo Framework
* **Backend:** Python (Flask API Server)
* **Database:** PostgreSQL (Data Layer)
* **Development Tools:** Git, GitHub, GitHub Actions (CI/CD)

### System Architecture
<p align="left">
  <img width="918" alt="architecture image" src="docs/others/architecture diagram.jpg" style="box-shadow: 5px 5px 10px rgba(0,0,0,0.3);">
</p>

### Cloud Architecture
<p align="left">
  <img width="918" alt="cloud architecture image" src="docs/others/image-2.png" style="box-shadow: 5px 5px 10px rgba(0,0,0,0.3);">
</p>

---

## Key Stakeholders
* **Buyers:** Users looking to purchase items. They can search for specific items fitting their requirements or explore AI-recommended feeds. Since reliability is paramount, buyers can view detailed reviews of individual sellers and a directory of the platform's top-rated traders. They also utilise a user-friendly chat system for queries.
* **Sellers:** Users who list items for sale. They want to list and manage inventories with ease and be formally recognised for delivering accurate items on time through a transparent review and rating infrastructure.
* **Viewers:** Users who browse to explore availability or curate their aesthetic tastes (e.g., fashion, style trends) without immediate purchase intent. They require a fun, highly interactive system to discover items and effortlessly track sellers they might like.
* **Postal Service Providers:** External services responsible for logistics and fulfilment. They require accurate shipping data and streamlined application integration. Reliable delivery speeds directly protect the reputation of sellers and the marketplace's integrity.
* **Payment Service Providers:** External partners facilitating secure split-payment and refund architectures. High-volume security protocols are essential to build consumer trust in the platform.

---

## User Flow

The overall flow of the second-hand marketplace app is as follows.

## Marketplace

The Marketplace home screen displays both products listed by other users and products uploaded by the current user. When a user selects a product card, they are redirected to the Product Detail page. From there, users can save items to the Likes page using the heart button or proceed directly to purchase through the Buy Now button.

_If a product has already been sold, reserved, or is currently involved in a match offer process, a corresponding status badge (e.g., Sold, Reserved) is displayed on the product card, and purchasing is restricted._

### Transactions

When the Buy Now button is selected, the user is redirected to the Transaction page. Two transaction methods are available: Delivery/Meet-up

_If Delivery is selected, users can complete the payment using a card payment system. If Meet-up is selected, the payment method is automatically fixed to Pay in Person._

After a successful delivery payment, the product status changes to Sold. If a meet-up transaction is confirmed, the product status changes to Reserved.

Buyers can also initiate a chat with the seller directly from the Transaction page to ask questions, discuss product details, or arrange a meeting location and time. Once the transaction is completed, buyers can rate the seller, and the rating is reflected in the seller’s profile.

### Make Offer

Users can also purchase products through the Make Offer feature. After entering a desired offer price and pressing the Send Offer button, the user is redirected to a dedicated offer chat page containing the offer details.

If the seller accepts the offer, the proposed amount is automatically updated as the final payment amount for the transaction.

### Explore

The Explore page provides a Tinder-style swipe interface that allows users to interact with products intuitively. Depending on the swipe direction, users can like/skip a product or purchase a product immediately.

_The same actions can also be performed through buttons located at the bottom of the screen._

### Match Offer System

The Explore page also includes a product matching feature that enables users to suggest 1:1 item exchanges. By pressing the Match icon on a product card, users can select one of their own listed items and send a match offer to another user.

After sending the offer, users are redirected to a dedicated match-offer chat room where both parties can continue the discussion.

_This Match Offer feature is also available from the Marketplace page._

### Sell

After registering product details on the Sell page, users can publish their item as an active listing for sale. Once the listing is submitted, it becomes visible in the Marketplace and can be discovered by other users.

### Likes

Products liked by users from either the Marketplace or Explore pages are automatically stored in the Likes page. Users can freely manage and edit their saved items list.

### Profile

The Profile page becomes accessible after logging in or signing up.

After authentication, users can access:

- My Chats — view all active and previous conversations
- My Listings — manage uploaded products

Within My Listings, users can edit product details such as description(product title, price, etc.), listing status/cancellation

_Some editing functions are also directly accessible from the Marketplace page for improved convenience._

---

## Project Structure

```text
├── .github/                # CI/CD workflows and templates
├── ai-tools/               # AI/ML-driven tooling and helper scripts
├── backend/                # Flask API Server
│   ├── app/                # Core application logic & routes (Auth, Home, Listings)
│   ├── tests/              # Backend test suites
│   ├── requirements.txt    # Python dependencies
│   └── run.py              # Server entry point
├── database/               # PostgreSQL setup & migration scripts
│   ├── config.py           # Connection management
│   ├── main.py             # DB initialisation and migrations execution
│   └── *.sql               # Raw SQL schemas and seeding queries
├── frontend/               # React Native + Expo mobile app
│   ├── app/                # Expo Router (File-based routing)
│   │   ├── (tabs)/         # Main application navigation tabs
│   │   ├── auth/           # Authentication user flows
│   │   ├── items/          # Product details sub-pages
│   │   └── _layout.tsx     # Root layout and theme context providers
│   ├── components/         # Reusable UI components (Headers, Buttons)
│   ├── constants/          # Global design tokens (Colours, Spacing)
│   ├── hooks/              # Custom React hooks (Theme management)
│   ├── store/              # Global state management modules
│   └── package.json        # Node dependencies and npm run scripts
└── doc/                    # Project documentation & diagrams
    ├── meetings and feedback/ # Client meeting logs and supervisor notes
    └── others/             # Architecture diagrams, mockups, and roadmaps
```
## Dev Instructions
### Frontend Setup
Ensure you have Node.js installed on your machine.
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

### Backend Setup
Ensure you have Python 3.10+ installed on your machine.

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

We actively track milestones, epics, and tasks via GitHub Projects.
* **Kanban Board:** [Interactive Task Tracker](https://github.com/orgs/spe-uob/projects/348/views/1)
* **Gantt Chart:** [Project Timeline & Dependencies](https://github.com/orgs/spe-uob/projects/348/views/4)
* **Project Roadmap:** Detailed breakdown located at [`doc/others/Roadmap.md`](https://github.com/spe-uob/2025-SecondhandMarketplace2/blob/dev/docs/others/Roadmap.md)

---

## Team Members

| Name | Email |
| :--- | :--- |
| **Alex Hetherington** | ss24495@bristol.ac.uk |
| **Freddie De Bruyn** | ii24783@bristol.ac.uk |
| **Euan Chan** | AH24354@bristol.ac.uk |
| **Jen Lee** | dm24602@bristol.ac.uk |
