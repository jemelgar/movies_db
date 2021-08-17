const path = require("path");
const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const Actor = require("../database/models/Actor");

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;
const actor_movie = db.actor_movie;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  },
  //Aqui dispongo las rutas para trabajar con el CRUD
  add: function (req, res) {
    Genres.findAll().then(function (allGenres) {
      return res.render("moviesAdd", { allGenres });
    });
  },
  create: function (req, res) {
    Movies.create({
      title: req.body.title,
      rating: req.body.rating,
      awards: req.body.awards,
      release_date: req.body.release_date,
      length: req.body.length,
      genre_id: req.body.genre_id,
    }).then((newMovie) => {
      res.redirect("/movies");
    });
  },
  edit: function (req, res) {
    let pedidoPelicula = Movies.findByPk(req.params.id);
    let pedidoGeneros = Genres.findAll();
    Promise.all([pedidoPelicula, pedidoGeneros]).then(function ([
      Movie,
      allGenres,
    ]) {
      res.render("moviesEdit", { Movie, allGenres });
    });
  },
  update: function (req, res) {
    Movies.update(
      {
        title: req.body.title,
        rating: req.body.rating,
        awards: req.body.awards,
        release_date: req.body.release_date,
        length: req.body.length,
        genre_id: req.body.genre_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((newMovie) => {
      res.redirect("/movies/detail/" + req.params.id);
    });
  },
  delete: function (req, res) {},

  destroy: function (req, res) {
    let borraAC = actor_movie.destroy({
      where: {
        movie_id: req.params.id,
      },
    });

    let ActualizaAc = Actors.update(
      {
        favorite_movie_id: null,
      },
      {
        where: {
          favorite_movie_id: { [db.Sequelize.Op.eq]: req.params.id },
        },
      }
    );
    Promise.all([borraAC, ActualizaAc]).then(function () {
      Movies.destroy({
        where: {
          id: req.params.id,
        },
      }).then(() => {
        res.redirect("/movies");
      });
    });
  },
};

module.exports = moviesController;
