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
  const query = `select p.id, p.name, p.phone, ? * SUM(m.buy_price) as cheque from medicines m
                  join providers p
                  on p.id = m.provider_id
                  where m.quantity < ?
                  group by p.id`

  connecton.query(query, [need, quantity], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const getMedByProvAndQuant = ({ id, quantity }) => new Promise((resolve, reject) => {
  const query = `select id, name, quantity, buy_price from medicines m
                  where provider_id = ? and quantity < ?`

  connecton.query(query, [id, quantity], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

const orderMedicines = ({ medicines, quantity }) => new Promise((resolve, reject) => {
  let query = 'INSERT INTO orders (date,provider_id,cheque) VALUES (?, ?, ?);'
  const date = (new Date()).toLocaleString()
  const providers = Object.keys(medicines).map(id => [date, id, medicines[id].buy_price * quantity])
  for (let i = 0; i < providers.length; i++) {
    connecton.query(query, [providers[i][0], providers[i][1]], (err, result) => {
      if (err) { reject(err) } else {
        const order = medicines[providers[i][1]].map(m => [result.insertId, m.id, parseInt(quantity)])
        query = 'INSERT INTO order_items (order_id,medicine_id,quantity) VALUES ?;'
        connecton.query(query, [order], (err, result) => {
          if (err) { reject(err) }
        })
      }
    })
  }
  resolve()
})

const getOrdersAfterDate = ({ date }) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM orders WHERE DATE_FORMAT(`date`, \'%y-%m-%d\') >= DATE_FORMAT(?, \'%y-%m-%d\')'
  connecton.query(query, [date], (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

module.exports = {
  getMedicines,
  getOrderInfo,
  getMedByProvAndQuant,
  orderMedicines,
  getOrdersAfterDate
}
