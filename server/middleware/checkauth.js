// to check once user login, then only get the routes dashboard

exports.isLoggedIn = function (req, res, next) {
    if(req.user) {
      next();
    } else {
      res.status(401).render('401',{
        user: req.user
      });
    }
  }