const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

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



const generateId = () => {
    const id = Math.floor(Math.random() * Math.floor(1000000000000))
    return id
}

app.get('/', (req, res) => {
res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {

    res.json(persons)
})

app.get('/info', (req, res) => {
    const msg = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    res.send(msg)
    })

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person =>(Number(person.id)===Number(id)))
    if (person){
        res.json(person)
    }else{
        res.status(404).end()
    }
    })


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
    const person = {
        name:body.name,
        number:body.number,
        id:generateId()
    } 
    persons = persons.concat(person)
    res.json(person)

})


app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
    
})

//process.env.PORT || 
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})