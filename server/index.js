const express = require('express')
const bodyParser = require('body-parser')
const clients = require('./clients')
const pets = require('./pets')
const receptions = require('./receptions')
const store = require('./store')
const services = require('./services')
const analysis = require('./analysis')

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

app.post('/get-client-pets-by-id', (req, res) => {
  pets.getPetByClientId(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-client-receptions', (req, res) => {
  receptions.getClientReceptions(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-reception-recipe', (req, res) => {
  receptions.getReceptionRecipe(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-reception-service', (req, res) => {
  receptions.getReceptionService(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.get('/get-medicines', (req, res) => {
  store.getMedicines()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-order-info', (req, res) => {
  store.getOrderInfo(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.get('/get-receptions', (req, res) => {
  receptions.getAllReceptions()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/add-reception', (req, res) => {
  receptions.addReception(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-med-by-prov-and-quant', (req, res) => {
  store.getMedByProvAndQuant(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/order-medicines', (req, res) => {
  store.orderMedicines(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.get('/get-clients-count', (req, res) => {
  clients.getClientsCount()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.get('/get-pets-count', (req, res) => {
  pets.getPetsCount()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-clients-serve-count', (req, res) => {
  clients.getClientsServeCount(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-orders-after-date', (req, res) => {
  store.getOrdersAfterDate(req.body)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.get('/get-services', (req, res) => {
  services.getServices()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

app.post('/get-provided-services', (req, res) => {
  analysis.getProvidedServices()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error))
})

module.exports = app

if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port)
}
