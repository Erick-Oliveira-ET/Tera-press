const express = require("express");
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./User');
const adminAuth = require("../middleWares/adminAuth");

router.post("/user/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    //Criação da hash da senha
    User.findOne({where:{email: email}}).then(user => {
      if(user == undefined){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        User.create({
          email: email,
          password: hash
        }).then(() => {
          res.send("Cadastrado com sucesso");
        }).catch((err) => {
          res.send(err);
        });
      } else {
        res.redirect("/login");
      }
    });
});

router.get("/register", (req, res) =>{
  res.render("admin/users/create.ejs");
})

router.get("/login", (req, res) => {
  res.render("admin/users/login.ejs");
})

router.post("/authenticate", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({where: {email: email}}).then(user => {
    if(user != undefined){
      var checkPassword = bcrypt.compareSync(password, user.password);
      if(checkPassword){
        req.session.userauth = {
          id: user.id,
          email: user.email
        }

        res.redirect("/");
      } else {
        res.send("Errou a senha otario" + user.id)
      }
    } else {
      res.redirect("/register");
    }

  });

});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
})

router.get("/user/list", adminAuth, (req,res) => {
  User.findAll().then(users => {
    res.render("admin/users/index.ejs",{
      users: users
    });

  });

});

router.post("/user/delete", adminAuth, (req, res) => {
  var id = req.body.id;

  User.findOne({where:{id: id}}).then( user => {
    if(user != undefined){
      if(! isNaN(id)){
        User.destroy({
          where : {
            id: id
          }
        }).then(() => {
          res.redirect("/user/list");
        });
      } else {
        res.send("esse id não é um número" + id + isNaN(id));
      }

    } else {
      res.send("Não achei esse usuário");
    }

  });

});

module.exports = router;
