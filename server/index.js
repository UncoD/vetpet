const express = require('express')
const bodyParser = require('body-parser')
const clients = require('./clients')
const pets = require('./pets')
const receptions = require('./receptions')

const app = express()

app.use(bodyParser.json())

app.get('/get-clients', (req, res) => {
  clients.getAllClients()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/update-client', (req, res) => {
  clients.updateClient(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/add-client', (req, res) => {
  clients.addClient(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/delete-client', (req, res) => {
  clients.deleteClient(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.get('/get-pets', (req, res) => {
  pets.getAllPets()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/update-pet', (req, res) => {
  pets.updatePet(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/add-pet', (req, res) => {
  pets.addPet(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/delete-pet', (req, res) => {
  pets.deletePet(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-client-pets', (req, res) => {
  pets.getPetByClientName(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-client-receptions', (req, res) => {
  receptions.getClientReceptions(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

module.exports = app

if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port)
}
