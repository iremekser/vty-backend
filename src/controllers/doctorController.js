const pool = require("../db");

const doctorEnums = require('./../enums/doctorEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = pool.query("INSERT INTO doctor (tc_no, salary, clinic_id, hospital_id) values ($1,$2,$3,$4) RETURNING * ",
            [req.body.tc_no, req.body.salary, req.body.clinic_id, req.body.hospital_id]);
        return res.status(200).json({
            message: doctorEnums.CREATED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const doctor = await pool.query("DELETE from doctor where doctor_id = ($1)",
            [req.params.doctor_id]);
        if (!doctor) {
            return res.status(404).json({
                message: doctorEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: doctorEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { tc_no, salary, clinic_id, hospital_id } = req.body;
        const doctor = await pool.query("UPDATE doctor set salary = $1, clinic_id = $2, hospital_id = $3 where doctor_id = $4 RETURNING *",
            [salary, clinic_id, hospital_id, req.params.doctor_id]);
        if (!doctor) {
            return res.status(404).json({
                message: doctorEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: doctorEnums.UPDATED,
            doctor: doctor.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

//
exports.busyDates = async (req, res) => {
    try {
        const busyDates = await pool.query(`select appointment_date, appointment_time from have_appointment
         where doctor_id = $1`, [req.params.doctor_id]);

        if (!busyDates) {
            return res.status(404).json({
                message: doctorEnums.BUSY_DATES_NOT_FOUND
            });
        }

        return res.status(200).json({
            message: doctorEnums.BUSY_DATES_FOUND,
            appointment: busyDates.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.find = async (req, res) => {
    try {
        const doctor = await pool.query(`select * from doctor d
            left join person p on d.tc_no = p.tc_no
            left join clinic c on d.clinic_id = c.clinic_id
            left join hospital h on d.hospital_id = h.hospital_id
            where d.doctor_id = $1`, [req.params.doctor_id]);

        if (!doctor) {
            return res.status(404).json({
                message: doctorEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: doctorEnums.FOUND,
            doctor: doctor.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        let doctors;
        if (req.query.hospital_id) {
            doctors = await pool.query("select fonksiyon2($1)", [req.query.hospital_id])
        }
        else if (req.query.clinic_id) {
            doctors = await pool.query("select fonksiyon($1)", [req.query.clinic_id])
        }
        else {
            doctors = await pool.query(`select * from doctor d
        left join person p on d.tc_no = p.tc_no
        left join clinic c on d.clinic_id = c.clinic_id`);
        }
        return res.status(200).json(doctors.rows);

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};