const mongoose = require('mongoose')
const { info } = require('../utils/logger')

const url = process.env.PERSONDB_URI

console.log('connecting to '+ url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                let nArr = v.split('-')
                let n1 =nArr[0].length,n2=nArr[1].length
                console.log(n1 ,n2)
                return (n1 ===2 ||n1===3) && (n2 === 8|| n2===9)
            },
            message:props => `${props.value} is not a valid phone number`
        },
        required: [true, 'User phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
let cnn = mongoose.createConnection(url)
if(cnn) { cnn.on('connected', () => info('connected to PhoneDB')) }
module.exports = cnn.model('Person', personSchema)