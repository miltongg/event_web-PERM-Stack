import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database";
import { STATUS_ACTIVE } from "../helpers/defineConsts";
import Comment from "./Comment";

class Game extends Model {
  id!: string;
  name!: string;
  description?: string;
  image?: string;
  music?: string;
  type!: string;
  points!: number;
  date!: Date;
  views!: number;
  status!: string;
  rating!: number;
}

Game.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    music: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    view: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

    rating: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: STATUS_ACTIVE,
    },
  },
  {
    tableName: "games",
    timestamps: true,
    sequelize,
  }
);

Game.hasMany(Comment, {
  foreignKey: "gameId",
  sourceKey: "id",
});

export default Game;
