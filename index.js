const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');
const session = require("express-session");

//Organization and Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');

//Tables and database of the routes
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

//View engine
app.set("View engine", "ejs");

//Static
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Sessions
app.use(session({
  secret: " adkçalskdaçlsdkaçsldks ", //senha da sessão. Tem que ser aleatório,
  cookie: { maxAge: 3000000} //(milisegundos) Tempo que a conexão do usuário com o servidor vai durar por meio de cookies

}))

connection
  .authenticate()
  .then(() => {
    console.log("Autenticação feita com sucesso");
  }).catch((error) => {
    console.log(error);
  })

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/', (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
        res.render('index.ejs', {articles: articles, categories: categories});
    });

  });
});

app.get("/:slug", (req,res)=> {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article != undefined){
      Category.findAll().then(categories => {
          res.render('article.ejs', {article: article, categories: categories});
      });
    } else {
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  });
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{model: Article}]
  }).then(category => {
    if(category != undefined){

      Category.findAll().then(categories => {
        res.render("index.ejs", {articles: category.articles, categories: categories});
      });

    } else{
      res.redirect("/");
    }
  }).catch(err => {
    res.r
  });
});

app.listen(8080, () =>{
  console.log('O servidor está rodando!');
})
