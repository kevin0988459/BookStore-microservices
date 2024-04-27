###MySQL local###
User: 'root'
Password: 'root'

####---Steps---####
1. Download node.js
2. Check node.js version
    • $ node --version
3. Create working file
    • $ mkdir lab1
4. Run npm
    • $ npm init
5. Dowonload Express and save to dependencies
    • $ npm install express --save 
6. Create index.js
    • $ touch index.js
7. [Important]Downolad mysql2 client to npm, old mysql package will hamper user login to MySQL8.0
    • $ npm install mysql2 --save
8. for email check do: 
    • $ npm install validator --save
9. Use axios in web_BFF and mobile_BFF to send HTTP request to backend services
    • $ npm install axios --save
10. For BFF install JWT decoder
    • $ npm install jsonwebtoken --save
11. Use axios in books_backend to send HTTP request to recommendation exteranl systems
    • $ npm install axios --save
12. Use opossum in books_backend to implement circut breaker
    • $ npm install opossum --save
13. Use kafkajs in customers_backend to send a message to a Kafks topic
######--------axios--------######
Axios is a popular JavaScript library used to make HTTP requests from node.js or XMLHttpRequests. 
It is promise-based, which provides a more flexible and readable syntax for handling asynchronous operations.
######--------implement JWT--------######
https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs