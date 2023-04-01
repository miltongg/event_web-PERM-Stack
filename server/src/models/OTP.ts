import {DataTypes} from "sequelize";
import {sequelize} from "../database/database";

const OTP = sequelize.define("otp", {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  otp: {
    type: DataTypes.STRING,
    // allowNull: false
  }
  
}, {
  timestamps: true
})

export default OTP;