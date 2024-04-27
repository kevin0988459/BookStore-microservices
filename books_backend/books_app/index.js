const express = require('express')
const circuitBreaker = require('opossum');

const app = express()
const port = 80

// Middleware to parse JSON bodies
app.use(express.json());

app.listen(port);
console.log("books listent on all network interfaces port 80")

// Import controller 
const bookController = require('./controllers/book');

//Base URL
app.get('/', function(req, res){
    res.send('Hello world');
})

/**
 * Circuit Breaker for endpoint 4 
 */
const options = {
    timeout: 3000, // If longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50,
    resetTimeout: 5900 // After 60 seconds, try again.
};
const breaker = new circuitBreaker(bookController.fetchRelatedBooks, options);
breaker.on('open', () => console.log('Related Books Circuit open'));
breaker.on('close', () => console.log('Related Books Circuit closed'));
breaker.on('halfOpen', () => console.log('Related Books Circuit half-open')); 


/**
 * Book endpoint
 */
// 1. Endpoint support [adding] a new book into the DB
app.post('/books', bookController.addBook);

// 2. Endpoint supoort [updating] a new book into the DB
app.put('/books/:ISBN', bookController.updateBook);

// 3, 4. Endpoint [retrieve] book by ISBN
app.get('/books/:ISBN', bookController.fetchBookByISBN);
app.get('/books/isbn/:ISBN', bookController.fetchBookByISBN);

// 5. Endpoint returns a list of book titles that are related to a given book specified via its ISBN.
app.get('/books/:ISBN/related-books', async (req, res) => {
    const ISBN = req.params.ISBN;
    try {
        const relatedBooks = await breaker.fire(ISBN);
        if (relatedBooks && relatedBooks.length > 0) {
            res.status(200);
            res.json(relatedBooks);
        } else {
            res.status(204).end(); // No content found
        }
    } catch (error) {
        console.log("ISBN:", ISBN, "circuit:", breaker.opened)
        if (breaker.opened) {
            res.status(503).send('The circuit is open in the circuit breaker');
        } else if (error.code === 'ETIMEDOUT') {
            res.status(504).send('Call to external service times out');
        } else {
            res.status(500).send('An error occurred');
        }
    }
});
