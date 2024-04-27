// Use models
const model = require('../models/book');
// axios ascyn call
const axios = require('axios');
// Recommendation service URL
const externalServiceBaseUrl = 'http://52.72.198.36';
// const externalServiceBaseUrl = 'http://localhost:80';

/*
    Add a book to the DB
    Success: 201, response: {"ISBN","title","Author","description","genre","price",""quantity""}
    Already exists: 422, response: {"message": "This ISBN already exists in the system."}
    Illegal, missing, or malformed input: 400, response: {message:"Illegal, missing, or malformed input"}
    Error: 500, response:{An error occurred}
*/ 
const addBook = async (req, res) => {
    try {
        // parse reqest body
        const {ISBN, title, Author, description, genre, price, quantity} = req.body;
        // use model.insertBook to inset data
        await model.insertBook(req.body);
        // success(201), header Location: {BASEURL}/books/{ISBN of the new book}
        res.status(201).location(`${req.baseUrl}/books/${ISBN}`).json(req.body);
    }catch(error){
        // ISBN already exists in the system(402)
        if (error.message ===  'ISBN exists'){
            return res.status(422).send({message:"This ISBN already exists in the system."})
        }else if (error.message ===  'Malformed'){
            return res.status(400).send({message:"Illegal, missing, or malformed input"});
        }
        res.status(500).send("An error occurred");
    }
}
/*
    Update a book to the DB
    Success: 200, response: {"ISBN","title","Author","description","genre","price",""quantity""}
    ISBN not found: 404, response: {message:"Cannot find ISBN in the system."}
    Illegal, missing, or malformed input: 400, response: {message:"Illegal, missing, or malformed input"}
    Error: 500, response:{An error occurred}
*/ 
const updateBook= async (req, res) => {
    try{
        // use model.updatebook to inset data
        await model.updateBook(req.body);
        // success(200), header Location: {BASEURL}/books/{ISBN of the new book}
        return res.status(200).send(req.body);
        
    }catch(error){
        // ISBN not found(404)
        if (error.message === 'ISBN not found'){
            return res.status(404).send({message:"Cannot find ISBN in the system."})
        }else if (error.message ===  'Malformed'){
            return res.status(400).send({message:"Illegal, missing, or malformed input"});
        }
        res.status(500).send("An error occurred");
    }
}


/**
 *  Use model.getBookByISBN to query an book by ISBN
 *  Success: 200, response: {"ISBN","title","Author","description","genre","price",""quantity""}
 *  Not found: 404, response: {ISBN not found}
 *  Error: 500, response:{An error occurred}
 */
const fetchBookByISBN = async (req, res) => {
    try {
        const isbn = req.params.ISBN;
        const book = await model.getBookByISBN(isbn);
        if (book){
            res.status(200);
            res.json(book);
        }else{
            res.status(404).send("ISBN not found");
        }
    } catch (error) {
        res.status(500).send("An error occurred");
    }
};

/**
 * HTTP GET request to external recommendation service
 * set 3 seconds time out to abort the request
 * If time out, throw new error and return service timeout messsage
 */
const fetchRelatedBooks = async (ISBN) => {
    const url = `${externalServiceBaseUrl}/recommended-titles/isbn/${ISBN}`;
    try {
        const response = await axios.get(url,{ timeout: 3000 });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Service timeout');
        }
        throw error;
    }
}

module.exports = {
    addBook,
    updateBook,
    fetchBookByISBN,
    fetchRelatedBooks,
};




