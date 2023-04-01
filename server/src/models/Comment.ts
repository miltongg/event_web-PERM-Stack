import {DataTypes, Model} from "sequelize";
import {sequelize} from "../database/database";
import User from "./User";
import Event from "./Event";

class Comment extends Model {
  public id!: string;
  public comment!: string;
  public userId!: string;
  public eventId!: string;
  public userImg!: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Event,
        key: 'id',
      },
    },
    userImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize,
  }
);

export default Comment;