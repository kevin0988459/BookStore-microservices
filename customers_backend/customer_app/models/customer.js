//Use db
const db = require('../db');

// Insert a new customer
const insertCustomer = async(newCustomer) =>{
    try{
        // execute insert
        const result = await db.query('INSERT INTO Customer SET ?', newCustomer);
        // return Id of new customer
        return result[0].insertId;
    }catch(error){
        console.log(error);
        throw error;
    }
};

// Query a customer by numeric ID
const getCustomerByID = async(ID) =>{
    try{
        const [result] = await db.query('SELECT * FROM Customer WHERE id = ?', [ID]);
        if (result.length > 0){
            return result[0];
        }else{
            return null;
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};


// Query a customer by userId
const getCustomerByUserId = async(userId) =>{
    try{
        const [result] = await db.query('SELECT * FROM Customer WHERE userId = ?', [userId]);
        if (result.length > 0){
            return result[0];
        }else{
            return null;
        }
    }catch(error){
        console.log(error);
        throw error;
    }

};



//-----Helper function------//
// check if user id already exists
async function customerExists(userId){
    const [existing] = await db.query('SELECT * FROM Customer WHERE userId = ?', [userId]);
    if (existing.length > 0){
        return true;
    }else{
        return false;
    }

};

module.exports = {
    customerExists,
    getCustomerByUserId,
    getCustomerByID,
    insertCustomer

}