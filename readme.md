## Configs

1- .eslint.js
.prettierrc and
.editorconfig

 2- yarn add sequelize

 3- yarn add sequelize-cli -D
 interface com linha de comandos para o sequelize
 essa interface nao consegue ler arquivos com export default, por isso deve se usar o common js
 .sequelizerc
 e config/database.js

 yarn add pg pg-hstore

underscored tranforma UserGroups em user_groups

--------------------------------------------

## Migrations

Cria a migrations de users:
```
yarn sequelize migration:create --name=create-users
```

Vai criar algo assim na pasta de migrations:
```
'use strict';
 module.exports = {
   //quando a migration for executada
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users'), {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //Client or provider
      // Client: false, prestador: true
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }),
  },

  // quando ocorrer um rollback
  down: (queryInterface) => {
    return queryInterface.dropTable('users')
  }
}
```

<p>Depois de configurar, rode o seguinte comando:</p>

```
yarn sequelize db:migrate
```
<p>Esse comando vai pegar o arquivo e criar a tabela no banco de dados. Só conferir no PostBird</p>

<p>Caso tenha cometido algum erro:</p>

```
yarn sequelize db:migrate:undo
or
yarn sequelize db:migrate:undo:all
```

## Model

<p>User.js => importa o Sequelize e { Model }, cria uma classe que herda de Model, no metodo static init(sequelize) chama o super.init e passa todos os TIPOS das colunas como primeiro parametro, como segundo parametro passa um objeto com o sequelize sequelize e exporta</p>

## DataBase index
<p>Tem que importar o database index no app.js</p>

## Model loading

<p>index.js na pasta database</p>

```
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
  }
}
```

## User create
<p>Controller user </p>

```
  async store(req, res) {
    const userExists = await User.findOne({
      where: { email: req.body.email }
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
```

## Password Hash

<p>yarn add bcryptjs</p>
<p>import bcryptjs on User model</p>


```
ue
```
## Authentication JWT

## Middlewares

## Validation

<p>yarn add yup

import * as Yup from 'yup'</p>
