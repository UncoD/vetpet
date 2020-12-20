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

const addReception = ({ pet_id, rec_cost, instruction, medicines }) => new Promise((resolve, reject) => {
  let query = 'INSERT INTO receptions (date,pet_id,instruction,rec_cost) VALUES (?, ?, ?, ?);'
  const date = (new Date()).toLocaleString()
  connecton.query(query, [date, pet_id, instruction, rec_cost], (err, result) => {
    if (err) { reject(err) } else {
      medicines = Object.entries(medicines).map(info => [result.insertId, parseInt(info[0]), info[1]])
      query = 'INSERT INTO recipe_items (reception_id,medicine_id,quantity) VALUES ?;'
      connecton.query(query, [medicines], (err, result) => {
        if (err) { reject(err) } else {
          resolve(result)
        }
      })
    }
  })
})

module.exports = {
  getClientReceptions,
  getReceptionRecipe,
  getAllReceptions,
  addReception
}
