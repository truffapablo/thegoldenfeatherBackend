const bcrypt = require("bcryptjs/dist/bcrypt");
const role = require("../types/role");


const userSeeder = async () =>{
    const salt = await bcrypt.genSaltSync(10);
    const password = await bcrypt.hashSync("123456", salt);
    const userList = [
        {
            name:"Pablo",
            email:"pablo@thegoldenfeather.com",
            role:role.admin,
            changePassword:false,
            password

        },
        {
            name:"Nicolas",
            email:"nicolas@thegoldenfeather.com",
            role:role.employee,
            changePassword:false,
            password

        },
        {
            name:"Lucia",
            email:"lucia@thegoldenfeather.com",
            role:role.employee,
            changePassword:false,
            password

        },
        {
            name:"Fernanda",
            email:"fernanda@thegoldenfeather.com",
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
    