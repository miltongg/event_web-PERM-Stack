import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/database";
import OTP from "./OTP";
import Comment from "./Comment";
import Reply from "./Reply";

class User extends Model {
  id!: string;
  username!: string;
  email!: string;
  password!: string;
  role!: string;
  token?: string;
  cell?: string;
  socials?: string[];
  userImg?: string;
  status!: string;
  score?: number;
  likes?: string[];
  dislikes?: string[];

  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly comments?: Comment[];
  readonly replies?: Reply[];
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
    },

    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: "admin",
    },

    token: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },

    cell: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    socials: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },

    userImg: {
      type: DataTypes.STRING,
    },

    likes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },

    dislikes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },

    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    sequelize,
  }
);

User.hasOne(OTP, {
  foreignKey: "userId",
  sourceKey: "id",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  sourceKey: "id",
});

User.hasMany(Reply, {
  foreignKey: "userId",
  sourceKey: "id",
});

// Comment.belongsTo(User, {
//   foreignKey: 'userId',
//   targetKey: 'id'
// })

OTP.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

export default User;
