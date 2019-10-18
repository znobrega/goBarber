
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'avatar_id', {
    type: Sequelize.INTEGER,
    references: { model: 'files', key: 'id' },
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }),

  down: (queryInterface) => queryInterface.removeColumn('users', 'avatar_id'),
};
