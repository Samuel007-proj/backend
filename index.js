require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();


app.use(cors())
app.use(express.json())
//middleware
const reqLogger = (req, resp, next) =>{
  console.log('Method:', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('------')
  next()

}

app.use(reqLogger)
app.use(morgan('combined'))
app.use(express.static('build'))

morgan.token('type', function (req, res) { return req.headers['content-type'] })

const Note = require('./models/note')

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ];

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
app.get('/', (req, resp) => {
    resp.send('<h1>Hello nodemon</h1>')
})

app.get('/api/notes/', (req, resp)=>{
  Note.find({}).then(notes => {
    resp.json(notes)
    })
  })

app.get('/api/notes/:id', (req, resp)=>{
    Note.findById(req.params.id)
        .then(note => {
          if(note){resp.json(note)}
          else{resp.status(404).end()}
    }).catch(err=>{
      console.log(err)
      resp.status(500).end()
    })
})
app.delete('/api/notes/:id', (req, resp) =>{
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    resp.status(204).end()
})

const generateId = ()=>{
  const maxId = notes.length >0 
    ? Math.max(...notes.map(n=>n.id))
    : 0;
    return maxId+1;
  } 

app.post('/api/notes/', (req, resp)=>{
  const body = req.body;

  if(!body.content){
    return resp.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date().toISOString(),
    id: generateId()
      });

  note.save().then(savedNote =>{
    resp.json(savedNote)
  })
})

app.put('/api/notes/:id', (req, resp)=>{
  const body = req.body;
  const id = Number(req.params.id);
  const oldNoteIndex = notes.findIndex(n=>n.id === id)

  const newNote = {
    id: id,
    content: body.content,
    date: new Date().toISOString(),
    important: body.important
  }

  notes.fill(newNote, oldNoteIndex, oldNoteIndex+1);

  resp.json(newNote);
})
//Phonebook

const Person = require('./models/phonebookdb');

app.get('/api/persons', (req, resp)=>{
  Person.find({}).then(people =>{
    resp.json(people)
  })
})

app.get('/api/persons/:id', (req, resp)=>{
  const id  = req.params.id;
  const person = Person.findById(id);

  if(person){
    resp.send(`
      <h4>Name: ${person.name}</h4>
      <p>Number: ${person.number}</p>
      <p>Id: ${person.id}</p>
    `)
  }else{resp.send('<h1>Contact Not Found</h1>')}
})

app.get('/info', (req, resp)=>{
  resp.send(`<h4>Phonebook has info for ${Persons.find({}).length} people</h4>
  <p>${new Date().toString()}</p>`);
})

app.delete('/api/persons/:id', (req, resp)=>{
  const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    
    resp.send(`<h4>deletion successful</h4>`).end()
})

app.post('/api/persons', (req, resp)=>{
  let body  = req.body;

  if(!(body.name && body.number)){
    resp.status(500).send(`<h5>The or number is missing</h5>`)
    resp.end();
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: persons.length+1
  })
  person.save();
  resp.json(person);
})

app.put('/api/persons/:id', (req, resp)=>{
  const newPerson = req.body;
  const id = Number(req.params.id);
  const oldPersonIndex = persons.findIndex(n => n.id === id)
  let person = {
    name: newPerson.name,
    number: newPerson.number,
    id: id
  };

  persons.fill(person, oldPersonIndex, oldPersonIndex+1)
  resp.json(person)
})

app.post('/api/persons/search', (req, resp)=>{
  const str = req.body.searchStr;
  const regexp = new RegExp(`${str}`, 'i')
  const matches = persons.filter(p=>{
   if ( regexp.test(p.name)) return p 
  })

  matches.length ? resp.json(matches) : resp.send(false);
})
const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

