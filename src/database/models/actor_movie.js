module.exports = (sequelize, dataTypes) => {
  let alias = "actor_movie";
  let cols = {
    id: {
      type: dataTypes.BIGINT(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    // created_at: dataTypes.TIMESTAMP,
    // updated_at: dataTypes.TIMESTAMP,
    actor_id: {
      type: dataTypes.STRING(100),
      allowNull: false,
    },
    movie_id: {
      type: dataTypes.STRING(100),
      allowNull: false,
    },
  };
  let config = {
    timestamps: true,
    tableName: "actor_movie",
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: false,
  };
  const actor_movie = sequelize.define(alias, cols, config);

  return actor_movie;
};
