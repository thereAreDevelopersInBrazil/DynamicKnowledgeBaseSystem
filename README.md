# DynamicKnowledgeBaseSystem
RESTful API for a Dynamic Knowledge Base System
This system should manage interconnected topics and resources with version control, user roles, and permissions.

I wrote this REAME with great care, but if you want to, you can skip to the end to see installation and running instructions!

## Project Setup:
I got some templates and boilerplates but I decided to architech and code this project from zero for you guys 💙
So if there is something that is little tailored, handmade, its cause I did from scratch insted of copying


For this project I used:
- NodeJs + Typescript
- Express
- Zod Resolver for validations and type safety 🛡️
- Drizzle ORM (This guy is fast!) 🏎️
- SQLITE with better-sqlite3 in-file client-side database (One of the most relational among the client-side databases) 📊

## Core Functionalities:

### Entities:
- I designed entities Closed and Protected from external interferences (encapsulation) but opened to extension as much as possible
- Practiced some Liskov and Interface segregation (specially with users and resources abstractions)
- Some things I did only for demonstrative purposes cause the use-cases dosent allow me to explore much (also the time ⏰, rsrsrs)

### Topic Management:
- I implemented CRUD operations for Topics with version control
- I implemented all http CRUD methods (GET, POST, PUT, PATCH, DELETE)
- The GET method returns the topics with their children nested in undetermined deep
- The POST method returns the inserted Topic with parents nested on it in undetermined deep (it was not explicit in the challenge but I thought it would be nice)
- I decided to create the PATCH method that is not very known / used, and also implemented it following the RFC 6902 https://datatracker.ietf.org/doc/html/rfc6902, it gave me more work than should, it also is following the versioning requirement!
- The PUT method is very REST strict, so only accept updates of the full resource base properties, this works well when you have PATCH for partial updates, also following the versioning requirement!
- The DELETE method is logical deletion, affecting the results and internal searches in an repository level
- I respected the REST design principles and best practices and conventions
- I did not implemented users permissions yet cause I was focused in the most challenging parts and more core-business related stuff
- The same goes for resources, I understand that they could be attached to topics and this affects topics CRUD but I did not focused on this yet

## Complex Business Logic:

### Topic Version Control and Retrieval:
- I created an efficient versioninng system that save all older versions of topics and increment its versions
- It dosent affect the topic ID, so topic dosent lost its references with resources and parents or children
- Its possibly to retrieve any specific version of an topic using the querystring version on the GET topics/:id

### Recursive Topic Retrieval:
- I created the recursive topic retrieval in two different endpoints
- GET /topics:id respond with the given topic nested with its children recursively infinitely, respecting hierarchy
- POST /topics respond with inserted topic nested with its parents recursively infinitely, respecting hierarchy and older children first than younger

### Custom Algorithms:
- I not only implemented the algorithm, I also created an API route for you guys access it
- Its the route GET /topics/path, it expects two querystrings: origin_topic_id and target_topic_id
- My algorithm is bullet proof 😤✔️ !!! It can find the path in all directions, above, bellow, besides, even if the target topic is on a totally different tree!
- It return clean instructions from where it was, and each step and direction it tooks till reach the target
- Its hundred percent authoral, everything comes from my mind with no internet searches or IA or libraries, I wrote it two times till it gets good and took me lots of time

## Advanced Object-Oriented Design:

- I think I did great abstractions in the user entities, check it out, it cames from Abstract General entity and them becomes an Abstract user and them finally becomes concrete classes like Admin, Editor and Viewer
- I used interfaces to show their behaviors and permissions, and used a Composite pattern with users with more permissions
- I could've used more factory and strategy but because i focused more on Topics and operations with topics i did'nt get in details with resources and users yet, I can do this

## Code Structure and Quality:

- I designed the project from scratch without checking my professional or personal projects or using boillerplates or templates
- I risked, I tried to be original
- I followed DRY (DONT REPEAT YOURSELF) principles at its utmost, so its very DRY (a little too much)
- It means that Classes, Interfaces, Methods, variables, exports, will not have sufixes or prefixes (just in few cases)
- I tried to show that if you are already inside a folder or a file with a given name, why repeat this into code?
- This aproach have its flaws and cons specially in javascript frameworks where we have some limitations with namespaces and stuff like that
- I love SOLID, know every letter meaning, and tried to put it in practice as much the time and my mind let me 😆
- Many places in the software could be refined, I let some @TODO around, and I'm fully conscious about what could be better, but I prefer to be READY them to be PERFECT

## Error Handling and Validation:

- I implemented very comprehensive error handling using Zod with custom error messages plus an middleware validator
- Also implemented an custom error ExpectedError to help me understand what happened inside my services in my controller and them explain the issue to API's users

## Unit and Integration Testing (Bonus):

- I did not implemented unit tests but i know them , and I know the difference between integration tests (thats what I did) and unitary tests
- I writed integration tests for all Topics CRUD / endpoints, tried to be more diverse as I could to show that I know different ways of testing
- I mocked dependencies, functions and results when needed
- I did not implemented user permissions or tests for it cause of the time and cause I believe it was not the most challenging parts of the challenge
- Write unit tests for all services and controllers using a testing framework like Jest or Mocha.
- I did not ensured a high testing coverage but its something that I know how to do, and do on my daywork, I even use Husky to prevent commiting if the coverage is low

# EXTRA BONUS

- I dockerized the service, so it can be easily deployed to an AWS ECS or Kubernetes
- Different from other projects that runs just using development features or aproaches, this project fully builds and compiles to production
- I've used strategies to optimize the Docker image size, layers quantity, and time to build
- No development dependencies were present in the final image!

# INSTALLATION & EXECUTION INSTRUCTIONS

## WITHOUT DOCKER

### In development mode:

1 - Install dependencies:
npm install

2 - Run it!
npm run dev

All database and stuff will be automatically created and setup!

### In production mode:

1 - Install dependencies:
npm install

2 - Build the application (compile typescript into javascript)
npm run build

3 - Create the database
npx drizzle-kit push

4 - Run the compiled application
npm run start

## WITH DOCKER

- To run on your docker just run the command bellow on the root directory of the project:

docker build -t dynamicknowledgebasesystem .

the image will be builded and created, them just:

docker run -p 3000:3000 dynamicknowledgebasesystem

The project will be running in your http://localhost:3000
Access and test with your browser or POSTMAN or Insomnia

I will share an link with the postman collection for testing the project here: https://drive.google.com/file/d/1pQpyGDcXoP6Jk9BWHsUMrfeONjKNF_iH/view?usp=sharing

Thanks for reading, time, and attention!
Best Regards
