import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/database";
import Comment from "./Comment";
import { STATUS_ACTIVE } from "../helpers/defineConsts";

class Reply extends Model {
  id!: string;
  comment!: string;
  userId!: string;
  elementId?: string;
  commentId!: string;
  username!: string;
  userImg?: string;
  status!: string;
}

Reply.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    reply: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    elementId: {
      type: DataTypes.STRING,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    repliedToName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    repliedToId: {
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
    tableName: "replies",
    timestamps: true,
    sequelize,
  }
);

Comment.hasMany(Reply, {
  foreignKey: "commentId",
  sourceKey: "id",
});

Reply.belongsTo(Comment, {
  foreignKey: "commentId",
  targetKey: "id",
});

export default Reply;
