const pool = require("../db");

const hospitalEnums = require('./../enums/hospitalEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = pool.query("INSERT INTO hospital ( name, location) values ($1,$2) RETURNING * ",
            [req.body.name, req.body.location]);
        return res.status(200).json({
            message: hospitalEnums.CREATED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const hospital = await pool.query("DELETE from hospital where hospital_id = ($1)",
            [req.params.hospital_id]);
        if (!hospital) {
            return res.status(404).json({
                message: hospitalEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: hospitalEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { name, location } = req.body;
        const hospital = await pool.query("UPDATE hospital set name = $1, location = $2 where hospital_id = $3 RETURNING *",
            [name, location, req.params.hospital_id]);
        if (!hospital) {
            return res.status(404).json({
                message: hospitalEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: hospitalEnums.UPDATED,
            hospital: hospital.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.find = async (req, res) => {
    try {
        const hospital = await pool.query(`select * from hospital h
        right join doctor d on d.hospital_id = h.hospital_id
        where h.hospital_id = $1
        `, [req.params.hospital_id]);

        if (!hospital) {
            return res.status(404).json({
                message: hospitalEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: hospitalEnums.FOUND,
            hospital: hospital.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const hospitals = await pool.query(`select * from hospital h
        right join doctor d on d.hospital_id = h.hospital_id
        `);
        return res.status(200).json(hospitals.rows);

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};