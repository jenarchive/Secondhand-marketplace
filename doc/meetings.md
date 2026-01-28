# Recordings of all meetings

## Mentor 2nd Oct
* Should always push working version to dev or features branch, main is for MVP, Beta release and final release. 
* Should haves for now: 
    * Milestones 
    * Doc folder for documentation 
    * Project Links in readme (e.g. Kanban)
    * Issue and pull request templates
    * Labelling
* In future: 
    * Tests and coverage 
    * Licence 
    * User manual 
    * Workflow 

## Mentor 7th Oct
* AItools folder 
* .github folder for issue and pull request templates
* Labelling and description of issues/tasks
* Research ML 
* Schedule meeting time

## Client 8th Oct 
* Client's main client: 
    * Government bodies
    * NGOs
    * Hotel startups
    * Potentially banks and journalists 
* Have international clients and need to deal with English, Spanish and German. Language will be handled by client side.
* Product's aim: compare company's explain with internet and obtain a "Green score", to decide if there is greenwashing in the company
* MVP deadline: 10 Nov 
* Ideally work on existing project, to make an extension or something measurable 
* Meeting will be weekly on Friday 3pm 
* Will need to contact dev personnel and confirm tech stack

## Mentor 15th Oct
* Tech stack needed to fill out, include development tools (git, github, github action)
* Information diagram: explains how we do what we did, architecture info with tech info
* fix yml file (CI), include permission (read/write)
* include pylint in yml file to achieve constant coding style 
* Issues labeling and relation with other issues

## Client (CTO) 15th Oct
* Tech Stack: 
    * Back end: FastAPI - Python 
    * Front end: React and TypeScript - Deployed on web browser
* Current ongoing project: rapper around Gemini - using prompts to extract useful info to give feedback
* Requirement so far: fast processing time 

## Sarah 16th Oct 
* Not allowed to work on their existing codebase, as it is not software developing
* Need to discuss and consider about which direction the team is going: 
    1. Building the same project but start from scratch, facing the same client
    2. Change project as a team of 4 or 3 and 1 split up joining other projects
    3. All 4 split up and join different projects 

## Sarah 17th Oct 
* Morgan decided to split as his area of interest does not overlap with others
* Decided to choose 3 projects that sounds interesting for the rest: 
    1. F1 commentary
    2. Secondhand marketplace
    3. Detecting human with radar 

## Mentor 22nd Oct 
* Prepare items that can be transferred to new project:
    * CI / CD
    * Pull request and Issue templates
* Recommended to prepare a skeleton for frontend and backend for MVP demo to get feedbacks 
* Clean up branches 

## Client (new) 5th Nov
* Open-ended project, scope set by our interest and focus 
* Online secondhand platform which is unique in some areas
* Possible focus: 
    * Gamification 
    * Recommendation Engine 
    * Trustworthy / user reviews 
* Client's current tech stack: next.js, react, typescript, node.js, postgreSQL, Aws 
* We decide to start from scratch 
* Contact client every 2-3 weeks with demo 
* Wants a personal close-sourced license 

## Mentor 5th Nov
* Might be mobile app
* Gamification case study: Revolut and Duolingo - Notification system and use of elements / animation
* Focus on user feedback 
* Consider about different system (ios and andriod and pc), planning to make it works on all or at least ios and pc 

## Mentor 12th Nov
* Tech stack diagram need to change 
* Slides needed for presentation 
    * Check github page and prepare for answer 
    * The process of changing project
    * Make sure fulfill the unit objectives
* Try to get something for backend 

## Client 19th Nov: 
* Maybe a bit of competition between sellers - super sellers are pushed to more users 
* Liked the idea of simple and straightforward UI/UX 
* Would like to have a timeline / roadmap for what features would be implemented at what time and which features are we prioritizing
* Things to expect next meeting: 
    * UI design, front-backend interacting, roadmap and what feature we want to focus on 

## Mentor 19th Nov: 
* Database: put in readme how it runs and interacts 
* Readme of subfolder (e.g. frontend folder)
* Issues need to be more descriptive and link to PR and branch 
* Slides and CI are overdue 
* .vscode clean up in frontend 
* More thorough review on PR 
* Project structure optional, would be good to have
* Consider more on other stakeholders: providers of payment service and postal service
* Focus on getting more code in 
* Can apply for app dev license for beta
* Viva: proof of progress throughout 
* Consider about the design principles of the app

## MVP VIVA 26th Nov:
* Need to decide on which features to focus on - not possible to do all features in a very detailed manner, need to choose which to really spend time on 
* Consider about what makes it standout specifically in the Swiss market - where it is meant to go online
* Understand why UI/UX are designed in this way and be able to explain - maybe do some research on psychology in Ui/UX design

## Mentor 26th Nov:
* For UI/UX, email for Sarah to ask for help on user testers and gain feedback 
* On past issues, focus on what we learned from it and how we changed after that 
* CI - split it into 2 issues, linting and running unit tests 
* CD and linking front and back - good if done before TB2
* Aim for more than 6 code commits each person to dev before TB1 ends
* Database: update documentation and database 
* Each issue should link to a branch and PR 
    * Remove emojis in templates 
* AI-docs: update for slides and sample data 
* For recommendation engine - consider about word-mapping, use ai to do semantic analysis - expensive on big scale - need to discuss with client about this

## Mentor 2nd Dec:
* AI folders update
* For database, 2 options to pass user and password for others to use:
    * directly to AWS 
    * encrypt / hash 
* Issues description need to be more detailed
* Need more coding commits, aim for around 300 commits at the end 
* Apply for aws instance and check for client needs 

## Client 3rd Dec: 
* Need to consider about deploying to andriod env, as client uses andriod phone
* Liked items listing - possible table for database
* Should focus on the features we want and ignore others for now (include recommendation)
* Consider about: 
    * Part of marketplace is going to be gamified
    * Elements including scrolling, finding, buy button and notification
    * Butterfly mascot and animation 
    * Full user journey of swiping: 
        * swipe between pages? 
        * When to stop? 
        * How it is convincing the users that it is useful and fun
* Fork for release 
    * Aim for client to test and not too many bugs
    * Basic UI 
    * 28th Jan MVP release
* Looking for actual time and events 
    * Achieve what by when 
* Happy with the progress now 


## Mentor 22nd Jan:
* Issues description really need to improve
    * Why, what problem, how it is going to be implemented or fixed
* Update new member about:
    * Branch names, PR and Issue templates etc.
    * Current progress, code and repo
    * Make issue about it
* User instruction readme
* PR and issues link to milestones
    * Check if milestones and labels are assigned
* CI - unit tests:
    * Write tests before writing code
    * Frontend tests: does element load? achieve required effect? 
    * Backend tests: does it update when some operations is executed by users? 
    * For CI - every PR - does backend launch
    * Should be dismantled into smaller issues and put in dependency
* Concerned about not enough going on
* Aim for more than 1 issue per person per week