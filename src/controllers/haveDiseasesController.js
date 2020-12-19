const pool = require("../db");

const haveDiseasesEnums = require('./../enums/haveDiseasesEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = pool.query("INSERT INTO have_diseases (diseases_id, patient_id) values ($1,$2) RETURNING * ",
            [req.body.diseases_id, req.body.patient_id]);
        return res.status(200).json({
            message: haveDiseasesEnums.CREATED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const haveDiseases = await pool.query("DELETE from have_diseases where have_diseases_id = ($1)",
            [req.params.have_diseases_id]);
        if (!haveDiseases) {
            return res.status(404).json({
                message: haveDiseasesEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: haveDiseasesEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { diseases_id, patient_id } = req.body;
        const haveDiseases = await pool.query("UPDATE have_diseases set diseases_id = $1, patient_id =$2 where have_diseases_id = $3 RETURNING *",
            [diseases_id, patient_id, req.params.have_diseases_id]);
        if (!haveDiseases) {
            return res.status(404).json({
                message: haveDiseasesEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: haveDiseasesEnums.UPDATED,
            haveDiseases: haveDiseases.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.find = async (req, res) => {
    try {
        const haveDiseases = await pool.query("SELECT * from have_diseases WHERE have_diseases_id = $1", [req.params.have_diseases_id]);
        return res.status(200).json({
            message: haveDiseasesEnums.FOUND,
            haveDiseases: haveDiseases.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const haveDiseasess = await pool.query("SELECT * from have_diseases");
        return res.status(200).json(haveDiseasess.rows);

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};