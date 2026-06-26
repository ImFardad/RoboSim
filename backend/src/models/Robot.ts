import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';

interface RobotAttributes {
  id: string;
  userId: string;
  bodyLevel: number;
  batteryLevel: number;
  brainLevel: number;
  engineLevel: number;
  steeringLevel: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RobotCreationAttributes = Optional<
  RobotAttributes,
  'id' | 'bodyLevel' | 'batteryLevel' | 'brainLevel' | 'engineLevel' | 'steeringLevel'
>;

export class Robot extends Model<RobotAttributes, RobotCreationAttributes> implements RobotAttributes {
  declare id: string;
  declare userId: string;
  declare bodyLevel: number;
  declare batteryLevel: number;
  declare brainLevel: number;
  declare engineLevel: number;
  declare steeringLevel: number;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Robot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    bodyLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
    batteryLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
    brainLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 4,
      },
    },
    engineLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
    steeringLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 3,
      },
    },
  },
  {
    sequelize,
    tableName: 'robots',
    modelName: 'Robot',
  }
);
