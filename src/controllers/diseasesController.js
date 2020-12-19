const pool = require("../db");

const diseasesEnums = require('./../enums/diseasesEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = await pool.query("insert into diseases(diseases_name, priority, clinic_id) VALUES ($1,$2,$3) RETURNING *",
            [req.body.diseases.name, req.body.priority, req.body.clinic_id]);
        return res.status(200).json({
            message: diseasesEnums.CREATED,
            newQuery
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const diseases = await pool.query("DELETE from diseases where diseases_id = ($1)",
            [req.params.diseases_id]);
        if (!diseases) {
            return res.status(404).json({
                message: diseasesEnums.NOT_FOUND
            });
        }

        return res.status(200).json({
            message: diseasesEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { diseases_name, priority, clinic_id } = req.body;
        const diseases = await pool.query("UPDATE diseases set diseases_name = $1, priority = $2, clinic_id = $3 where diseases_id = $4 RETURNING *",
            [diseases_name, priority, clinic_id, req.params.diseases_id]);
        if (!diseases) {
            return res.status(404).json({
                message: diseasesEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: diseasesEnums.UPDATED,
            diseases: diseases.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.find = async (req, res) => {
    try {
        const diseases = await pool.query("SELECT * from diseases WHERE diseases_id = $1", [req.params.diseases_id]);
        return res.status(200).json({
            message: diseasesEnums.FOUND,
            diseases: diseases.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const allDiseases = await pool.query("SELECT * from diseases");
        return res.status(200).json({ allDiseases: allDiseases.rows });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};
