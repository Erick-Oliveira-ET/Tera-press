const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify')
const adminAuth = require('../middleWares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    include : [{model: Category}] //Inclui o model Category, na passagem de dados. Lembrando que o model é a conexão com uma determinada table. A função findAll vai puxar todos os artigos e, devido ao relacionamento, vai puxar as categorias correspondentes
  }).then(articles => {
    res.render('admin/articles/index.ejs', {
      articles: articles
    });
  })

});

router.get('/admin/articles/new', adminAuth, (req, res) => {
  Category.findAll().then(categories => {
  res.render('admin/articles/new.ejs', {categories: categories});
  })

})

router.post('/admin/articles/save', adminAuth, (req, res)=>{
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category //Essa coluna da tabela é criada quando é estabelecida a relação entre aritcle e category (Articles.belongsTo(Categoy);), conhecido como chave estrangeira
  }).then(() => {
    res.redirect('/admin/articles');
  });

});

router.post('/admin/article/delete', adminAuth, (req,res) => {
  var id = req.body.id;
  if (id != undefined) {
    if(!isNaN(id)) {

      Article.destroy({
        where: {
          id : id
        }
      }).then(() => {
        res.redirect('/admin/articles');
      });

    } else {//se id não for um número
      res.redirect('/admin/articles');
    }

  } else {//se id for vazio
    res.redirect('/admin/articles');
}});

router.get("/admin/article/edit/:id", adminAuth, (req,res) => {
  var id = req.params.id;

  if(isNaN(id)){
    res.redirect('/admin/articles');
  }

  Article.findByPk(id).then(article => {
    if (article != undefined){
      Category.findAll().then(categories => {
        res.render("admin/articles/edit.ejs", {article: article, categories: categories});
      })

    }else{
      res.redirect('/admin/articles');
    }
  });
});

router.post("/article/update", adminAuth, (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var categoryId = req.body.category;

  Article.update({
    title: title,
    slug: slugify(title),
    categoryId: categoryId},{
      where: {
        id: id
      }
        }).then(() => {
          res.redirect("/admin/articles");
        });
});

router.get("/articles/page/:num", (req, res) => {
  var page = req.params.num;
  var offset;
  var result;

  if(isNaN(page) || page==1){
    offset = 0;
  } else {
    offset = parseInt(page)*4;
  }

  Article.findAndCountAll({
    order: [
      ['id', 'DESC']
    ], //Pesquisa todos elementos na tabela. Retorna todos os artigos e a contagem de artigos (retorna: count e rows)
    limit: 4, //limita a quantidade de artigos para 4 por vez
    offset: offset //seta a partir de qual elemento começa a contagem
  }).then(articles => {

    var next;
    if(articles.count >= offset+4){
      next = true;
    } else{
      next = false;
    }

    result = {
      page: parseInt(page),
      next: next,
      articles: articles
    };
    Category.findAll().then(categories =>{
      res.render("admin/articles/page.ejs",{
        result: result,
        categories: categories
      });
    });
  });
});

module.exports = router;
