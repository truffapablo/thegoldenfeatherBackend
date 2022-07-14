
const transferSeeder = (id) => {
    return [
        {
            origin:'Hotel',
            destination:'Aeropuerto Internacional Ministro Pistarini (EZE)',
            price:3600,
            commission:400,
            user:id
        },
        {
            origin:'Hotel',
            destination:'Aeropuerto Jorge Newbery (AEP)',
            price:1600,
            commission:400,
            user:id
        },
        {
            origin:'Hotel',
            destination:'La Plata',
            price:3600,
            commission:400,
            user:id
        },
    ];
}

module.exports = {
    transferSeeder
}