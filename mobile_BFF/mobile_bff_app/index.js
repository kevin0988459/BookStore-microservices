const express = require('express');
const axios = require('axios');
const app = express();
const port = 80; // According to the requirement 80
const validateJwtMiddleware = require('./jwt_handle');
app.use(validateJwtMiddleware);
app.use(express.json());

app.listen(port, () => {
    console.log(`MobileBFF listening on port ${port}`);
});

/**
 * BaseURL for Books and Cutomers services
 * Dev enviornment will use Docker network to communicate
 * Production environment will use ALB URL
 */
const bookBackendBaseUrl = process.env.BOOKS;
const customerBackendBaseUrl = process.env.CUSTOMERS;

//Base URL
app.get('/', function(req, res){
    res.send('Hello world');
})

/**
 * Books endpoint
 */
// [adding] a new book Proxy endpoint
app.post('/books', async (req, res) => {
    try {
        // Forward the request to the book_backend endpoint No.1
        const response = await axios.post(`${bookBackendBaseUrl}/books`, req.body);
        // Respond with the same response from the book_backend service
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response.status === 422){
            return res.status(422).send({message:"This ISBN already exists in the system."})
        }else if (error.response.status === 400){
            return res.status(400).send({message:"Illegal, missing, or malformed input"});
        }
        res.status(500).send("An error occurred");
    }
});

// [updating] a book Proxy endpoint
app.put('/books/:ISBN', async (req, res) => {
    try {
        // Forward the request to the book_backend endpoint No.2
        const response = await axios.put(`${bookBackendBaseUrl}/books/:ISBN`, req.body);
        // Respond with the same response from the book_backend service
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response.status === 404){
            return res.status(404).send({message:"Cannot find ISBN in the system."})
        }else if (error.response.status === 400){
            return res.status(400).send({message:"Illegal, missing, or malformed input"});
        }
        res.status(500).send("An error occurred");
    }
});

// [retrieve] book by ISBN Proxy endpoint
app.get('/books/:ISBN', async (req, res) => {
    try {
        // Forward the request to the book_backend endpoint No.3
        isbn = req.params.ISBN
        const response = await axios.get(`${bookBackendBaseUrl}/books/${isbn}`);
        if (response.data.genre === 'non-fiction') {
            response.data.genre = 3; // Replace 'non-fiction' with numeric value 3
        }
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response.status === 404){
            res.status(error.response.status).send("ISBN not found");
        }
        res.status(500).send("An error occurred");
    }
});


// [retrieve] book by ISBN Proxy endpoint
app.get('/books/isbn/:ISBN', async (req, res) => {
    try {
        isbn = req.params.ISBN
        // Forward the request to the book_backend endpoint No.4
        const response = await axios.get(`${bookBackendBaseUrl}/books/isbn/${isbn}`);
        if (response.data.genre === 'non-fiction') {
            response.data.genre = 3; // Replace 'non-fiction' with numeric value 3
        }
        res.status(response.status).json(response.data);
    } catch (error){
        if (error.response.status === 404){
            res.status(error.response.status).send("ISBN not found");
        }
        res.status(500).send("An error occurred");
    }
});

// [retrieve] recommended books by ISBN Proxy endpoint
app.get('/books/:ISBN/related-books', async (req, res) => {
    try {
        isbn = req.params.ISBN
        // Forward the request to the book_backend endpoint No.5
        const response = await axios.get(`${bookBackendBaseUrl}/books/${isbn}/related-books`);
        // Respond with the same response from the book_backend service
        res.status(response.status).json(response.data);
    } catch (error){
        console.log("ISBN:", isbn, "error response:", error.response.status)
        if (error.response.status === 504){
            res.status(error.response.status).send("Call to external service times out");
        }else if (error.response.status === 503){
            res.status(error.response.status).send("The circuit is open in the circuit breaker");
        }else {
            res.status(500).send('An error occurred');
        }
    }
});

/**
 * Customers endpoint
 */
// [add] a new customer Proxy endpoint
app.post('/customers', async (req, res) => {
    try {
        // Forward the request to the customers_backend endpoint No.1
        const response = await axios.post(`${customerBackendBaseUrl}/customers`, req.body);
        // Respond with the same response from the customers_backend service
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response.status === 422){
            return res.status(422).send({message:"This user ID already exists in the system."})
        }else if (error.response.status === 400){
            return res.status(400).send({message:"Illegal, missing, or malformed input"});
        }
        res.status(500).send("An error occurred");
    }
});

// [retrieve] a new customer by numeric ID Proxy endpoint 
app.get('/customers/:ID', async (req, res) => {
    try {
        ID = req.params.ID
        // Forward the request to the customers_backend endpoint No.3
        const response = await axios.get(`${customerBackendBaseUrl}/customers/${ID}`);
        // Remove some attributes from the response to fit mobile_bff requirement
        delete response.data.address;
        delete response.data.address2;
        delete response.data.city;
        delete response.data.state;
        delete response.data.zipcode;
        // response send
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response.status === 404){
            return res.status(404).send({message:"ID does not exist in the system"});
        }else if (error.response.status === 400){
            return res.status(400).send({ message: "Illegal, missing, or malformed input"});
        }
        res.status(500).send("An error occurred");
    }
});

// [retrieve] a new customer by query string Proxy endpoint 
app.get('/customers', async (req, res) => {
    try {
        const userId = req.query.userId;
        // Forward the request to the customers_backend endpoint No.3
        const response = await axios.get(`${customerBackendBaseUrl}/customers`, { params: { userId } });
        // Remove some attributes from the response to fit mobile_bff requirement
        delete response.data.address;
        delete response.data.address2;
        delete response.data.city;
        delete response.data.state;
        delete response.data.zipcode;
        // response send
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response.status === 404){
            return res.status(404).send({message:"ID does not exist in the system"});
        }else if (error.response.status === 400){
            return res.status(400).send({ message: "Illegal, missing, or malformed input"});
        }
        res.status(500).send("An error occurred");
    }
});

