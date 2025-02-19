CasparCG Substitution Caption System
This project implements a dynamic substitution caption system for live sports broadcasts using CasparCG, GraphQL, WebSockets, MongoDB, and Node.js.

✅ CasparCG Integration – Displays live substitution captions.
✅ GraphQL API – Stores and manages player substitutions.
✅ WebSockets – Real-time updates for substitutions.
✅ MongoDB Database – Stores substitution history.
✅ Automated Caption Control – Captions appear & disappear dynamically.


📌 How to Set It Up (Step-by-Step Guide)
1️⃣ Install the Required Software
Before we start, you’ll need:

✅ CasparCG Server (https://github.com/CasparCG/server/releases)
✅ Node.js (https://nodejs.org/en/download)
✅ MongoDB (https://www.mongodb.com/try/download/community)


2️⃣ Install CasparCG Server
CasparCG is our graphics engine. Let’s set it up:

Download and extract CasparCG Server (e.g., v2.4.2).
Place it in a directory like:
C:\CasparCG\

Open the configuration file casparcg.config and check that your templates folder is correct:
<paths>
   <template-path>templates/</template-path>
</paths>

Start CasparCG Server by running:
cd C:\CasparCG\Server
casparcg.exe
💡 If you see green logs, it means CasparCG is running correctly!


3️⃣ Clone This Project
Now let’s get the actual substitution system running:

git clone https://github.com/your-repo/casparcg-substitution.git
cd casparcg-substitution


4️⃣ Install Backend Dependencies
Since we’re using Node.js, install the required packages:

This will install:

express → Web server
express-graphql → GraphQL API
mongoose → MongoDB database
ws → WebSockets for real-time updates
axios → HTTP requests to CasparCG
cors → CORS support

5️⃣Start the Backend
npm start

✅ GraphQL API running on: http://localhost:4000/graphql
✅ WebSocket Server running on: ws://localhost:4000

6️⃣Add the HTML Template in CasparCG
1:- Copy the substitution.html file into the CasparCG templates folder:
C:\CasparCG\Server\templates\substitution.html

2:- Load it inside CasparCG:
PLAY 1-10 "substitution"


✅ Your template should now be visible in CasparCG!



📌 How to Use It
➡️ Adding a Player Substitution
1:- Open your browser and go to GraphQL Playground:
📌 http://localhost:4000/graphql


2:- Run this mutation:
mutation {
  addSubstitution(
    playerOut: { name: "Messi", number: 10 }
    playerIn: { name: "Ronaldo", number: 7 }
    time: "75:00"
  ) {
    playerOut { name number }
    playerIn { name number }
    time
  }
}
The caption will now appear on CasparCG!

➡️ Stopping the Caption
Run this command inside CasparCG:
STOP 1-10

