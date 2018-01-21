# Draft for eBot interface

The goal is to be able to update the `maps` table of the eBot csgo mysql database at the end of the map veto.

To be able to do it, the application needs stuff : 

- the access to the ebot mysql database
- a list of parameters to create a lobby directly
  - list of actions (ban/pick/random) which start with the team_a (left side)
  - the list of maps available in the lobby (we may need to add some maps)
  - the list of `matchs` id of the ebot, which gives us  : 
    - the team names with `team_a_name` and `team_b_name` fields.
    - the `maps` ids (mysql identifier of the `maps` table) to update at the end of the map veto
    
The route should looks like : 

`/lobby/create;match_ids:X,Y,Z;actions=ban,ban,pick,pick,ban,ban,random;map_list=cache,cobblestone,inferno,mirage,nuke,overpass,train`

At the end, if the "ebot" option is available, a new button is displayed to update the ebot database with the chosen maps.

Security check have to be set when creating the lobby (existence of mysql connection string, validity of matchs ids, etc...)
