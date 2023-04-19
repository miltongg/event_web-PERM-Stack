import {DataTypes} from "sequelize";
import {sequelize} from "../database/database";

const OTP = sequelize.define("otp", {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  email: {
    type: DataTypes.STRING
  },
  
  otp: {
    type: DataTypes.STRING,
    // allowNull: false
  }
  
}, {
  timestamps: true
})

export default OTP;