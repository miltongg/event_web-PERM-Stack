import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/database'
import User from './User'
import Event from './Event'

class Rating extends Model {
    public id!: string
    public userId!: string
    public eventId!: string
    public rating!: number
}

Rating.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        rating: {
          type: DataTypes.STRING,
          defaultValue: 0
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
    },
    {
        tableName: 'ratings',
        timestamps: true,
        sequelize,
    }
)

export default Rating
