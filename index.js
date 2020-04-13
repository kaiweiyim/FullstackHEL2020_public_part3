require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())





morgan.token('content',(req,res)=>{
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }else{
        return ''
    }
    
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


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

app.get('/api/persons/:id', (req, res,next) => {
    const id = req.params.id
    Person.findById(id)
    .then(person => {
        if (person){
            res.json(person.toJSON())
        } else {
            response.status(404).end()
        }
        
    })
    .catch(error => next(error))
})


app.post('/api/persons',(req,res,next) => {
    const body = req.body
    const person = new Person({
        name:body.name,
        number:body.number,
    }) 
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
    
})

app.put('/api/persons/:id',(req,res,next) => {
    const body = req.body
    const id = req.params.id
    const person = {
        name : body.name,
        number : body.number
    }

    Person.findByIdAndUpdate(id,person,{new:true})
    .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
}
)


app.delete('/api/persons/:id',(req,res) => {
    const id = String(req.params.id)
    Person.findByIdAndRemove(id)
    .then(result => {
        res.status(204).end()})
    .catch(error => next(error))
    
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).send({ error: 'malformatted id' })
    }  else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
  }
  
app.use(errorHandler)



//3001
const PORT =  process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})