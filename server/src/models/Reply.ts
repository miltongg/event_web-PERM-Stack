import {DataTypes, Model} from "sequelize";
import {sequelize} from "../database/database";
import User from "./User";
import Comment from "./Comment";

class Reply extends Model {
  public id!: string;
  public comment!: string;
  public userId!: string;
  public commentId!: string;
  public username!: string;
  public userImg?: string;
  
}

Reply.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    reply: {
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
    // commentId: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   references: {
    //     model: Comment,
    //     key: 'id',
    //   },
    // },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    repliedToName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    repliedToId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    userImg: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'replies',
    timestamps: true,
    sequelize,
  }
);

Comment.hasMany(Reply, {
  foreignKey: 'commentId',
  sourceKey: 'id'
})

Reply.belongsTo(Comment, {
  foreignKey: 'commentId',
  targetKey: 'id'
})

export default Reply;