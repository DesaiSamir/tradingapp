var db = require('../database');

//User object constructor
var User = function(record){
    this.username = record.username;
    this.fname = record.fname;
    this.lname = record.lname;
    this.password = record.password;
};

User.createUser = function (newUser) {
    const qp = newUser;
    const query = `INSERT INTO users (username, fname, lname, password)
        VALUES ('${qp.username}', '${qp.fname}', '${qp.lname}', password('${qp.password}'))`;
    
    db.crudData(query, newUser);
};

User.updateUserById = function(existingUser){
    const qp = existingUser;
    const query = `UPDATE users
        SET username='${qp.username}', fname='${qp.fname}', lname='${qp.lname}', password=password('${qp.password}'), updated=current_timestamp()
        WHERE user_id=${qp.user_id};`;

    db.crudData(query, existingUser);
};

User.deletUserById = function(existingUser){
    const query = `DELETE FROM users WHERE user_id=${existingUser.user_id};`;

    db.crudData(query, existingUser);
};

User.getUserById = async function (userId) {
    const query = `Select * from users where id = ${userId}`;
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return qpll;
};

User.getUserByUsername = async function (username) {
    const query = `Select * from users where username = '${username}'`;
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return qpll;
};

User.getAllUser = async function () {
    const query = `Select * from users`;
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return qpll;
};

module.exports= User;