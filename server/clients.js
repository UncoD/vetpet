const connecton = require('./db')

const getAllClients = () => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM clients'
  connecton.query(query, (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const getClientsCount = () => new Promise((resolve, reject) => {
  const query = 'SELECT COUNT(*) as count FROM clients'
  connecton.query(query, (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const updateClient = ({ id, name, phone, address }) => new Promise((resolve, reject) => {
  const query = 'UPDATE clients SET name = ?, phone = ?, address = ? WHERE id = ?'
  connecton.query(query, [name, phone, address, id], (err, result) => {
    if (err) { reject(err) } else {
      resolve()
    }
  })
})

const addClient = ({ name, phone, address }) => new Promise((resolve, reject) => {
  const query = 'INSERT INTO clients (name,phone,address) VALUES (?,?,?)'
  connecton.query(query, [name, phone, address], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const deleteClient = ({ id }) => new Promise((resolve, reject) => {
  const query = 'DELETE FROM clients WHERE id = ?'
  connecton.query(query, [id], (err, result) => {
    if (err) { reject(err) } else {
      resolve()
    }
  })
})

const getClientsServeCount = ({ date }) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM client_receptions WHERE DATE_FORMAT(`date`, \'%y-%m-%d\') >= DATE_FORMAT(?, \'%y-%m-%d\')'
  connecton.query(query, [date], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

module.exports = {
  getAllClients,
  updateClient,
  addClient,
  deleteClient,
  getClientsCount,
  getClientsServeCount
}
