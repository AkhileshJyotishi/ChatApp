const express = require("express");
const http = require("http");
// const express = require("express");
// const app = express();
const { graphqlHTTP } = require("express-graphql");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
// const { typedefs } = require("./schema/sanityschema");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const schema = require("./schema/sanityschema");
const db = require("./db");
const authcontrol = require("./routes/authroutes");
require("dotenv").config();
const port = process.env.PORT || process.env.API_PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

db();
// console.log(typedefs);

const typeDefs=`#graphql
type User{
username:String
email:String
password:String
}
type Query{
  users:[User]
}
type Mutation{
  adduser(username:String,email:String,password:String):User
}
`;
const resolvers={
    Query:{
      users(){
        return "str";
      }
    },
    Mutation:{
      adduser(parent,args){
        
      }
    }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const serverstarter = async () => {
  var { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log("server ready at port", 4000, url);
};
serverstarter();
// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );

app.use("/v1/api/auth", authcontrol);
app.listen(port, () => {
  console.log("server started on port", port);
});
