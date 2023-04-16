import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/database";
import User from "./User";
import Event from "./Event";

class Rating extends Model {
  public id!: string;
  public userId!: string;
  public eventId!: string;
}

Rating.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
  },
  {
    tableName: "ratings",
    timestamps: true,
    sequelize,
  }
);

export default Rating;


