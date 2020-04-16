function adminAuth(req, res, next){
  if(req.session.userauth != undefined){
    next();
  } else{
    res.redirect("/login");
  }
}

module.exports = adminAuth;
