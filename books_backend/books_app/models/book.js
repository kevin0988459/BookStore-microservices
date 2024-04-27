//Use db
const db = require('../db');

// Insert a book record
const insertBook = async(newbook) =>{
  try{
    // check if isbn already exists
    const [existing] = await db.query('SELECT * FROM Books WHERE ISBN = ?', [newbook.ISBN]);
    if (existing.length > 0){
      throw new Error('ISBN exists');
    }else if (!newbook.ISBN || !newbook.title || !newbook.Author || !newbook.description || !newbook.genre || !isValidPrice(newbook.price) || isNaN(newbook.quantity)){
      // illegal, missing, or malformed
      throw new Error('Malformed');
    }
    // form a insert sql statement
    const sql = "INSERT INTO Books (ISBN, title, Author, description, genre, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [newbook.ISBN, newbook.title, newbook.Author, newbook.description, newbook.genre, newbook.price, newbook.quantity];
    // execute insert
    await db.execute(sql, values);
    
  }catch(error){
    console.log(error);
    throw error;
  }
}

// Update a book record
const updateBook = async(book) => {
  try{
    // check if isbn already exists, if not, throw ISBN not found
    const [existing] = await db.query('SELECT * FROM Books WHERE ISBN = ?', [book.ISBN]);
    if (existing.length == 0){
      throw new Error('ISBN not found');
    }else if(!book.ISBN || !book.title || !book.Author || !book.description || !book.genre || !isValidPrice(book.price) || isNaN(book.quantity)){
      // illegal, missing, or malformed
      throw new Error('Malformed');
    }else{
      // form a upate sql statement
      const sql = 'UPDATE Books SET title = ?, Author = ?, description = ?, genre = ?, price = ?, quantity = ? WHERE ISBN = ?';
      const values = [book.title, book.Author, book.description, book.genre, book.price, book.quantity, book.ISBN];
      // execute update
      await db.execute(sql, values);
    }
  }catch(error){
    console.log(error);
    throw error;
  }
}

// Query a book record by ISBN 
const getBookByISBN = async (isbn) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM Books WHERE ISBN = ?', [isbn]);
        if (rows.length > 0){
          rows[0].price = parseFloat(rows[0].price);
          return rows[0];
        }else{
          return null;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};
module.exports = {
  insertBook,
  updateBook,
  getBookByISBN,
};



//-----Helper function------//
function isValidPrice(price) {
  // Check if price is a number
  if (typeof price !== 'number') {
      return false;
  }
  // Convert to string and use regex to check format
  const priceStr = price.toString();
  // Regex explanation:
  // ^[0-9]+: Starts with one or more digits
  // (\.[0-9]{1,2})?$: Optionally followed by a decimal point and one or two digits (decimal part)
  return /^[0-9]+(\.[0-9]{1,2})?$/.test(priceStr);
}