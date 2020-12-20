const pool = require("../db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const personEnums = require('./../enums/personEnums');


exports.register = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newQuery = await pool.query("insert into person(tc_no,  name, surname, password, gender, phone_number, location, birth_date, user_type,email) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
            [req.body.tc_no, req.body.name, req.body.surname, hash, req.body.gender, req.body.phone_number, req.body.location, req.body.birth_date, 0, req.body.email]);

        const patientQuery = await pool.query("insert into patient(tc_no, situation,height,weight) values($1,$2,$3,$4) RETURNING *",
            [req.body.tc_no, 'İyi', req.body.height, req.body.weight]);
        const token = jwt.sign(
            {
                email: req.body.email,
                tc: req.body.tc_no,
                role: newQuery.rows[0].user_type,
                patient_id: patientQuery.rows[0].patient_id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "10y"
            }
        );

        return res.status(200).json({
            message: personEnums.CREATED,
            person: { ...newQuery.rows[0], ...patientQuery.rows[0] },
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({

            ...error
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { tc_no, password } = req.body;
        const personQuery = await pool.query("SELECT * FROM person WHERE tc_no=$1", [tc_no])
        if (personQuery.rows.length == 0) {
            return res.status(404).json({
                message: personEnums.NOT_FOUND
            })
        }
        const newLogin = await pool.query("select * from person left join patient on person.tc_no = patient.tc_no where person.tc_no =($1)", [tc_no]);
        const result = await bcrypt.compare(password, newLogin.rows[0].password);
        if (!result) {
            return res.status(401).json({
                message: personEnums.LOGIN_FAILED
            })
        }
        const token = jwt.sign(
            {
                email: newLogin.rows[0].email,
                tc: req.body.tc_no,
                role: newLogin.rows[0].user_type
            },
            process.env.JWT_KEY,
            {
                expiresIn: "10y"
            }
        );
        return res.status(200).json({
            message: personEnums.LOGIN_SUCCESSFUL,
            token,
            person: newLogin.rows[0]
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const person = await pool.query("DELETE from person where tc_no = ($1)",
            [req.params.tc_no]);
        if (!person) {
            return res.status(404).json({
                message: personEnums.NOT_FOUND
            });
        }

        return res.status(200).json({
            message: personEnums.DELETED
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { location, user_type } = req.body;
        const person = await pool.query("UPDATE person set location = $1, user_type = $2 where tc_no = $3 RETURNING *",
            [location, user_type, req.params.tc_no]);
        if (!person) {
            return res.status(404).json({
                message: personEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: personEnums.UPDATED,
            person: person.rows
        });
    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};

exports.find = async (req, res) => {
    try {
        let person;
        const userType = await pool.query(`select user_type from person
        where tc_no = $1`, [req.params.tc_no])
        if (!userType) {
            person = await pool.query(`SELECT * FROM person p
                LEFT JOIN patient pp ON pp.tc_no = p.tc_no
                where p.tc_no = $1`, [req.params.tc_no]);
        }
        else if (userType) {
            person = await pool.query(`SELECT * FROM person p
                LEFT JOIN doctor pp ON pp.tc_no = p.tc_no
                where p.tc_no = $1`, [req.params.tc_no]);
        }
        if (!person) {
            return res.status(404).json({
                message: personEnums.NOT_FOUND
            });
        }
        const retPerson = person.rows[0]
        delete retPerson['password']
        return res.status(200).json({
            message: personEnums.FOUND,
            person: retPerson
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const people = await pool.query("SELECT * from person");
        people.rows.forEach(element => {
            delete element['password']
        });
        return res.status(200).json({ people: people });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};
