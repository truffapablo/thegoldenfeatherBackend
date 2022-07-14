const eventSeeder = (id) => {
    return [
        {
            title:'Parque de la costa',
            description:'El Parque de la Costa es un parque de atracciones ubicado en la ciudad de Tigre, provincia de Buenos Aires, Argentina. Es uno de los más importantes del país. Está ubicado sobre un predio de catorce hectáreas que se encuentra entre los ríos Luján y Tigre.',
            price:4000,
            commission:1000,
            currency:'ARS',
            schedule:'Todos los días',
            start:'11:00',
            end:'21:00',
            location:'Tigre',
            address:' Vivanco 1509',
            city:'Tigre',
            user: id
        },
        {
            title:'La bomba del tiempo',
            description:'El clásico ritual de los lunes con La Bomba de Tiempo. Un espacio para conectar con el movimiento, la energía y el disfrute al ritmo de los tambores.',
            price:1500,
            commission:500,
            currency:'ARS',
            schedule:'Viernes y Sábados',
            start:'20:00',
            end:'21:30',
            location:'Konex',
            address:' Sarmiento, 3131',
            city:'Tigre',
            user: id
        },
        {
            title:'Superclásico ',
            description:'El superclásico del fútbol argentino es el partido en el que se enfrentan los dos equipos más populares del país, Boca Juniors y River Plate.',
            price:10500,
            commission:1500,
            currency:'ARS',
            schedule:'Domingo 11 de Septiembre',
            start:'20:00',
            end:'22:30',
            location:'Estadio Boca Juniors',
            address:' Brandsen 805',
            city:'CABA',
            user: id
        },
        {
            title:'Clásico de Avellaneda',
            description:'El clásico de Avellaneda es el partido en el que se enfrentan los dos equipos / vecinos más populares del conurbano sur , Independiente y Racing Club.',
            price:3500,
            commission:1000,
            currency:'ARS',
            schedule:'Domingo 10 de Julio',
            start:'15:30',
            end:'17:30',
            location:'Estadio Racing Club',
            address:' Diego A. Milito, B1870 Avellaneda',
            city:'Avellaneda',
            user: id
        },
    ];
    
}

module.exports = {
    eventSeeder
}