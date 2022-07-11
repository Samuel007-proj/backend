const mongoose = require('mongoose');

const url = process.env.PERSONDB_URI;

console.log('connecting to '+ url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
    }
})
let cnn = mongoose.createConnection(url)

module.exports = cnn.model('Person', personSchema)