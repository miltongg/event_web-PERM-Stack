import { Model, DataTypes } from 'sequelize';
import {sequelize} from "../database/database";

class Event extends Model {
  public id!: string;
  public userId!: string
  public name!: string;
  public date!: Date;
  public location?: string;
  public description!: string;
  public rating!: number;
  public mainImage!: string;
  public eventImages?: string[];
  public commentsCount!: number;

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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING
    },
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    mainImage: {
      type: DataTypes.STRING
    },
    eventImages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
    
  },
  {
    tableName: 'events',
    timestamps: true,
    sequelize,
  },
);

export default Event;