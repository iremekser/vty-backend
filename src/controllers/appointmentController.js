const pool = require("../db");

const appointmentEnums = require('./../enums/appointmentEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = await pool.query("insert into have_appointment( patient_id, doctor_id,appointment_date,appointment_time,loc,description, is_cancelled ) values($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [req.body.patient_id, req.body.doctor_id, req.body.appointment_date, req.body.appointment_time, req.body.loc, req.body.description, false]);
        if (newQuery.rowCount === 0)
            return res.status(400).json({
                message: appointmentEnums.NOT_CREATED
            });
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
        const { patient_id, doctor_id, appointment_date, appointment_time, loc, description, is_cancelled } = req.body;
        const appointment = await pool.query(`update have_appointment
            set patient_id =$1, doctor_id=$2,appointment_date=$3,appointment_time=$4,loc=$5,description=$6, is_cancelled = $7
            where appointment_id = $8 RETURNING *`,
            [patient_id, doctor_id, appointment_date, appointment_time, loc, description, is_cancelled, req.params.appointment_id]);
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

exports.cancel = async (req, res) => {
    try {
        const app = await pool.query(`update have_appointment
        set is_cancelled = $1
        where appointment_id = $2
        `, [req.body.is_cancelled, req.params.appointment_id])
        return res.status(200).json({
            message: appointmentEnums.IS_CANCELLED_UPDATED,
            appointment: app.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.find = async (req, res) => {
    try {
        const appointment = await pool.query(`select * from have_appointment
            left join patient p on ha.patient_id = p.patient_id
            left join doctor d on ha.doctor_id = d.doctor_id
            where appointment_id = $1`, [req.params.appointment_id]);
        console.log(appointment);

        if (!appointment) {
            return res.status(404).json({
                message: appointmentEnums.NOT_FOUND
            });
        }
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
        let appointments;
        if (req.query.tc_no) {
            appointments = await pool.query(`SELECT * FROM have_appointment a
            left join person p on p.tc_no = $1
            left join doctor d on a.doctor_id = d.doctor_id
            left join person p2 on d.tc_no = p2.tc_no
            left join clinic c  on d.clinic_id = c.clinic_id
            where a.patient_id = (SELECT patient_id FROM patient pp WHERE pp.tc_no=$1)
            order by a.appointment_date desc`, [req.query.tc_no]);
        }
        else
            appointments = await pool.query(`SELECT * from have_appointment ha
            left join patient p on ha.patient_id = p.patient_id
            left join doctor d on ha.doctor_id = d.doctor_id
            order by ha.appointment_date desc
            `);

        return res.status(200).json({ appointments });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};
