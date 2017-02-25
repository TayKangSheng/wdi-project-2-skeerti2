var User = require('../models/user')
module.exports = function (req, res, next) {
  var isUser = req.user instanceof User
  console.log('isUser ' + isUser )
  if (req.isAuthenticated() === true && isUser) {
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
