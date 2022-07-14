const Log = require("../models/Log");

const getLog = async (req, res) => {

    try {
        const id = req.params.id;
        const logs = await Log.find({
            reservation: id
        })
        .sort({date: -1})
        .populate('user', 'name');

        return res.status(200).json({
            ok: true,
            logs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

module.exports = {
    getLog
}