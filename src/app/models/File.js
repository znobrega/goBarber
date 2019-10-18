import Sequelize, { Model } from 'sequelize';

const BASE_URL = 'localhost:3000';

class File extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `http://${BASE_URL}/files/${this.path}`;
        },
      },
    },
    {
      sequelize,
    });


    return this;
  }
}

export default File;
