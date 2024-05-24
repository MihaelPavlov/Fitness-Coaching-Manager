import { DataTypes, Model } from "sequelize";
import connection from "./../connection";

class User extends Model {
  public readonly id!: number;
  public first_name!: string | null;
  public last_name!: string | null;
  public username!: string;
  public email!: string;
  public password!: string;
  public profile_picture_url!: string | null;
  public country!: string | null;
  public languages!: string;
  public phone_number!: string | null;
  public user_role!: number;
  public visible!: number;
  public date_created!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  first_name: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: null
  },
  last_name: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: null
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  profile_picture_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  country: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: null
  },
  languages: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(25),
    allowNull: true,
    defaultValue: null
  },
  user_role: {
    type: DataTypes.TINYINT({ length: 1 }),
    allowNull: false,
    defaultValue: -1
  },
  visible: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1
  },
  date_created: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "users",
  sequelize: connection
});

export default User;