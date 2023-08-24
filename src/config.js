const config = require('dotenv').config();
// puerto
const PORT = process.env.PORT || 3000
// database 
const DB_USER = process.env.DB_USER //|| '' 
const DB_PASSWORD = process.env.DB_PASSWORD //|| ''
const DB_DATABASE = process.env.DB_DATABASE //|| '' 
// jwt 
const JWT_SECRET = process.env.JWT_SECRET //|| 'adfZZATVV-japon485.ASDF,X%SK*77Q48av'

module.exports = {
    PORT, 
    DB_USER, 
    DB_PASSWORD, 
    DB_DATABASE, 
    JWT_SECRET
};