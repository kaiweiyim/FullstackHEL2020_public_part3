require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('content',(req,res)=>{
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }else{
        return ''
    }
    
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]



app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons =>{
        persons.map(person =>person.toJSON())
        res.json(persons)
    })
    
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons =>{
        const msg = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
        res.send(msg)
    })
    })

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if (person){
            res.json(person.toJSON())
        }else{
            res.status(404).end()
        }
        
    })})


app.post('/api/persons',(req,res) => {
    const body = req.body
    if (!body.name || !body.number ){
        return res.status(400).json({ 
            error: 'content missing' 
          })
    }else if (persons.find(p =>p.name === body.name)){
        return res.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    const person = new Person({
        name:body.name,
        number:body.number,
    }) 

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })

    persons = persons.concat(person)


})


app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
    
})


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})