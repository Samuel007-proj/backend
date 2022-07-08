const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const password = process.argv[2]
const name = process.argv[3]
        number = process.argv[4];

const url = `mongodb+srv://Soyelami019:${password}@cluster0.zqnisf0.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema)
mongoose
    .connect(url)
    .then(result=>{
        console.log('connected');

        const person = new Person({
            name: name,
            number: number
        })

        return person.save();
    }
    ).then(()=>{
        console.log('person saved')
        mongoose.connection.close()
    }).catch(err=>console.log(err));

mongoose.connect(url)
        Person.find({}).then(result=>{
            result.forEach(p => console.log(`added ${p.name} number ${p.number} to phonebook`))
            mongoose.connection.close()
        })
        .catch(err=> console.log(err))