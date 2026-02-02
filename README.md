# 2025-Secondhand Marketplace2
[![Static Badge](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Static Badge](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Static Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## Contents
* [Project overview](#project-overview)
* [Client Information](#client-information)
* [Stakeholders](#stakeholders)
* [User Stories](#user-stories)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Architecture Diagram](#architecture-diagram)
* [Project Management](#project-management)
* [Team Members](#team-members)

## Project overview

Secondhand Marketplace is a online platform for selling, browsing and purchasing secondhand items, that emphasize on user engagement and efficiency, through polished features and an interactive user interface. This includes advanced user reputation system and smart recommnedation engine under a wrapper of gamification system.

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
  <img width="918" alt="architecture image" src="doc/architecture diagram.jpg" style="box-shadow: 5px 5px 10px rgba(0,0,0,0.5)";>
</p>

## Client Information 
### Client: 
Marius Jurt has a strong passion for an online second-hand marketplace platform that masters engagement, user-friendlyness and gamification. He loves working with students and has tasked us with building this online experience.

## Stakeholders
* Buyers
     - Buyers are the users looking to purchase items. They will be able to find specific items they are looking for that fit their requirements, or discover items recommended by the platform. Many buyers will care about the reliability of sellers so will be able to view reviews of individual sellers and the platform's top rated sellers. They will also want a user-friendly system for contacting the seller for queries related to an item or purchase.
* Viewers
     - Viewers are the users that browse the platform to see what items are available or to help curate their taste in aesthetic items such as clothes, without the original intent of buying anything. They will want a fun and interactive system for finding items that match the style they're looking for, and to easily find sellers they might be interested in.
* Sellers: 
     - Sellers are the users the list items for sale. They want to list and manage items with ease and to be recognised for delivering what they promised and on time with a review and rating system used by potential buyers.
* Postal Service Providers:
     - Postal service providers are the external service responsible for delivering items from sellers to buyers. They require accurate address information and effective integration into the app to operate efficiently. It is critical they have reliable delivery speed and conditions as this will impact the reputation of sellers and trustworthness of the marketplace.
* Payment Service Providers:
     - Payment service providers are the external partners that facilitate secure financial transactions between buyers and sellers. They require reliable security protocols to handle payments and manage refunds, which is essential for users' trust in purchasing from marketplace.

## User Stories
- As a **Buyer**, I want my experience of online second-hand shopping to feel playful and exciting, unlike other online stores. I want an enganging and interactive marketplace to easily find the items I'm looking for, and to explore reviews and ratings of sellers. I would also like to browse or be recommended items that would interest me, with the option to filter by specific requirements.
- As a **Seller**, I want a user-friendly marketplace to conviniently list the items I want to sell, and for them to reach the right audience of potential buyers. This will encourage me to contribute to the community, instead of throwing away items I don't want anymore.
- As a **Highly rated Seller**, I want a reliable system allowing buyers to trust me, and enabling me to have an impactful and leading role in the community, potentially building a brand/identity.

## User Flow Steps
### Basic Flow
1. ...

### Alternative Flow
1. ...


## Project Structure
```bash
├── README.md
├── ai-tools
│   └── README.md
├── code
│   ├── backend
│   │   ├── README.md
│   │   ├── app
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── extensions.py
│   │   │   └── routes
│   │   │       ├── __init__.py
│   │   │       ├── auth.py
│   │   │       ├── home.py
│   │   │       └── item_listing.py
│   │   ├── requirements.txt
│   │   └── run.py
│   ├── database
│   │   ├── __pycache__
│   │   │   └── config.cpython-310.pyc
│   │   ├── config.py
│   │   ├── create.sql
│   │   ├── insert.sql
│   │   ├── main.py
│   │   └── operations.sql
│   └── frontend
│       ├── README.md
│       ├── app
│       │   ├── (tabs)
│       │   │   ├── _layout.tsx
│       │   │   ├── explore.tsx
│       │   │   ├── index.tsx
│       │   │   ├── marketplace.tsx
│       │   │   ├── profile.tsx
│       │   │   └── sell.tsx
│       │   ├── _layout.tsx
│       │   ├── auth
│       │   │   ├── login.tsx
│       │   │   └── signup.tsx
│       │   └── items
│       │       ├── [id].tsx
│       │       └── _layout.tsx
│       ├── app.json
│       ├── assets
│       │   └── images
│       │       ├── android-icon-background.png
│       │       ├── android-icon-foreground.png
│       │       ├── android-icon-monochrome.png
│       │       ├── butterfly.png
│       │       ├── favicon.png
│       │       ├── icon.png
│       │       ├── partial-react-logo.png
│       │       ├── react-logo.png
│       │       ├── react-logo@2x.png
│       │       ├── react-logo@3x.png
│       │       └── splash-icon.png
│       ├── components
│       │   ├── butterfly.tsx
│       │   ├── external-link.tsx
│       │   ├── haptic-tab.tsx
│       │   ├── hello-wave.tsx
│       │   ├── parallax-scroll-view-horizontal.tsx
│       │   ├── parallax-scroll-view.tsx
│       │   ├── themed-text.tsx
│       │   ├── themed-view.tsx
│       │   ├── ui
│       │   │   ├── collapsible.tsx
│       │   │   ├── icon-symbol.ios.tsx
│       │   │   └── icon-symbol.tsx
│       │   └── user-header.tsx
│       ├── constants
│       │   └── theme.ts
│       ├── eas.json
│       ├── eslint.config.js
│       ├── hooks
│       │   ├── use-color-scheme.ts
│       │   ├── use-color-scheme.web.ts
│       │   └── use-theme-color.ts
│       ├── package-lock.json
│       ├── package.json
│       ├── scripts
│       │   └── reset-project.js
│       ├── test-data.json
│       └── tsconfig.json
├── doc
│   ├── Database ER Diagram.jpg
│   ├── Roadmap for SEP.docx
│   ├── Secondhand Marketplace2 MVP.pptx
│   ├── architecture diagram.jpg
│   ├── meetings
│   │   └── agendas
│   │       └── GreenCheckAI Meeting Agenda 8th Oct.docx
│   └── meetings.md
├── package-lock.json
├── package.json
└── test
```

## Dev Instructions
## Get started: Frontend

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

For this current iteration you can run the frontend in an Expo Go app on your phone if you scan the QR code that is shown in the terminal. 

Alternatively, if you have a mac you can the frontend in an iOS simulator (docs above)

If when starting the frontend, underneath the QR code it says ```Using development build```, press s on your keyboard to switch to Expo Go. It should now say ```Using Expo Go``` which is what we want. 


## Project Management
- [Kanban Board](https://github.com/orgs/spe-uob/projects/348/views/1)
- [Gantt Chart](https://github.com/orgs/spe-uob/projects/348/views/4)

## Team Members

Name | Email 
--- | ---
Alex Hetherington | ss24495@bristol.ac.uk
Freddie De Bruyn | ii24783@bristol.ac.uk
Euan Chan | AH24354@bristol.ac.uk
Jen Lee | dm24602@bristol.ac.uk

