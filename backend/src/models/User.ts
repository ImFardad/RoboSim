import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';

interface UserAttributes {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Some attributes are optional when calling User.create()
export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'avatarId'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare username: string;
  declare email: string;
  declare passwordHash: string;
  declare avatarId: number;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 30],
        isAlphanumeric: true, // Prevent special characters in usernames for security
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: () => Math.floor(Math.random() * 10) + 1,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    hooks: {
      // Normalize values before saving to database
      beforeValidate: (user) => {
        if (user.email) {
          user.email = user.email.trim().toLowerCase();
        }
        if (user.username) {
          user.username = user.username.trim().toLowerCase();
        }
      },
    },
  }
);
