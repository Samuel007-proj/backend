const mongoose = require('mongoose');

const url = process.env.MONGODB_URI
console.log(url)
console.log('connecting to', url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})
noteSchema.set('toJSON', {
  transform:(document, returnedObject)=>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

mongoose
  .connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })
  
  /** mongoose
  .connect(url)
 .then((result) => {
    console.log('connected')

    const note = new Note({
      content: 'HTML is Easy',
      date: new Date(),
      important: true,
    })

    return note.save()
  })
  .then(() => {
    console.log('note saved!')
    return mongoose.connection.close()
  .catch((err) => console.log(err))
  }) **/


module.exports = mongoose.model('Note', noteSchema)
  