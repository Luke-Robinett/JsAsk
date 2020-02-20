const { JsAsk, compOp, logOp } = require("./lib/jsask");

const jsAsk = new JsAsk();

jsAsk.select([
    { field: "username", alias: "User Name" },
    { field: "email", alias: "Email Address" },
    "password"
])
    .from({ name: "users", alias: "User Table" })
    .where([
        {
            field: "username",
            compOp: compOp.equal,
            value: "Joe"
        },
        {
            logOp: logOp.and,
            field: "email",
            compOp: compOp.notEqual,
            value: "ok@addr"
        }
    ])
    .go((err, result) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log(JSON.stringify(result));
    });