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
        const patient = await pool.query(`SELECT * from patient p
        left join person pp on p.tc_no = pp.tc_no
        WHERE p.patient_id = $1`, [req.params.patient_id]);

        if (!patient) {
            return res.status(404).json({
                message: patientEnums.NOT_FOUND
            });
        }
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
        const patients = await pool.query(`SELECT * from patient p
        left join person pp on p.tc_no = pp.tc_no`);
        return res.status(200).json(patients.rows);

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.appCountByDoctor = async (req, res) => {
    try {
        const doctors = await pool.query(`select p.name, p.surname, c.clinic_name, di.c
        from (select doctor_id, count(*) as c from patient pa
                left join person pe on pa.tc_no = pe.tc_no
                left join have_appointment ha on pa.patient_id = ha.patient_id
                where pa.tc_no = $1
                group by doctor_id) di
        left join doctor d on d.doctor_id = di.doctor_id
        left join clinic c on d.clinic_id = c.clinic_id
        left join person p on d.tc_no = p.tc_no
    `, [req.userData.tc_no]);
        return res.status(200).json(doctors.rows);
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}
exports.diseaseCountByDoctor = async (req, res) => {
    try {
        const people = await pool.query(`select pe.name, pe.surname, pa.height, pa.weight, pi.c
        from (SELECT patient_id, COUNT(patient_id) as c FROM have_diseases
                GROUP BY patient_id
                HAVING COUNT (patient_id) > $1) as pi
        left join patient pa on pi.patient_id = pa.patient_id
        left join person pe on pa.tc_no = pe.tc_no
    `, [req.query.count]);
        return res.status(200).json(people.rows);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ...error
        });
    }
}