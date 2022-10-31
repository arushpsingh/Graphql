const express = require('express');
var { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

app.use(cors());

mongoose.connect('mongodb+srv://arushpsingh:arush123@cluster0.oc8quzs.mongodb.net/?retryWrites=true&w=majority');
mongoose.connection.on('connected', () => {
  console.log("Connected to database");
});

app.use('/graphql',graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, ()=>{
    console.log("Hello");
  }
);