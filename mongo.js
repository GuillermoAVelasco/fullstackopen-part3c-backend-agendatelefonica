const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://root:${password}@cluster0.dbztf.mongodb.net/persons?ssl=true`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)



if(process.argv.length >3){
    
    const person = new Person({
        name,
        number
    })

    person.save().then(result => {
    console.log(`addeD ${name} ${number} to phonebook`)
    mongoose.connection.close()
    })

}
else {

    Person.find({}).then(result => {
    result.forEach(pers => {
      console.log(`${pers.name} ${pers.number} \n`)
    })
    mongoose.connection.close()
  })

}