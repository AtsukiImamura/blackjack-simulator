import Player from "./models/person/Player";
import AdminTable from "./models/tables/AdminTable";

// const dispensor = new SnailsCardDispensor(4);

// const player = new Player();
// for (let cnt = 0; cnt < 2; cnt++) {
//   const card = dispensor.next();
//   if (!card) {
//     continue;
//   }
//   player.addCard(card);
// }
// console.log("sum = " + player.sum);
// console.log("is bursted = " + player.isBursted);
// dispensor.refill();

const table = new AdminTable();
table.addPlayer(new Player());
table.addPlayer(new Player());

table.playOnce();
