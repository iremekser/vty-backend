const express = require('express');
const app = express();
var pg = require('pg');
require('dotenv').config({ path: '.env' });
// const pool = require('./db')

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


//routes
app.use("/person/", require('./routes/person.js'));
app.use("/hospital/", require('./routes/hospital.js'));
app.use("/clinic/", require('./routes/clinic.js'));
app.use("/diseases/", require('./routes/diseases.js'));
app.use("/patient/", require('./routes/patient.js'));
app.use("/haveDiseases/", require('./routes/haveDiseases.js'));
app.use("/appointment/", require('./routes/appointment.js'));
app.use("/doctor/", require('./routes/doctor.js'));


app.listen(process.env.PORT || 4000)
console.log('server on port 4000');

