# Roadmap for SEP TB2: 
## Sprint 1: MVP Release and Testing day
### Week 13 - 14 (19th - 30th Jan), Project Manager: Freddie
### Features planned to be finish: 
* Butterfly character at item listing page 
    * click buy and flying around 
    * not too invasive 
* Log-in page interaction 
* Pop-up when something is achieved 
* Basic UI for all pages in frontend
* Get ready for what to test (ethics and information form) 

### Fully Achieved: 
* Log-in page interaction 
    * has login and sign in page that links to 2 other pages
    * backend authorization has not been done
* Basic UI for all pages in frontend
    * Has marketplace, sell, explore and profile page. 
* Get ready for what to test (ethics and information form) 

### Partially Achieved: 
* Butterfly character 
    * it is accessible at explore page after all items have been swiped
    * It is supposed to interact when users swipe left or right (possible idea)

### Postponed / Cancelled: 
* Pop-up when something is achieved 
    * A bit out of stretch, did not have enough time

## Sprint 2: Beta Release & Client In-person Meeting
### Week 15 - 17 (2nd - 19th Feb), Project Manager: Euan
### Features planned to be finish: 
* Swiping feature fully done
* Log in page with backend auth 
* Connecting frontend and backend 
* Liked-items page 
* Dev and User instruction 
* Project structure 
* AI Tools folder 
* Profile page simplify
* Unit tests for CI 
* Compatible to android
* User flow
* Issues description change
* Connect to AWS
* Light Mode Frontend
* Research and explain why UI and gamification designs are chosen 
* Delete home and merge log-in to profile page
* Beta Viva slides (rough) 

### Fully Achieved: 
* Project structure [#103](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/103)
* Issues description change [#123](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/123)
* Dev Instruction [#86](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/86)
* AI Tools folder [#110](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/110)
* Profile page simplify [#145](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/145)
* Compatible to android [#125](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/125)
* Connect to AWS [#148](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/148)
* Research about UI and gamification designs [#65](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/65)
    - This is still an ongoing issue, it is achieved in this stage
* Delete home and merge log-in to profile page [#162](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/162) 

### Over-Achieved / Unexpected feature: 
* Simplify marketplace product cards [#160](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/160) 

### Partially Achieved: 
* Swiping feature: 
    - Added like button, fixed background color and added butterfly interaction [#169](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/169)
    - This is still ongoing and new fetures about this will continue to be implemented 
* Connecting frontend and backend: 
    - Sell page is done [#148](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/148)
    - Other pages is not done, such as login and liked-items
* Liked-items page
    - Frontend is done [#131](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/131) 
    - Backend is not done yet [#170](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/170)
* User instruction / user flow is in progress [#135](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/135) 
* Frontend CI for unit tests in progress (no PR created yet)
* Frontend unit tests some basic tests done, more to be developed [#149](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/149)

### Postponed / Cancelled: 
* Light Mode Frontend: 
    - We considered about it and about client's requirement, and found out that this is not necessasry or having high priority. It has some progress [#161](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/161) that might be continued in future 
* Beta Viva slides (rough): 
    - We were a bit rushing towards to the end of this sprint (client meeting) and this was ignored 

## Sprint 3: Beta Viva
### Reading week - Week 20 (23rd Feb - 11th Mar), Project Manager: Alex
### Features planned to be finish: 
* High priority:
    - Features: 
        * Sketch and discuss about client's idea 
        * Swiping feature (more intuitive, like/dislike button) 
        * Butterfly interaction 
    - Repo: 
        * Beta Viva slides (full)
        * Frontend CI and unit tests 
        * Backend CI and unit tests 
        * CD for backend 
        * User flow / user instruction
* Low priority: 
    - Features: 
        * Consider about do we still want light theme
    - Repo: 
        * Backend code formating (to pass pylint CI) 
        * Documentation of meetings, roadmap and research findings 
        * Github naming conventions 

### Fully Achieved: 
* High Priority: 
    - Sketch and discuss about client's idea [#196](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/196) 
        * It is still in PR now but we aimed to have a rough prototype to discuss with client so it is fully done
    - Swiping feature (more intuitive, like/dislike button) [#157](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/157)
    - Beta Viva slides (full) 
        * Finished and submitted to blackboard in [#128](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/128)
        * Documented in [#201](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/201) 
    - Frontend CI and unit tests [#183](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/183)
    - Backend CI and unit tests [#188](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/188)
    - CD for backend 
        * Started with [#152](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/152)
        * Fixed bugs at [#172](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/172)
* Low Priority: 
    - Backend code formating (to pass pylint CI) [#188](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/188)
    - Documentation of meetings, roadmap and research findings [#174](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/174)
    - Github naming conventions [#190](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/190)
        * Only included Branch naming convention, others not needed after discussion

### Over-Achieved / Unexpected feature: 
* Make offer and Buy button [#192](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/192) 
    - Client mentioned, forgot to add at the start. Was reminded by testathon user feedback. 
* My Listing Page [#192](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/192)
    - Mentioned by testathon user feedback and decided to implement 
* Testathon user feedback collect and documentation [#190](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/190) 
    - We didn't plan at the start and we went to collect more feedback for our current app 

### Partially Achieved: 
* Liked-items page backend [#170](https://github.com/spe-uob/2025-SecondhandMarketplace2/pull/170)
    - Delayed and still ongoing 
    - Facing issues on not knowing if the script is working 
    - Planning to achieve by writing pytest, should be done next sprint

### Postponed / Cancelled: 
* Light theme: 
    - No one mentioned and this got cancelled. Might be mentioned in future at end of sprint 4. 
* User flow: [#129](https://github.com/spe-uob/2025-SecondhandMarketplace2/issues/129)
    - Facing issue, it is an Apple / Android app which is not deployed yet. Some delays happened too 
    - Plan to finish before next sprint, or delete it


## Sprint 4: Towards Final Release 
### Week 21 - Easter Break - 22 (15th Mar - 15th Apr), Project Manager: Jen
### Features planned to be finish: 
* 

### Fully Achieved: 
* 

### Partially Achieved: 
* 

### Postponed / Cancelled: 
* 

## Easter Break 

## Sprint 5: Final Release, Poster day 
### Week 23 - 24 (13th - 30th Apr), Project Manager: TBC
### Features planned to be finish: 
* 

### Fully Achieved: 
* 

### Partially Achieved: 
* 

### Postponed / Cancelled: 
* 
 