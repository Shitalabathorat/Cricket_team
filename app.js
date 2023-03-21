const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

app.use(express.json());


const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;


const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


//GET API
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});


//Get post 
app.post("/players/", async(request,response)=>{
    const playersDetails=request.body;
    const {playerName, jerseyNumber, role} = playersDetails ;
    const addPlayersQuery=`
    INSERT INTO 
        cricket_team(playerId,playerName,jerseyNumber,role)
        VALUES(`${playerName}`,`${jerseyNumber}`,`${role}`);`;
    const dbResponse=await db.run(addPlayersQuery);
    console.log(dbResponse);

    const playerId=db.Response.lastID;
    response.send("Player Added to Team");

});


//GET playerId API
app.get("/players/:playerId/", async(request,response)=>{
    const { playerId }=request.params;
    const getPlayerQuery=`
    SELECT * 
    FROM 
      cricket_team
    WHERE player_id=${playerId};`;
    const player=await db.get(getPlayerQuery);
    respons.send(player);
});


//APP PUT

app.put("/players/:playerId/", async(request,response)=>{
    const { playerId }=request.params;
    const playersDetails=request.body;
    const {playerName, jerseyNumber, role} = playersDetails ;
    const updatedPlayersQuery=`
    UPDATE 
    cricket_team
    SET
    playerName=`${playerName}`,
    jerseyNumber=${jerseyNumber},
    role=`${role}`
    WHERE 
    playerId=${playerId};`;
    await db.run(updatePlayerQuery);
    response.send("Player Details Updated");
})

//DLETE API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayersQuery = `
    DELETE FROM
      book
    WHERE
      book_id = ${bookId};`;
  await db.run(deletePlayersQuery);
  response.send("Player Removed");
});
module.exports = app;



