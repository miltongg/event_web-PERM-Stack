import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("anime_group_db", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres",
});
