const pool = require("../db");

const clinicEnums = require('./../enums/clinicEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = pool.query("INSERT INTO clinic (clinic_name) values ($1) RETURNING * ",
            [req.body.clinic_name]);
        return res.status(200).json({
            message: clinicEnums.CREATED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const clinic = await pool.query("DELETE from clinic where clinic_id = ($1)",
            [req.params.clinic_id]);
        if (!clinic) {
            return res.status(404).json({
                message: clinicEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: clinicEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { clinic_name } = req.body;
        const clinic = await pool.query("UPDATE clinic set clinic_name = $1 where clinic_id = $2 RETURNING *",
            [clinic_name, req.params.clinic_id]);
        if (!clinic) {
            return res.status(404).json({
                message: clinicEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: clinicEnums.UPDATED,
            clinic: clinic.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.find = async (req, res) => {
    try {
        const clinic = await pool.query("SELECT * from clinic WHERE clinic_id = $1", [req.params.clinic_id]);
        return res.status(200).json({
            message: clinicEnums.FOUND,
            clinic: clinic.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const clinics = await pool.query("SELECT * from clinic");
        return res.status(200).json(clinics.rows);

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};