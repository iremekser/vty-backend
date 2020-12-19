const pool = require("../db");

const appointmentEnums = require('./../enums/appointmentEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = await pool.query("insert into have_appointment( patient_id, doctor_id,appointment_date,appointment_time,loc,description ) values($1,$2,$3,$4,$5,$6) RETURNING *",
            [req.body.patient_id, req.body.doctor_id, req.body.appointment_date, req.body.appointment_time, req.body.loc, req.body.description]);
        return res.status(200).json({
            message: appointmentEnums.CREATED,
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
        const appointment = await pool.query("DELETE from have_appointment where appointment_id = ($1)",
            [req.params.appointment_id]);
        if (!appointment) {
            return res.status(404).json({
                message: appointmentEnums.NOT_FOUND
            });
        }

        return res.status(200).json({
            message: appointmentEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date, appointment_time, loc, description } = req.body;
        const appointment = await pool.query("UPDATE have_appointment set patient_id =$1, doctor_id=$2,appointment_date=$3,appointment_time=$4,loc=$5,description=$6 where appointment_id = $7 RETURNING *",
            [patient_id, doctor_id, appointment_date, appointment_time, loc, description, req.params.appointment_id]);
        if (!appointment) {
            return res.status(404).json({
                message: appointmentEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: appointmentEnums.UPDATED,
            appointment: appointment.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.find = async (req, res) => {
    try {
        const appointment = await pool.query("SELECT * from have_appointment WHERE appointment_id = $1", [req.params.appointment_id]);
        return res.status(200).json({
            message: appointmentEnums.FOUND,
            appointment: appointment.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const appointments = await pool.query("SELECT * from have_appointment");
        return res.status(200).json({ appointments: appointments.rows });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};
