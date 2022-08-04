const bcrypt = require("bcryptjs/dist/bcrypt");
const role = require("../types/role");


const userSeeder = async () =>{
    const salt = await bcrypt.genSaltSync(10);
    const password = await bcrypt.hashSync("123456", salt);
    const adminPassword = await bcrypt.hashSync("admin123", salt);
    const userList = [
        {
            name:"Pablo",
            email:"pablo@thegoldenfeather.dev",
            role:role.admin,
            changePassword:false,
            password:adminPassword

        },
        {
            name:"Nicolas",
            email:"nicolas@thegoldenfeather.dev",
            role:role.employee,
            changePassword:false,
            password

        },
        {
            name:"Lucia",
            email:"lucia@thegoldenfeather.dev",
            role:role.employee,
            changePassword:false,
            password

        },
        {
            name:"Fernanda",
            email:"fernanda@thegoldenfeather.dev",
            role:role.employee,
            changePassword:false,
            password

        },
    ];

    return userList;
}

module.exports = {
    userSeeder
}
    