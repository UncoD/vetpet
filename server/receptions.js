/* eslint-disable camelcase */
const connecton = require('./db')

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

module.exports = {
  getClientReceptions
}
