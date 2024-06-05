'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
const functions = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING(45),
        allowNull: true,
        defaultValue: null
      },
      last_name: {
        type: Sequelize.STRING(45),
        allowNull: true,
        defaultValue: null
      },
      username: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      profile_picture_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: true
      },
      country: {
        type: Sequelize.STRING(45),
        allowNull: true,
        defaultValue: null
      },
      languages: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING(25),
        allowNull: true,
        defaultValue: null
      },
      user_role: {
        type: Sequelize.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: -1
      },
      visible: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      },
      date_created: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable('Users');
  }
};

export default functions;