import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function TimeTracker() {
  const [activityCode, setActivityCode] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [entries, setEntries] = useState([]);
  const [activityCodes, setActivityCodes] = useState([]);
  const [newCode, setNewCode] = useState({ label: '', color: '', client: '' });

  const fetchEntries = async () => {
    const response = await axios.get('http://localhost:5000/api/time-entries');
    setEntries(response.data);
  };

  const fetchActivityCodes = async () => {
    const response = await axios.get('http://localhost:5000/api/activity-codes');
    setActivityCodes(response.data);
  };

  useEffect(() => {
    fetchEntries();
    fetchActivityCodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/time-entries', { activityCode, timeSpent, date });
    fetchEntries();
  };

  const handleNewCodeSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/activity-codes', newCode);
    fetchActivityCodes();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entries');
    XLSX.writeFile(workbook, 'time_entries.xlsx');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          value={activityCode}
          onChange={(e) => setActivityCode(e.target.value)}
        >
          <option value="">Sélectionner un code d'activité</option>
          {activityCodes.map((code) => (
            <option key={code._id} value={code.label}>
              {code.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={timeSpent}
          onChange={(e) => setTimeSpent(e.target.value)}
          placeholder="Temps passé (en minutes)"
        />
        <button type="submit">Enregistrer</button>
      </form>
      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>{entry.date} - {entry.activityCode}: {entry.timeSpent} minutes</li>
        ))}
      </ul>
      <button onClick={exportToExcel}>Exporter en Excel</button>
      <form onSubmit={handleNewCodeSubmit}>
        <input
          type="text"
          value={newCode.label}
          onChange={(e) => setNewCode({ ...newCode, label: e.target.value })}
          placeholder="Label"
        />
        <input
          type="text"
          value={newCode.color}
          onChange={(e) => setNewCode({ ...newCode, color: e.target.value })}
          placeholder="Couleur"
        />
        <input
          type="text"
          value={newCode.client}
          onChange={(e) => setNewCode({ ...newCode, client: e.target.value })}
          placeholder="Client"
        />
        <button type="submit">Ajouter Code d'Activité</button>
      </form>
    </div>
  );
}

export default TimeTracker;