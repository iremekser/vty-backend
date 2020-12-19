const pool = require("../db");

const personEnums = require('./../enums/personEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = await pool.query("insert into person(tc_no, name, surname, password, gender, phone_number, location, birth_date, user_type) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
            [req.body.tc_no, req.body.name, req.body.surname, req.body.password, req.body.gender, req.body.phone_number, req.body.location, req.body.birth_date, req.body.user_type]);
        return res.status(200).json({
            message: personEnums.CREATED,
            newQuery
        });
    } catch (error) {
        console.log(error);
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
        const person = await pool.query("SELECT * from person WHERE tc_no = $1", [req.params.tc_no]);
        return res.status(200).json({
            message: personEnums.FOUND,
            person: person.rows
        });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
}

exports.list = async (req, res) => {
    try {
        const people = await pool.query("SELECT * from person");
        return res.status(200).json({ people: people.rows });

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};
