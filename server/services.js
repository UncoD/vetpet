/* eslint-disable camelcase */
const connecton = require('./db')

const getServices = () => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM services'

  connecton.query(query, (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

module.exports = {
  getServices
}
