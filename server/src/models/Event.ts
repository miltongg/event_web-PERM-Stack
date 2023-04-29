import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database";
import Comment from "./Comment";

class Event extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public date!: Date;
  public description!: string;
  public rating!: number;
  public mainImage!: string;
  public eventImages?: string[];
  public commentsCount!: number;
  public views!: number;
}

Event.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.STRING,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    rating: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    mainImage: {
      type: DataTypes.STRING,
    },

    eventImages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    tableName: "events",
    timestamps: true,
    sequelize,
  }
);

Comment.belongsTo(Event, {
  foreignKey: "eventId",
  targetKey: "id",
});

Event.hasMany(Comment, {
  foreignKey: "eventId",
  sourceKey: "id",
});

export default Event;
