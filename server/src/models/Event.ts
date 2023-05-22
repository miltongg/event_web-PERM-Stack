import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database";
import Comment from "./Comment";
import Reply from "./Reply";

class Event extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public date!: Date;
  public description!: string;
  public mainImage!: string;
  public eventImages?: string[];
  public status!: string;
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

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
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
