const pool = require("../db");

const patientEnums = require('./../enums/patientEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = pool.query("INSERT INTO patient ( person_id, tc_no, situation,height, weight) values ($1,$2,$3,$4,$5) RETURNING * ",
            [req.body.person_id, req.body.tc_no, req.body.situation, req.body.height, req.body.weight]);
        return res.status(200).json({
            message: patientEnums.CREATED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const patient = await pool.query("DELETE from patient where patient_id = ($1)",
            [req.params.patient_id]);
        if (!patient) {
            return res.status(404).json({
                message: patientEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: patientEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { person_id, tc_no, situation, height, weight } = req.body;
        const patient = await pool.query("UPDATE patient set person_id =$1, tc_no=$2, situation=$3,height=$4, weight=$5 where patient_id = $6 RETURNING *",
            [person_id, tc_no, situation, height, weight, req.params.patient_id]);
        if (!patient) {
            return res.status(404).json({
                message: patientEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: patientEnums.UPDATED,
            patient: patient.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.find = async (req, res) => {
    try {
        const patient = await pool.query("SELECT * from patient WHERE patient_id = $1", [req.params.patient_id]);
        return res.status(200).json({
            message: patientEnums.FOUND,
            patient: patient.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const patients = await pool.query("SELECT * from patient");
        return res.status(200).json(patients.rows);

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};