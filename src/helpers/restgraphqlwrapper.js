// export default new GraphQLSchema({
//   query: QueryType
// });

// import {
//   GraphQLList,
//   GraphQLObjectType,
//   GraphQLSchema,
//   GraphQLString
// } from "graphql";

// const typeDefs = gql`
//   type Name {
//     title: String,
//     first: String,
//     last: String,
//   }
//   type Location {
//     street: String
//     city: String
//     state: String
//     postcode: String
//   }
//   type Picture {
//     large: String
//     medium: String
//     thumbnail: String
//   }
//   type User {
//     gender: String
//     name: Name
//     location: Location
//     email: String
//     phone: String
//     cell: String
//     picture: Picture
//     nat: String
//   }
//   type Query {
//     getUser: User
//     getUsers(people: Int): [User]
//   }
//
