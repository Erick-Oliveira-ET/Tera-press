const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');


router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new.ejs');
});

router.post('/categories/save', (req,res)=>{
  var title = req.body.title;

  if (title != undefined) {
    Category.findOne({where: {title: title}}).then( category => {

      if(category == undefined){
        Category.create({
          title: title,
          slug: slugify(title)
          }).then(() => {
            res.redirect('/');
          });

      } else{
        res.redirect('/admin/categories/new');
      }

    });
  }
});

router.get('/admin/categories/', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories/index.ejs', {categories: categories});
  });

});

router.post('/categories/delete', (req,res) => {
  var id = req.body.id;
  if (id != undefined) {
    if(!isNaN(id)) {

      Category.destroy({
        where: {
          id : id
        }
      }).then(() => {
        res.redirect('/admin/categories');
      });

    } else {//se id não for um número
      res.redirect('/admin/categories');
    }

  } else {//se id for vazio
    res.redirect('/admin/categories');
}});

router.get("/admin/categories/edit/:id", (req,res) => {
  var id = req.params.id;

  if(isNaN(id)){
    res.redirect('/admin/categories');
  }

  Category.findByPk(id).then(category => {
    if (category != undefined){
      res.render("admin/categories/edit.ejs", {category: category});

    }else{
      res.redirect('/admin/categories');
    }
  });
});

router.post("/categories/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;

  Category.findOne({where: {title: title}}).then( category => {

    if(category == undefined){


      Category.update({title: title, slug: slugify(title)}, {
        where: {
          id: id
        }
      }).then(() => {
        res.redirect("/admin/categories");
      });


    } else {
      res.redirect("/admin/categories/edit/id");
            }
  });

});


module.exports = router;
