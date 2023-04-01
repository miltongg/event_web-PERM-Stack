import { Model, DataTypes } from 'sequelize';
import {sequelize} from "../database/database";

class Event extends Model {
  public id!: string;
  public userId!: string
  public name!: string;
  public date!: Date;
  public location!: string;
  public description!: string;
  public mainImage!: string;
  public eventImages!: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    mainImage: {
      type: DataTypes.STRING
    },
    eventImages: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
  },
  {
    tableName: 'events',
    sequelize,
  },
);

export default Event;