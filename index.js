require('dotenv').config()
const express=require('express')
const morgan = require('morgan')
const app=express()
const Person = require('./models/person')

//const cors = require('cors')
//app.use(cors())

app.use(express.json())
app.use(express.static('build'))
/*
let persons= [
    {
      "name": "b",
      "number": "3",
      "id": 2
    },
    {
      "name": "c",
      "number": "5",
      "id": 3
    },
    {
      "name": "e",
      "number": "1",
      "id": 4
    }
]
*/
morgan.token('body', function(req, res, param) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :req[content-length]  - :response-time ms :body'))

app.get('/info',(req,res)=>{
    res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
})

app.get('/api/persons',(request,response)=>{
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id',(request,response)=>{
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id',(req,res)=>{
    const id= Number(req.params.id)
    persons=persons.filter(pers=>pers.id!==id)
    res.status(204).end()
})

const getFindName=(name)=>{
    Person.find({name}).then(person => {
        return (person)?true:false
    })
}

app.post('/api/persons',(request,response)=>{
    const {name,number}= request.body

    if(!name){
        return res.status(404).json({'error':'name is required'})
    }
    
    if(getFindName(name)){
        return res.status(404).json({'error':'name must be unique'})
    }
    
    if(!number){
        return res.status(404).json({'error':'number is required'})
    }

   
    const person =new Person({
        name,
        number
    })
  
    person.save().then(savedPerson=>{
      response.json(savedPerson)
    })
})

PORT=process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Servidor Corriendo en Puerto: ${PORT}`)
})