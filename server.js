const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/time-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const activityCodeSchema = new mongoose.Schema({
    label: String,
    color: String,
    client: String,
});

const ActivityCode = mongoose.model('ActivityCode', activityCodeSchema);

// Route pour ajouter un code d'activité
app.post('/api/activity-codes', async (req, res) => {
    const { label, color, client } = req.body;
    const newCode = new ActivityCode({ label, color, client });
    await newCode.save();
    res.status(201).send(newCode);
});

// Route pour récupérer les codes d'activité
app.get('/api/activity-codes', async (req, res) => {
    const codes = await ActivityCode.find();
    res.send(codes);
});

const timeEntrySchema = new mongoose.Schema({
    activityCode: String,
    timeSpent: Number,
    date: { type: Date, default: Date.now },
});

const TimeEntry = mongoose.model('TimeEntry', timeEntrySchema);

app.post('/api/time-entries', async (req, res) => {
    const { activityCode, timeSpent } = req.body;
    const newEntry = new TimeEntry({ activityCode, timeSpent });
    await newEntry.save();
    res.status(201).send(newEntry);
});

app.get('/api/time-entries', async (req, res) => {
    const entries = await TimeEntry.find();
    res.send(entries);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});