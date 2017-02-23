module.exports = function (req, res, next) {
  if (req.isAuthenticated() === true) {
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
