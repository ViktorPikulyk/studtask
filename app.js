const { gql } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');
const {MongoClient , ObjectID} = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config({ path: `./config/.env` });
const express = require('express');
const path = require('path');



const {DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getToken = (user) => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7 days' });

const getUserFromToken = async (token, db) => {
  if(!token) { return null };

  const tokenData = jwt.verify(token, JWT_SECRET);
  if(!tokenData?.id) { return null };

  return await db.collection('Users').findOne({ _id: ObjectID(tokenData.id) }); 
}

const typeDefs = gql`

  type Query {
    getUser: User!
    myTaskLists: [TaskList!]!
    getTaskList(id: ID!): TaskList
    getClass(id: ID!): Class
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!

    createTaskList(title: String!): TaskList!
    updateTaskList(id: ID!, title: String!): TaskList!
    deleteTaskList(id: ID!): Boolean!

    createClass(title: String!, teacher: String!, taskListId: ID!): Class!
    updateClass(id: ID!, title: String, teacher: String, isCompleted:Boolean): Class!
    deleteClass(id: ID!): Boolean!

    createToDo(content: String!, classId: ID!): ToDo!
    updateToDo(id: ID!, content: String, state: Int): ToDo!
    deleteToDo(id: ID!): Boolean!
  }

  input SignUpInput {
    email: String!
    password: String!
    name: String
    avatar: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type AuthUser{
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type TaskList {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!

    user: User!
    classes: [Class!]!
  }

  type Class{
    id: ID!
    title: String!
    teacher: String!
    isCompleted: Boolean!

    taskList: TaskList!
    todos: [ToDo!]!
  }

  type ToDo{
    id: ID!
    content: String!
    state: Int!

    class: Class!
  }

`;

const resolvers = {
  Query: {
    getUser: async (_, __, { user }) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }
      return await user;
    },
    myTaskLists: async (_, __, { db, user }) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }
      return await db.collection('TaskLists').find({ userId: user._id }).toArray();
    },
    getTaskList: async (_, { id }, { db , user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      return await db.collection('TaskLists').findOne({ _id: ObjectID(id) });
    },
    getClass: async (_, { id }, { db , user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      return await db.collection('Classes').findOne({ _id: ObjectID(id) });
    }
  },
  Mutation: {
    signUp: async (_, {input}, {db}) => {
      const hashedPassword = bcrypt.hashSync(input.password);
      const newUser = {
        ...input,
        password: hashedPassword
      }
      //save to db
      const result = await db.collection('Users').insert(newUser);
      const user = result.ops[0]
      return{
        user,
        token: getToken(user)
      }
    },
    signIn: async (_, {input}, { db }) => {
      const user = await db.collection('Users').findOne({ email: input.email })
      const isPasswordCorrect = user && bcrypt.compareSync(input.password, user.password);
      if(!user || !isPasswordCorrect) {
        throw new Error('Invalid credentials');
      }

      return{
        user,
        token: getToken(user)
      }
    },

    createTaskList: async (_, { title }, { db, user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      const newTaskList = {
        title,
        createdAt: new Date().toISOString(),
        userId: user._id
      }

      const result = await db.collection('TaskLists').insertOne(newTaskList);
      return result.ops[0];
    },
    updateTaskList: async (_, { id , title}, { db, user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      const result = await db.collection('TaskLists')
                             .updateOne({
                                _id: ObjectID(id) 
                             }, {
                             $set: {
                                title
                             }
                             });
      return await db.collection('TaskLists').findOne({ _id: ObjectID(id) });
    },
    deleteTaskList: async (_, { id }, { db , user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      await db.collection('TaskLists').removeOne({ _id: ObjectID(id) });
      return true;
    },

    createClass: async (_, { title, teacher, taskListId }, { db, user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      const newClass = {
        title,
        teacher,
        isCompleted: false,
        taskListId: ObjectID(taskListId)
      }

      const result = await db.collection('Classes').insertOne(newClass);
      return result.ops[0];
    },
    updateClass: async (_, data, { db, user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      const result = await db.collection('Classes')
                             .updateOne({
                                _id: ObjectID(data.id) 
                             }, {
                             $set: data
                             });
      return await db.collection('Classes').findOne({ _id: ObjectID(data.id) });
    },
    deleteClass: async (_, { id }, { db , user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      await db.collection('Classes').removeOne({ _id: ObjectID(id) });
      return true;
    },

    createToDo: async (_, { content, classId }, { db, user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      const newTodo = {
        content,
        state: 0,
        classId: ObjectID(classId)
      }

      const result = await db.collection('ToDos').insertOne(newTodo);
      return result.ops[0];
    },
    updateToDo: async (_, data, { db, user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      const result = await db.collection('ToDos')
                             .updateOne({
                                _id: ObjectID(data.id) 
                             }, {
                             $set: data
                             });
      return await db.collection('ToDos').findOne({ _id: ObjectID(data.id) });
    },
    deleteToDo: async (_, { id }, { db , user}) => {
      if(!user) { throw new Error ('Authentication Error. Please sign in'); }

      await db.collection('ToDos').removeOne({ _id: ObjectID(id) });
      return true;
    },
  },

  User: {
    id: ({ _id, id}) => _id || id
  },

  TaskList: {
    id: ({ _id, id}) => _id || id,
    progress: async ({ _id }, _, { db }) => {
      const classesIds = await db.collection('Classes').find({ taskListId: ObjectID(_id) }).toArray();
      const ids = classesIds.map((object) => {return ObjectID(object._id)});
      const todos = await db.collection('ToDos').find({ classId: {$in : ids} }).toArray();
      const completed = todos.filter(todo => todo.state === 3);

      if(todos.length === 0){
        return 0;
      }
      return Math.round((100 * completed.length / todos.length) * 10) / 10;
    },
    user: async ({ userId }, _, { db }) => await db.collection('Users').findOne({ _id: userId}),
    classes: async ({ _id }, _, { db }) => (
      await db.collection('Classes').find({ taskListId: ObjectID(_id) }).toArray()
    )
  },

  Class: {
    id: ({ _id, id}) => _id || id,
    taskList: ({ taskListId }, _, { db }) => db.collection('TaskLists').findOne( {_id: ObjectID(taskListId)}),
    todos: async ({ _id }, _, { db }) => (
      await db.collection('ToDos').find({ classId: ObjectID(_id) }).toArray()
    )
  },

  ToDo: {
    id: ({ _id, id}) => _id || id,
    class: ({ classId }, _, { db }) => db.collection('Classes').findOne( {_id: ObjectID(classId)}),
  }
};

const start = async () => {

    const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME);

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const app = express();
    const server = new ApolloServer({ 
      typeDefs, 
      resolvers, 
      context: async ( {req} ) => {
        const user = await getUserFromToken(req.headers.authorization, db);
        console.log(user);
        return {
          db,
          user,
        }
      }
    });

    server.applyMiddleware({ app });

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

    // The `listen` method launches a web server.
    const port = process.env.PORT || 5000;
    await new Promise(resolve => app.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at `);
  return { server, app };
});
}

start();