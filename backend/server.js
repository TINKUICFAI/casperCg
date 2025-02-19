const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const axios = require("axios");

mongoose.connect("mongodb://localhost:27017/substitutions");

const Substitution = mongoose.model("Substitution", {
  playerOut: { name: String, number: Number },
  playerIn: { name: String, number: Number },
  time: String,
});

const schema = buildSchema(`
    type Substitution {
        playerOut: Player
        playerIn: Player
        time: String
    }
    type Player {
        name: String
        number: Int
    }
    type Query {
        substitutions: [Substitution]
    }
    type Mutation {
        addSubstitution(playerOut: PlayerInput, playerIn: PlayerInput, time: String): Substitution
    }
    input PlayerInput {
        name: String
        number: Int
    }
`);

const root = {
  substitutions: () => Substitution.find(),
  addSubstitution: async ({ playerOut, playerIn, time }) => {
    const sub = new Substitution({ playerOut, playerIn, time });
    await sub.save();

    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ playerOut, playerIn, time }));
      }
    });

    const casparCommand = `CG 1-10 ADD 1 "substitution" "{\\\"playerOut\\\": {\\\"name\\\": \\\"${playerOut.name}\\\", \\\"number\\\": ${playerOut.number}}, \\\"playerIn\\\": {\\\"name\\\": \\\"${playerIn.name}\\\", \\\"number\\\": ${playerIn.number}}, \\\"time\\\": \\\"${time}\\\"}"`;

    axios
      .post("http://localhost:5250", { command: casparCommand })
      .then((response) => console.log("CasparCG Updated:", response.data))
      .catch((error) => console.error("Error updating CasparCG:", error));

    return sub;
  },
};

const app = express();
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

const server = app.listen(4000, () =>
  console.log("Server running on port 4000")
);

// WebSocket Server
const wsServer = new WebSocket.Server({ server });

console.log("WebSocket server running...");

app.post("/stop", (req, res) => {
  axios
    .post("http://localhost:5250", { command: "STOP 1-10" })
    .then(() => res.send("Caption stopped"))
    .catch((error) => res.status(500).send(error));
});
