const connection = require("../config/connection");

class JsAsk {
    constructor() {
        this.command = "";
    }

    insert(insertParams) {
        this.command = `INSERT INTO ${connection.escapeId(insertParams.table)} (`
            + insertParams.fields.map(field => connection.escapeId(field)).toString() + ")\n";
        if (insertParams.values) {
            if (insertParams.values.length > 0) {
                this.command += " VALUES (" + insertParams.values.map(value => connection.escape(value)).toString() + ")\n";
            }
        }

        return this;
    }

    select(fields) {
        this.command += "SELECT "
            + fields.map(field => {
                if (typeof field === "object" && Object.keys(field).length >= 2) {
                    return connection.escapeId(field[Object.keys(field)[0]]) + " AS " + connection.escapeId(field[Object.keys(field)[1]]);
                } else {
                    return connection.escapeId(field);
                }
            }).toString() + "\n";

        return this;
    }

    selectValues(values) {
        this.command += "SELECT "
            + values.map(value => {
                if (typeof value === "object" && Object.keys(value).length >= 2) {
                    return connection.escape(value[Object.keys(value)[0]]) + " AS " + connection.escapeId(value[Object.keys(value)[1]]);
                } else {
                    return connection.escape(value);
                }
            }).toString() + "\n";

        return this;
    }

    from(table) {
        this.command += "FROM ";
        if (typeof table === "object" && Object.keys(table).length >= 2) {
            this.command += connection.escapeId(table[Object.keys(table)[0]]) + " AS " + connection.escapeId(table[Object.keys(table)[1]]);
        } else {
            this.command += connection.escapeId(table);
        }
        this.command += "\n";

        return this;
    }

    where(whereParams) {
        this.command += "WHERE ";

        // If a single object was passed, make it an array of one element for compatibility with array methods used
        whereParams = (Array.isArray(whereParams)) ? whereParams : [whereParams];

        // filter out any array elements that don't contain objects in the expected format
        // first element should be in format { field, comparison operator, expression }
        // and subsequent elements, if any, should be in the format { logical operator, field, comparison operator, expression }
        whereParams.filter((whereLine, i) => {
            return (typeof whereLine === "object")
                && ((i === 0)
                    && (Object.keys(whereLine).length === 3))
                || ((i >= 0)
                    && (Object.keys(whereLine).length === 4));
        })

            // Loop through the filtered array to continue constructing the SQL command
            .forEach((whereLine, i) => {
                if (i === 0) {
                    this.command += connection.escapeId(whereLine[Object.keys(whereLine)[0]])
                        + whereLine[Object.keys(whereLine)[1]]
                        + connection.escape(whereLine[Object.keys(whereLine)[2]]);
                } else {
                    this.command += whereLine[Object.keys(whereLine)[0]]
                        + connection.escapeId(whereLine[Object.keys(whereLine)[1]])
                        + whereLine[Object.keys(whereLine)[2]]
                        + connection.escape(whereLine[Object.keys(whereLine)[3]]);
                }
                this.command += "\n";
            });

        return this;
    }

    go(cb) {
        const query = connection.query(this.command, (err, result) => {
            console.log(query.sql);
            if (err) {
                return cb(err);
            }
            cb(null, result);
        });
    }
}

// Enumerations for use with querying

// Comparison operators
compOp = {
    equal: "=",
    notEqual: "!=",
    lt: "<",
    lte: "<=",
    gt: ">",
    gte: ">=",
    isNull: " IS NULL ",
    isNotNull: " IS NOT NULL "
};

// Logical operators
logOp = {
    and: " AND ",
    or: " OR ",
    not: " NOT "
};

module.exports = {
    JsAsk: JsAsk,
    compOp: compOp,
    logOp: logOp
};