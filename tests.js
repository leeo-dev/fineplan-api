const jwt = require('jsonwebtoken')
const accessToken = jwt.sign('meu nome', 'anySecret')
console.log(accessToken)
