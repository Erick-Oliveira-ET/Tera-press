const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
  title:{
    type: Sequelize.STRING,
    allowNull: false
  },
  slug:{
    type: Sequelize.STRING,
    allowNull:false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

Category.hasMany(Article); //Uma categoria tem muitos artigos
Article.belongsTo(Category); //Um artigo tem uma categoria. Esse método cria uma chave estangeiras no banco de articles que referencia ao banco de categorias criando uma coluna denominada "categoryId"

module.exports = Article;
