const pool = require("../db");

const haveDiseasesEnums = require('./../enums/haveDiseasesEnums');

exports.create = async (req, res) => {
    try {
        const newQuery = await pool.query("INSERT INTO have_diseases (diseases_id, patient_id) values ($1,$2) RETURNING * ",
            [req.body.diseases_id, req.body.patient_id]);
        return res.status(200).json({
            message: haveDiseasesEnums.CREATED,
            diseases: newQuery.rows[0]
        });
    } catch (error) {

        return res.status(500).json({
            ...error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const haveDiseases = await pool.query("DELETE from have_diseases where diseases_id = ($1) and patient_id = ($2)",
            [req.query.diseases_id, req.query.patient_id]);
        if (!haveDiseases) {
            return res.status(404).json({
                message: haveDiseasesEnums.NOT_FOUND
            });
        }
        return res.status(200).json({
            message: haveDiseasesEnums.DELETED
        });
    } catch (error) {
        console.log(error)
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


exports.list = async (req, res) => {
    try {
        let haveDiseases
        console.log(req.query.tc_no);
        if (req.query.diseases_id) {
            haveDiseases = await pool.query(`select * from have_diseases hd
                left join patient p on hd.patient_id = p.patient_id
                left join person pp on p.tc_no = pp.tc_no
                where hd.diseases_id = $1
                `, [req.query.diseases_id]);
        }
        else if (req.query.patient_id) {
            haveDiseases = await pool.query(`select * from have_diseases hd
            left join diseases d on hd.diseases_id = d.diseases_id
            left join clinic c on d.clinic_id = c.clinic_id
            where hd.patient_id = $1
                `, [req.query.patient_id]);
        }
        else if (req.query.tc_no) {
            haveDiseases = await pool.query(`select * from have_diseases hd
            left join diseases d on hd.diseases_id = d.diseases_id
            left join clinic c on d.clinic_id = c.clinic_id
            where hd.patient_id = (SELECT patient_id FROM patient pat WHERE pat.tc_no = $1)
                `, [req.query.tc_no]);
        }

        return res.status(200).json(haveDiseases.rows);

    } catch (error) {
        return res.status(500).json({
            ...error
        });
    }
};


// exports.find = async (req, res) => {
//     try {
//         const haveDiseases = await pool.query(`select * from have_diseases hd
//         left join diseases d on hd.diseases_id = d.diseases_id 
//         left join patient p on p.patient_id = hd.patient_id
//         left join person pp on pp.tc_no = p.tc_no
//         where hd.have_diseases_id = $1`, [req.params.have_diseases_id]);
//         return res.status(200).json({
//             message: haveDiseasesEnums.FOUND,
//             haveDiseases: haveDiseases.rows
//         });

//     } catch (error) {
//         return res.status(500).json({
//             ...error
//         });
//     }
// }