/* eslint-disable camelcase */
const connecton = require('./db')

const getAllReceptions = () => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM client_receptions'

  connecton.query(query, (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const getClientReceptions = ({ id, startDate, endDate }) => new Promise((resolve, reject) => {
  const query = `SELECT * FROM client_receptions WHERE client_id = ?
    and DATE_FORMAT(\`date\`, '%y-%m-%d') >= DATE_FORMAT(?, '%y-%m-%d')
    and  DATE_FORMAT(\`date\`, '%y-%m-%d') <= DATE_FORMAT(?, '%y-%m-%d')`

  connecton.query(query, [id, startDate, endDate], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const getReceptionRecipe = ({ id }) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM recipe_sums WHERE reception = ?'

  connecton.query(query, [id], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const getReceptionService = ({ id }) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM service_items as si JOIN services as s ON s.id = si.service_id WHERE si.reception_id = ?'
  connecton.query(query, [id], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const addReception = ({ pet_id, rec_cost, instruction, medicines, services }) => new Promise((resolve, reject) => {
  const query = 'INSERT INTO receptions (date,pet_id,instruction,rec_cost) VALUES (?, ?, ?, ?);'
  const date = (new Date()).toLocaleString()
  let reception_id = -1
  connecton.query(query, [date, pet_id, instruction, rec_cost], (err, result) => {
    if (err) { reject(err) } else {
      reception_id = result.insertId

      if (medicines) {
        medicines = Object.entries(medicines).map(info => [reception_id, parseInt(info[0]), info[1]])
        const mquery = 'INSERT INTO recipe_items (reception_id,medicine_id,quantity) VALUES ?;'
        connecton.query(mquery, [medicines], (err, result) => {
          if (err) { reject(err) }
        })
      }

      if (services) {
        services = services.map(s => [reception_id, parseInt(s.id)])
        const squery = 'INSERT INTO service_items (reception_id,service_id) VALUES ?;'
        connecton.query(squery, [services], (err, result) => {
          if (err) { reject(err) }
        })
      }
      resolve()
    }
  })
})

module.exports = {
  getClientReceptions,
  getReceptionRecipe,
  getAllReceptions,
  addReception,
  getReceptionService
}
