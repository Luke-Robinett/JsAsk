const JsAsk = require("./lib/jsask");

const jsAsk = new JsAsk();
jsAsk.insert({
 table: "users",
 fields: ["username", "email", "password"]
})
jsAsk.selectValues([
 { value: "Screamin' Meemee", alias: "username" },
 { value: "screamin@meemee.com", alias: "email" },
 { value: "pass1234", alias: "password" }
])
// .from({ name: "users", alias: "from_table"})
.go((err, result) => {
 if (err) {
  console.error(err);
  return;
 }
 console.log(JSON.stringify(result));
});