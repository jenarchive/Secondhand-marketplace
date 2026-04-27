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

## Mentor 27th Jan: 
* Email Sarah about focusing on backend later (general plan) - do it before testing day
* Priorities: 
    * AI Tools folder: really need to put in more details 
    * Dev and User instructions
    * Project structure: tree map with comments
    * A lot more commits: split commits and PR into smaller piece 
* Good, should keep up: 
    * PR description 
    * Issue: can have more details 
    * Templates 

## Client 28th Jan (MVP Release): 
* Complimented:
    * Having a time plan with actual dates and actual features
    * Gamification: Swiping is responsive and dynamic
    * Butterfly appearing 
    * General simple UI 
* Concerned about: 
    * Profile page overloading: Need to simplify
    * Frontend backend Connection not done
    * User Journey: what do we expect user to go through when they use the app 
        * First time using
        * When do they need to register
        * What they should do after register / after finish swiping or scrolling
    * Testing day: what feedback to collect and how to collect
* Suggestion till week 19 (beta release): 
    * Consider about what is really necessary and simplify into streamline (keep it minimal and functional) 
    * Focus on gamification, animamtion and UI (simplistic) 
    * Start connecting frontend and backend now 
* Will meet us and test our app in person on Feb 19 (Beta release)

## Mentor 12th Feb: 
* Needs urgent attention:  
    * AI usage documentation - ASAP needed
    * CI: Unit tests, integration tests and test coverage
    * CD: deploy backend and database on AWS 
    * User flow / instruction
* Other feedback: 
    * Include before and after issue summary 
    * Make agreement of branch / issue naming and document it
    * Beta Viva slides needed too 

## Client 19th Feb:
* Feedback: 
    * Want swiping to be more reactive to the end - can keep it there and not disappear immediately 
    * Liked about testing day feedback 
    * Ask about the buy now and make offer button on item page: We need to decide to keep it or delete it, with a good reason and following user journey idea. 
    * Happy with what we are having now, and think that we know what we are doing 
* Idea proposal: Swiping creating a match if 2 users liked each other's item (Users who liked your items = User A)
    * Increase uniqueness: pure exchange of item, can pay difference in value or other ideas 
    * Smart recommendation: increase users A items chance to appear in explore page 
    * Up to us to decide if we want to develop on this and how to execute 
* Butterflies: can use testathon to try different versions of butterfly interaction and see which is better? 

## Mentor 19th Feb: 
* AI much better, need to include example prompts 
* CD: fix the issue, consider about what was the mistake that it was pushed to dev 
* Branches need to clean up after merging PR
* CI: make sure it is done before next week
* PR: keep up last week's standard, ensure every of it is reviewed with comments and pictures, if applicable. 
* User flow: navigation 
* Equal workload: need to email Henry about Morgan is not part of our team now 

## Mentor 26th Feb: 
* For Beta Viva:
    * Include all stakeholders briefly 
    * How we changed from greencheckAI 
    * Demo needs practice + show off whole product 
    * Talk about communication method 
    * Talk about what you would change next time 
    * Be prepared to talk about AI, unequal work load and failed action on dev branch and why

## Mentor 5th Mar: 
* ASAP: CI and CD
* AI: include example prompts 
* PR: more comments and code reviews 
* Gamification: consider about mascot 
* VIVA: 
    * Use "Agile" the word more
    * Go through ILOs for slides 
* Think about final Viva: 
    * Finish what is started: backend and testing 
    * Implement small new features (decide early)
    * Spend 2-3 weeks going through presentation

## Client 11th Mar: 
* Happy about overall look and design 
* Feedback: 
    * Transaction page: What do we plan to put on? 
        - Don't put too much, maybe no new page needed. 
        - Maybe confetti and butterflies for pressing buy button - items considered sold and remove from marketplace etc. 
        - No need to think of payment / transaction details 
        - Unusual swipe to buy - prefer clicking 
    * Light mode app looks weird 
    * Matching idea: Up to us to decide 
        - Keep it simple, switch not needed - separate too much 
        - Integrate it with swiping (triggers auto) 
    * Category in marketplace: up to us to think how to implement 
        - Think that side bar would break the streamline experience 
        - Maybe put this in search bar (which is currently working) - Drop down auto? Discussion needed
        - Show similar things in same category - Maybe it is more towards backend algo? Might not be prioritized 
    * Swiping page: 
        - Swipe down to buy is prefered 
* Final release: Up to us again, ddl: 30th Apr
    * Prioritize frontend and matching feature over backend algorithm 
    * Keep up UX 
* Client celebration day: most likely not 
* Next meeting: 15th Apr (end of next sprint)

# Mentor 12th Mar: 
* Commits: 
    * Make it more even 
    * Be prepare to answer why in certain weeks commits are not high (Put in slides before they ask) 
    * Commit names need to explain what and why changes are made - can refer to SEP guide for commit message
* Remove user flow if we are not going to implement - bring down readme marks
* Project structure need to be updated 
* doc renamed into docs 
* Branch need to clean up after merging 
* Issues clean up too - either link to branches or link to other issues 
* **Test Coverage** main focus now: include frontend and backend 
* Put CD in slides: how me implement it and how it iterate 
* Docs: 
    * Missing: 
        - Frontend and backend readme: how to start, how to run, how to test 
        - How does architecture works
    * Can consider, might not in repo: client takeover
        - Instructions on how to maintain / start 
        - Script to auto set up aws 
        - Infrastructure code: easy to set up database (I think we have some part of this in CD for deploying backend on AWS)

# Mentor 20th Mar: 
* Project structure: Hard to read, simplify and condense, esp. frontend
* Missing user instructions 
* Tests - missing edge cases, test coverage
* Docs - handover docs 
* Working issues link to PR / branches
* PR: Consistency and comments 
* Workload - prepare to bring up workload distribution 
* Issues: make it clearer with details 

# Mentor 15th Apr:
* Get rid of root json 
* Comment all the recent PRs 
* Remove things from template if not used 
* Database - dev instruction needed 
* Update tech stack diagram and include architecture diagram 
* User flow 
* Slide: include case studies 
    * condense challenges 
    * Client requirements: explain research and idea 
    * Before and after Agile
    * Greencheck (brief mention of how we spent 5 weeks researching)
* TODOs: 
    1. tests and test coverage
    2. keep commiting 
    3. Handover doc

# Client 15th Apr: 
* Happy about: 
    * Transaction page: looks nice and complete
    * Great progress 
    * Ratings & matching
* Worried about: 
    * App crashed during meeting 
* Feedback: 
    * Focus on Wrapping up 
    * Slides should be more compact 
    * Handover doc: as least as possible
        * What is needed to run the app locally 
        * Set up AWS 
        * Future thoughts / directions 

# Mentor 15th Apr:
* Clean up extra files not supposed to be in repo 
* Tests: 
    * Edge case testing - include in slides 
    * Frontend - include tests for password and username 
* Handover doc: include more details 
* Contributing.md - optional 
* Slides: 
    * add slide about meeting with client: how and what we discuss / communicate 
    * other is in notes in slides 