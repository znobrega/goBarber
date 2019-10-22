## Configs

1- .eslint.js
.prettierrc and
.editorconfig

> 2- yarn add sequelize

> 3 - yarn add sequelize-cli -D

<p>
 O sequelize-cli é uma interface com linha de comandos para o sequelize
 essa interface não consegue ler arquivos com export default, por isso deve se usar o common js nos arquivos que ela usa, como:
 .sequelizerc
 e config/database.js</p>

 >yarn add pg pg-hstore

 ---

## Database
<p>Configurações para o banco underscored tranforma UserGroups em user_groups</p>

---

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

---
## Model

<p>User.js => importa o Sequelize e { Model }, cria uma classe que herda de Model, no metodo static init(sequelize) chama o super.init e passa todos os TIPOS das colunas como primeiro parametro, como segundo parametro passa um objeto com o sequelize sequelize e exporta</p>

---
## DataBase index
<p>Tem que importar o database index no app.js</p>
---

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

---
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
---
## Password Hash

> yarn add bcryptjs
<p>import bcryptjs on User model</p>

<p>Antes de salvar a senha do usuário, pegar a senha do campo VIRTUAL, encriptar e salvar no campo password_hash.
É possível fazer isso usando os hooks do sequelize </p>


```
ue
```
## Authentication JWT
---

## Middlewares
---

## Validation

<p>yarn add yup

import * as Yup from 'yup'</p>

```
const schema = Yup.object().shape({
  password: Yup.string().min(6).required(),
  confirmPassword: Yup.string()
    .when('password', (password, field) => {
      password ? [Yup.refs]
    })
})
```

---

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

<p>Com o novo o model file, precisamos criar um relacionamento com o model User</p>
<p>Para isso precisamos fazer algumas alterações em User:</p>

- Criar uma nova migration para adicionar uma coluna a tabela, essa coluna será o relacionamento com File

```
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
```

- No model user criamos um metodo static associate, onde, recebemos os models e usamos o metodo **belongsTo** do sequelize para fazer o relacionamento.

```
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
```
- No index do database, chamamos esse metodo associate após o método init

```
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }
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


><strong>parseISO(```<String>```):</strong> Transforma uma string date em um OBJECT DATE
<br/>
<strong>isBefore(```<Date>, <Date>```):</strong> Verifica se a data é anterior a outra
<br/>
<strong>startOfHour(```<Date>```):</strong> Somente hora da data
<br/>
<strong>startOfDay(```<Date>```):</strong> Hora inicial do dia
<br/>
<strong>endOfDay(```<Date>```):</strong> Hora final do dia
<br/>
<strong>format(```<Date>, <String>, <Object> configs```):</strong> Formata a data com o locale passado no config
<br/>
<strong>subHours(```<Date>, <Number>```)</strong>: Subtrai o number da data informada
<br/>


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
    <p>No chat do discord, por exemplo, quando algum usuário muda o nome, as mensagens antigas permanecem com o nome antigo.</p>
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

## Nodemailer

>yarn add nodemailer

<p>Para o envio de emails, é interessante contratar um serviço externo, segue algumas sugestões:</p>
<ul>
<li><strong>Amazon SES(barato e a rocketseat usa) </strong></li>
<li>Mailgun</li>
<li>Sparkpost</li>
<li>Mandril(Manchimp)</li>
</ul>

<p>Atualment estamos usando o mailtrap, porém ele só funciona em ambiente de desenvolvimento </p>
<ul>
<li>Mailtrap só funciono para ambiente de desenvolvimento</li>
</ul>

## Email template

<p>Template engine para emails: </p>

>handlebars

>yarn add express-handlebars
>yarn add nodemailer-express-handlebars

<p>Na pasta views é o local onde estão os templates</p>
<p>As configurações necessárias: </p>

```
export default {
  host: '',
  post: '',
  secure: false,
  auth: {
    user: '',
    pass: '',
  },
  default: {
    from: 'Carlos Nóbrega',
  },
}
```

<p>Além disso, é feito uma pasta LIB, nela ficam as configurações para bibliotecas extenas, para o Mail o arquivo fica da seguinte maneira: </p>

```
class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use('compile', nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewPath,
      extName: '.hbs',
    }));
  }

  sendMail(message) {
    this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}
```

<p>Para o envio do email pelo controller, importamos o Singleton Mail e chamados o método sendMail, passando os dados necessários</p>

```
await Mail.sendMail({
  to: user.provider.name,
  subject: "Cancelamento de serviço",
  text: "Novo cancelemante",
  context: {
    user: cliente.name,
    provider: user.provider.name,
    date: format("'dia' dd 'de' MMM', às 'H:mm'h'", {
      locale: pt,
    })
  }
})

```

## Filas/Background jobs
<p>Para recursos que demandam tempo para processar, é interessante usar background jobs  </p>

>docker run --name redisgobarber -p 6379:6379 -d -t redis:alpine

### Redis

<p>Banco com chave + valor, super performático</p>

### Bee queue

<p>Fila mais performática, simples, mas possue poucas funcionalidades</p>
<a href="https://github.com/bee-queue">Bee queue</a>

### Kue

<p>Possuse menos performance, porém é mais robusto, concede mais possibilidades</p>
<a href="https://github.com/Automattic/kue">Kue</a>

- É interesante que cada serviço tenha uma Queue
- Pra cada tarefa é importante ter uma key em app/jobs..

> yarn run queue

## Exceptions

### Sentry.io
<ul>
<li>Cria conta</li>
<li>Cria projeto</li>
<li>yarn add @sentry/node@5.4.3</li>
<li>Import no app, import * as Sentry from 'sentry</li>
<li>config, sentry.js</li>
<li>yarn add express-async-errors</li>
<li>import 'express-async-errors';</li>
<li>yarn add youch</li>
<li>middleware pare tratar excessão com 4 parametos</li>
</ul>

### Alternativa
- Bugsnack(?)


## .ENV

<p>Variáveis de ambiente</p>

- process.env.VARIABLE
- adicionar o arquivo .env no .gitignore
- Importar em app, queue e database.js(config)

>yarn add dotenv
