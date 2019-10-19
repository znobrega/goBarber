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


## Multer

<p>Upload de arquivos com multipart form data</p>

<p>No arquivo multer.js é feita a configuração, ou seja, o nome que a imagem será salva e em qual diretória ela será salva</p>

```
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..','..', 'tmp', 'uploads'),
    filename: (req, file, cb) {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extName(file.originalName))
      })
    }
  }),
};

```

<p>Com o arquivo de configuração é necessário criar uma middleware na rota que receberá a imagem. Importamos o multer e sua configuração no arquivo de routes, passamos as configurações como parametro do multer() e atribuimos à alguma variável. Usamos essa variável como middleware, usando o método single('file') que representa o upload único com o campo file</p>

## FileController
<p>Nova tabela no banco de dados</p>
>yarn sequelize migration:create --name=create-files

<p>Informação cedida pelo multer: </p>

```
const { originalname: name, filename: path } = req.file;

```


## Associates

<p>Expansão de dados dos campos que possuem relacionamento</p>

```
const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      }],
    });
```

## Pagination

```
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.provider_id,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
```

## date-fns

>parseISO(<String>): Transforma uma string date em um OBJECT DATE
>isBefore(<Date>, <Date>): Verifica se a data é anterior a outra
>startOfHour(<Date>): Somente hora da data
>startOfDay(<Date>): Hora inicial do dia
>endOfDay(<Date>): Hora final do dia
>format(<Date>, <String>, <Object> configs)

```
  const formattedDate = format(
    hourStart,
    "'dia' dd 'de' MMM, 'ás' H:mm'h'",
    {
      locale: pt,
    },
  );
```

## Using NoSql, MongoDB

>docker run --name mongoBarber -p 27017:27017 -d -t mongo

>yarn add mongoose

<ul>
<li>Muito performático</li>
<li>Quando não precisar de relacionamentos</li>
<li>Guarda o estado do determinado momento
    <p>No chat do discord, por exemplo, quando algum usuário muda o nome as mensagens antigas permanecem com o nome antigo</p>
</li>
</ul>

<p>As notificações ficam da seguinte maneira: </p>

```
/**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });
```

<p>Sempre que um usuário fizer um agendamento, o provedor do serviço receberá uma notificação. </p>

<p>Ordenação decrescente com o mongo: </p>

```
    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' }).limit(20);

```

<p>Metodo findByIdAndUpdate tem o retorno void, para que ele retorne o registro atualizado é preciso passar o terceiro parametro { new: true }</p>

```
findByIdAndUpdate(<MongoID> id, <Object>, <Object> config)

    const notification = Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

```
