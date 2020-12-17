/* eslint-disable camelcase */
const connecton = require('./db')

const getMedicines = () => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM medicines'

  connecton.query(query, (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const getOrderInfo = ({ quantity, need }) => new Promise((resolve, reject) => {
  const query = `select p.name, p.phone, ? * SUM(m.buy_price) as cheque from medicines m
                  join providers p
                  on p.id = m.prodvider_id
                  where m.quantity < ?
                  group by p.id`

  connecton.query(query, [need, quantity], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

module.exports = {
  getMedicines,
  getOrderInfo
}
