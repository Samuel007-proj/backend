const personsRouter = require('express').Router()
const Person = require('../models/phonebookdb')

personsRouter.get('/', (req, resp, next) => {
    Person.find({}).then(people => {
        resp.json(people)
    }).catch(err => next(err))
})

personsRouter.get('/info', (req, resp, next) => {
    Person.countDocuments({})
        .then(count => {
            resp.send(`<h4>Phonebook has info for ${count} people</h4>
            <p>${new Date().toString()}</p>`)
        })
        .catch(err => next(err))
})

personsRouter.get('/:id', (req, resp, next) => {
    const id  = req.params.id
    Person.findById(id)
        .then(person => {
            if(person){
                resp.json(person)
            } else { resp.status(404).end() }
        })
        .catch(err => {
            next(err)
        })
})


personsRouter.post('/', (req, resp, next) => {
    let body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(person => resp.json(person))
        .catch(err => next(err))
})

personsRouter.delete('/:id', (req, resp, next) => {
    const id = req.params.id
    Person.findByIdAndRemove(id)
        .then(() => {
            resp.status(204).json(`I don't have that!`)
        })
        .catch(err => next(err))
})

personsRouter.put('/:id', (req, resp, next) => {
    const newPerson = req.body
    const id = req.params.id
    let person = {
        name: newPerson.name,
        number: newPerson.number,
    }

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
        .then(person => {
            if(person){
                resp.json(person)
            } else(resp.status(204).json('failed to update'))
        })
        .catch(err => next(err))
})

personsRouter.post('/search', (req, resp, next) => {
    const str = req.body.searchStr
    const regexp = new RegExp(`${str}`, 'i')
    console.log(regexp)
    Person.find({ name: regexp })
        .then(matches => {
            if(matches){
                resp.json(matches)
            } else(resp.status(204).json('No matches'))
        }).catch(err => next(err))
})

module.exports = personsRouter