// const mongoose = require('mongoose')
var Chef =require('../models/chef')
module.exports = function (req, res, next) {
  var isChef = req.user instanceof Chef
  console.log("isChef = " + isChef)
  if (req.isAuthenticated() === true && isChef === true) {
    next()
  } else {
    // req.flash('flash', {
    //   type: 'danger',
    //   message: 'Restricted page, please log in'
    // })

    req.flash('danger', 'Restricted page, please log in')
    console.log('restricted page, please log in')
    res.redirect('/login')
  }
}
