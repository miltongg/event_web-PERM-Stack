import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database";
import Comment from "./Comment";
import { STATUS_ACTIVE } from "../helpers/defineConsts";

class News extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public subtitle?: string;
  public tag!: string;
  public slug!: string;
  public date!: Date;
  public description!: string;
  public rating!: number;
  public status!: string;
  public mainImage!: string;
  public images?: string[];
  public commentsCount!: number;
  public views!: number;
}

News.init(
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

    subtitle: {
      type: DataTypes.STRING,
    },

    slug: {
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

    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    mainImage: {
      type: DataTypes.STRING,
    },

    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: STATUS_ACTIVE,
    },

    rating: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
  },
  {
    tableName: "news",
    timestamps: true,
    sequelize,
  }
);

Comment.belongsTo(News, {
  foreignKey: "newsId",
  targetKey: "id",
});

News.hasMany(Comment, {
  foreignKey: "newsId",
  sourceKey: "id",
});

export default News;
