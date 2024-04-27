// Use models
const model = require('../models/customer');
const validator = require('validator');
const { Kafka } = require('kafkajs');


//---------Kafka Setup---------//
const kafka = new Kafka({
    clientId: 'customer-service',
    brokers: [
        '52.72.198.36:9092',
        '54.224.217.168:9092',
        '44.208.221.62:9092'
    ]
});
const producer = kafka.producer();
async function initializeKafkaProducer() {
    console.log("Connecting Producer");
    await producer.connect();
    console.log("Producer Connected Successfully");
}
initializeKafkaProducer();
//---------Kafka Setup---------//

/* 
 * Add a new customer to DB
 * Success: 201, response: {id, userId, name, phone, address, address2 = '', city, state, zipcode}
 * Already exists: 422, response: {message:"This user ID already exists in the system."}
 * Illegal, missing, or malformed input 400, response: { message: "Illegal, missing, or malformed input" }
 * Error: 500, response:{An error occurred}
*/
const createCustomer = async(req, res) =>{
    try{
        const {userId, name, phone, address, address2 = '', city, state, zipcode} = req.body;
        // check if userId exists, only proceed when userId does not exists
        const customerExists = await model.customerExists(userId);
        // Validate mandatory fields
        if (!(userId && name && phone && address && city && state && zipcode) || !validator.isEmail(userId) || !validator.isLength(state, {min: 2, max: 2})) {
            return res.status(400).send({ message: "Illegal, missing, or malformed input" });
        }
        if (!customerExists){
            // create customer in DB
            const ID = await model.insertCustomer(req.body);
            const customerData = {id: ID,userId,name,phone,address,address2,city,state,zipcode};
            // Kafka message sending
            await producer.send({
                topic: 'kaiwenh.customer.evt', 
                messages: [
                    { value: JSON.stringify(customerData) }
                ],
            });

            // successful create user 
            return res.status(201).location(`${req.baseUrl}/customers/${ID}`).json(customerData);
        }else{
            return res.status(422).send({message:"This user ID already exists in the system."});
        }
    }catch(error){
        console.log(error);
        res.status(500).send('An error occurred');
    }
};

/**
 * Retrieve Customer by ID 
 * Success: 200, response: {id, userId, name, phone, address, address2, city, state, zipcode}
 * Illegal, missing, or malformed input 400, response: { message: "Illegal, missing, or malformed input" }
 * Userid not found: 404, response: { message: "User-ID does not exist in the system" }
 * Error: 500, response:{An error occurred}
 */
const getCustomerByID = async(req, res) =>{
    const ID = req.params.ID;
    console.log("ID:", ID)
    if (isNaN(ID)){
        return res.status(400).send({ message: "Illegal, missing, or malformed input" });
    }
    try{
        const customer = await model.getCustomerByID(ID);
        if (customer){
            return res.status(200).json(customer); 
        }else{
            return res.status(404).send({ message: "ID does not exist in the system" });
        }
    }catch(error){
        res.status(500).send("An error occurred");
    }
};

/**
 * Retrieve Customer by user ID 
 * Success: 200, response: {id, userId, name, phone, address, address2, city, state, zipcode}
 * Illegal, missing, or malformed input 400, response: { message: "Illegal, missing, or malformed input" }
 * Userid not found: 404, response: { message: "User-ID does not exist in the system" }
 * Error: 500, response:{An error occurred}
 */
const getCustomerByUserId = async(req, res) =>{
    const userId = req.query.userId;
    if(!validator.isEmail(userId)){
        return res.status(400).send({ message: "Illegal, missing, or malformed input" });
    }
    try{
        const customer = await model.getCustomerByUserId(userId);
        if (customer){
            return res.status(200).json(customer);
        }else{
            return res.status(404).send({ message: "User-ID does not exist in the system" });
        }
    }catch(error){
        res.status(500).send("An error occurred");
    }
};



module.exports = {
    createCustomer,
    getCustomerByID,
    getCustomerByUserId,
};