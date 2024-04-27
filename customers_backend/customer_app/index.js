const express = require('express')
const app = express()
const port = 80

// Middleware to parse JSON bodies
app.use(express.json());

app.listen(port);
console.log("Customers listen on all network interfaces port 80")

// Import controller 
const customerController = require('./controllers/customer');

//Base URL
app.get('/', function(req, res){
    res.send('Hello world');
})

/**
 * Customer endpoint
 */
// 1. Endpoint support [adding] a new customer into the DB 
app.post('/customers', customerController.createCustomer);

// 2. Endpoint support [retrieve] a customer by numeric ID
app.get('/customers/:ID', customerController.getCustomerByID)

// 3. {BASEURL}/customers?userId={userId} is using query string
app.get('/customers', customerController.getCustomerByUserId);

