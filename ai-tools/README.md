# AI tools used in production
AI tools have been used in the following ways
* Searching for frontend and backend templates
* Debugging code
* Understanding error messages and asking advice for fixing
* Other miscellaneous uses not directly related to code

AI tools used
* ChatGPT 
* GitHub Copilot 
* Gemini 
* Powerpoint Designer AI


## Specifics per person
### Alex

**Tools used**
* Gemini
* GitHub Copilot

**Where did you use AI tools and why** <br>
- Frontend - When starting out on the frontend I used Gemini to help me understand react native formatting and syntax by asking it to summarise documentation and explain specific syntax that I couldn't understand. I also used it for debugging - when running the frontend I used Gemini to help explain why I was getting errors and how they should be fixed, and to explain why my implementation of image uploading wasn't working. In addition, I used Copilot to generate skeleton code for new pages which saves a lot of time. An example of this would be `frontend/app/auth/login.tsx` and `frontend/app/auth/signup.tsx`.

- Backend - I used Gemini to help create a skeleton backend project structure suited for our needs.

- Database - Since I hadn't worked on creating the database I used Gemini to explain how to create one locally one my laptop and to insert elements into it.

- Pull Requests - To ensure I haven't missed any bugs when reviewing code in pull requests I ask Gemini to find any potential bugs, then explore them myself to identify if they are an issue. If I can't do this myself then I ask the AI to explain it for me. An example would be Database update with ER diagram & ai-tools #85 where Gemini found several bugs that I missed.

- AWS - I used Gemini to help me setup EC2, RDS and S3 AWS instances. To save time researching the best configurations for our use case, I screenshotted the configuration options and sent them to Gemini to ask which were the best for us.

- Other - I used Gemini to add a checklist to each of the issue templates in `.github/ISSUE_TEMPLATE` to save me time from adding them manually myself.

### Euan
**Tools used**
* ChatGPT 
* Copilot 
* Powerpoint Designer AI

**Where did you use AI tools and why**
- Frontend: 
I used ChatGPT mainly for this. It is my first time using React Native to code and theres just bugs and error message flying all around. AI is useful to find answers and understand concepts, from easier questions, such as understanding dependencies, components and links, to harder questions, such as how to achieve desired effect and random error messages. One example would be asking ChatGPT on how to achieve the effect of a screenshot of an app. AI answered the name of the effect and provided possible templates, which enables me to know the effect of the name and also use the template and alter it to fit into the effect I wanted. To be specific, shadow effect in `userProfileContainer` in `frontend/app/(tabs)/profile.tsx` is the product of this. 

- Backend: 
I used ChatGPT for this once, to generate repetitive dummy test data for filling in tables in database. The code in `database/insert.sql` are the code generated, which are repetitive and can be done by copy pasting and alter a bit manually. It helps me save time on this. 

- Debugging: 
I used Copilot for understanding random error messages that are all over the place. An example would be line of code `<Link href={item.link} asChild>` in  `frontend/app/(tabs)/profile.tsx` works the day before but generates error messages the day after, which I tried to search online but could not find why. After asking AI, it helped to point out that Expo has stricter requirements, and mentioned type assertion for TypeScript. After changing the code to `<Link href={item.link as Href} asChild>` and importing Href, the problem is solved. 

- Test: 
I used ChatGPT for this. Setting up test environment is more complicated than expected and there are documentation for JS but not for TS. Things are jumbled around and hard to understand what is needed, especially some modules' version does not match the requirement of certain test modules. AI is really useful in this case as it helps me understand and provides suggestions on what to do. An example would be "error message: The global process.env.EXPO_OS is not defined. This should be inlined by babel-preset-expo during transformation." and I copied that and ask with prompt "explain what went wrong and what to do". It turns out it were Metro and Babel.config.js issue and I need to fix it and clear and install again. 

I also used ChatGPT for learning test templates and different types of tests for frontend testing. A used prompt is "give me testing templates for expo" and it generated unit tests, integration tests and snapshot tests template for me; allowing me to search more on different types of tests and also use the basic structure. 

- CI: 
I used Gemini for this. Setting up yml file isn't a problem but there is always dependency issues happening. An example would be "Cannot find module '@testing-library/react-native' from '__tests__/themed-text-test.tsx'" but it works on my computer. I asked Gemini using the prompt  "This is the yml file 'code pasted' and this is the error I got from running github action "error message", explain why this is happening and what I can do to fix this". Gemini replied that I needed to install certain dependency but when I tried it returns the version of react is incorrect, as the dependency requires higher version. Lastly it was solved by explicitly fixing the version to 19.1.0 not ^19.1.0 with help from Gemini. 

- Miscellaneous: 
I have used Microsoft Powerpoint Designer AI once for getting MVP slides template art. The colors and shapes at the background are generated by AI, and can be seen in `doc/others/Secondhand Marketplace2 MVP.pdf`. 




### Freddie

**Tools used**
* ChatGPT
* Copilot 

**Where did you use AI tools and why**

- Frontend: 
I have used ChatGPT to generate test data for our frontend prototype in `frontend/test-data.json`. I asked for data in JSON format. It generated an id, title, description, price, image, category and location. 
Prompt Example:  
"Can you give me test data in a JSON format for 10 items in a second hand marketplace with ids, titles, descriptions, prices, images, categories and locations."

- Tests:
I used copilot to generate tests for the frontend. Due to me not being too familiar with jest, copilot helped to generate the structure of the tests, using the code that copilot gave me I was able to write my own subsequent tests. 
Prompt Example: 
"Can you give me a structure of how to write tests for the explore page and what type of tests do I need?"

- Debugging: 

I have used ChatGPT and Copilot to help me debug code. If there is a non-trivial solution to fixing a bug, I have used AI tools to look at error messages, give me the reason for the error, and how I should fix the error.  


### Jen
**Tools used**
* ChatGPT
* Google Gemini
* Cursor


**Where did you use AI tools and why**
- Frontend: I use ChatGPT to generate basic skeleton code when starting new frontend pages. For example, when creating pages like login or signup screens, I ask ChatGPT to generate the initial layout and component structure. I then adapt and extend this code to meet the project’s specific requirements.
- Debugging: I use Google Gemini for debugging. When errors occur while running the frontend, I ask Gemini to explain the error messages, why they are happening, and suggest how they can be fixed. I also use it to diagnose issues such as when a specific feature (e.g., image uploading) is not working as expected.
- Other: I use Cursor to better understand what specific files or pieces of code are doing. When I encounter unfamiliar code, I ask Gemini to explain its functionality and how different parts interact with each other before making changes.





