/* eslint-disable camelcase */
const connecton = require('./db')

const getAllPets = () => new Promise((resolve, reject) => {
  const query = 'SELECT pets.*, clients.name as owner FROM pets JOIN clients ON clients.id = pets.client_id'
  connecton.query(query, (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const updatePet = ({ id, name, kind }) => new Promise((resolve, reject) => {
  const query = 'UPDATE pets SET name = ?, kind = ? WHERE id = ?'
  connecton.query(query, [name, kind, id], (err, result) => {
    if (err) { reject(err) } else {
      resolve()
    }
  })
})

const addPet = ({ name, kind, client_id }) => new Promise((resolve, reject) => {
  const query = 'INSERT INTO pets (name,kind,client_id) VALUES (?,?,?)'
  connecton.query(query, [name, kind, client_id], (err, result) => {
    if (err) { reject(err) } else {
      resolve()
    }
  })
})

const deletePet = ({ id }) => new Promise((resolve, reject) => {
  const query = 'DELETE FROM pets WHERE id = ?'
  connecton.query(query, [id], (err, result) => {
    if (err) { reject(err) } else {
      resolve()
    }
  })
})

const getPetByClientName = ({ name }) => new Promise((resolve, reject) => {
  const query = 'SELECT pets.*, clients.name as owner FROM pets JOIN clients ON clients.id = pets.client_id WHERE INSTR(clients.name, ?)'
  connecton.query(query, [name], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

module.exports = {
  getAllPets,
  updatePet,
  addPet,
  deletePet,
  getPetByClientName
}
