import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';

interface ScriptAttributes {
  id: string;
  userId: string;
  name: string;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ScriptCreationAttributes = Optional<ScriptAttributes, 'id'>;

export class Script extends Model<ScriptAttributes, ScriptCreationAttributes> implements ScriptAttributes {
  declare id: string;
  declare userId: string;
  declare name: string;
  declare code: string;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Script.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'scripts',
    modelName: 'Script',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'name'],
      },
    ],
  }
);
