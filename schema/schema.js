const { default: GraphiQL } = require('graphiql');
const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const books = [
  { name: 'Ramayan', genre: 'Epic poetry', id: '1', authorID: '1'},
  { name: 'Mahabharat', genre: 'Drama', id: '2', authorID: '2'},
  { name: 'Shrimad Bhagvad Gita', genre: 'Vaishnavism denomination', id: '3', authorID: '2'},
  { name: 'Naruto', genre: 'Shonen', id: '4', authorID: '4'},
]

const authors = [
  { name: 'Valmiki', age: 5600, id: '1'},
  { name: 'Ved Vyas Ji', age: 4200, id: '2'},
  { name: 'Masashi Kishimoto', age: 56, id: '4'}
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args){
        return _.find(authors, { id: parent.authorID })
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book:{
      // type: BookType,
      // type: BookType, 
      // it is not the right way because booktype is give us only one book but author has written multiple books, for that we have GraphQLList
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return _.filter(books, { authorID: parent.id })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: {type: GraphQLID }},
      resolve( parent, args ){
        // code to get data from db / other source
        return _.find(books, { id: args.id })
      }
    },

    author:{
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        return _.find(authors, { id: args.id })
      }
    },

    books:{
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return books;
      }
    },

    authors:{
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return authors;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
})