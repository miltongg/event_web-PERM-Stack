import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/database";
import { STATUS_ACTIVE } from "../helpers/defineConsts";

class Comment extends Model {
  id!: string;
  comment!: string;
  rating!: number;
  userId!: string;
  newsId?: string;
  eventId?: string;
  gameId?: string;
  username!: string;
  userImg?: string;
  repliesCount?: number;
  status!: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    repliesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    eventId: {
      type: DataTypes.STRING,
    },
    newsId: {
      type: DataTypes.STRING,
    },
    gameId: {
      type: DataTypes.STRING,
    },
    // userId: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
    // eventId: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   references: {
    //     model: Event,
    //     key: "id",
    //   },
    // },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userImg: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: STATUS_ACTIVE,
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    sequelize,
  }
);

export default Comment;
