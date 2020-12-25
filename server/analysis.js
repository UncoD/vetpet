/* eslint-disable camelcase */
const connecton = require('./db')

const getProvidedServices = () => new Promise((resolve, reject) => {
  const query = `select r.\`date\` as \`date\`,
                    c.id as client_id, c.name as client, s.id as service_id, s.name as service, sum(s.price) as cost, count(s.price)
                  from receptions r
                  join service_items si on r.id = si.reception_id
                  join services s join pets p join clients c
                    on si.service_id = s.id and p.id = r.pet_id and p.client_id = c.id
                  group by c.id, s.id, YEAR(r.\`date\`), MONTH(r.\`date\`)
                  order by r.\`date\``

  connecton.query(query, (err, result) => {
    if (err) { reject(err) } else {
      resolve(result)
    }
  })
})

module.exports = {
  getProvidedServices
}
