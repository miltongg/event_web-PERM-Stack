import {DataTypes} from "sequelize";
import {sequelize} from "../database/database";
import OTP from "./OTP";
import Comment from "./Comment";
import Event from "./Event";

const User = sequelize.define("users", {
  
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  
  name: {
    type: DataTypes.STRING,
  },

  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  
  token: {
    type: DataTypes.TEXT
  },
  
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  },
  
  cell: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
  
  socials: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },

  userImg: {
    type: DataTypes.STRING
  }
  
}, {
  timestamps: true
});

User.hasOne(OTP, {
  foreignKey: 'userId',
  sourceKey: 'id'
})

User.hasMany(Comment, {
  foreignKey: 'userId',
  sourceKey: 'id'
})

Comment.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'id'
})

Comment.belongsTo(Event, {
  foreignKey: 'eventId',
  targetKey: 'id'
})

OTP.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'id'
})

export default User;