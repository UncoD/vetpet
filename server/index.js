const express = require('express')

// Create express instance
const app = express()

app.get('/', (req, res) => res.status(200).json([{ name: 'Robert' }, { name: 'John' }]))

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port)
}
