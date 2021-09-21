require('dotenv').config()
const express=require('express')
const morgan = require('morgan')
const app=express()
const Person = require('./models/person')

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function(req, res, param) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :req[content-length]  - :response-time ms :body'))

app.get('/info',(req,res)=>{
    Person.find({}).then(persons => {
        res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
    })    
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

app.delete('/api/persons/:id',(req,res,next)=>{
    Person.findByIdAndRemove(req.params.id)
    .then(result=>{
        res.status(204).end()
    })
    .catch(error=> next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
    const {name,number} = request.body
  
    const person = {
      number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))  
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
app.use(errorHandler)


PORT=process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Servidor Corriendo en Puerto: ${PORT}`)
})