const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware untuk parsing request body
app.use(bodyParser.json());

// Setup koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL kamu
  password: '', // Ganti dengan password MySQL kamu
  database: 'school' // Ganti dengan nama database kamu
});

// Connect ke database
db.connect((err) => {
  if (err) {
    console.error('Gagal terkoneksi ke database:', err);
    return;
  }
  console.log('Berhasil terkoneksi ke database');
});

// CRUD: Create (Insert Data)
app.post('/students', (req, res) => {
  const { nisn, nama, kelas, nilai } = req.body;
  
  const query = 'INSERT INTO students (nisn, nama, kelas, nilai) VALUES (?, ?, ?, ?)';
  db.query(query, [nisn, nama, kelas, nilai], (err, result) => {
    if (err) {
      console.error('Gagal menambahkan data:', err);
      return res.status(500).json({ error: 'Gagal menambahkan data' });
    }
    res.status(201).json({ message: 'Data berhasil ditambahkan', id: result.insertId });
  });
});

// CRUD: Read (Ambil Semua Data)
app.get('/students', (req, res) => {
  const query = 'SELECT * FROM students';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data:', err);
      return res.status(500).json({ error: 'Gagal mengambil data' });
    }
    res.status(200).json(results);
  });
});

// CRUD: Read (Ambil Data berdasarkan NISN)
app.get('/students/:nisn', (req, res) => {
  const nisn = req.params.nisn;
  const query = 'SELECT * FROM students WHERE nisn = ?';
  db.query(query, [nisn], (err, results) => {
    if (err) {
      console.error('Gagal mengambil data:', err);
      return res.status(500).json({ error: 'Gagal mengambil data' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.status(200).json(results[0]);
  });
});

// CRUD: Update (Ubah Data)
app.put('/students/:nisn', (req, res) => {
  const nisn = req.params.nisn;
  const { nama, kelas, nilai } = req.body;

  const query = 'UPDATE students SET nama = ?, kelas = ?, nilai = ? WHERE nisn = ?';
  db.query(query, [nama, kelas, nilai, nisn], (err, result) => {
    if (err) {
      console.error('Gagal memperbarui data:', err);
      return res.status(500).json({ error: 'Gagal memperbarui data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ message: 'Data berhasil diperbarui' });
  });
});

// CRUD: Delete (Hapus Data)
app.delete('/students/:nisn', (req, res) => {
  const nisn = req.params.nisn;

  const query = 'DELETE FROM students WHERE nisn = ?';
  db.query(query, [nisn], (err, result) => {
    if (err) {
      console.error('Gagal menghapus data:', err);
      return res.status(500).json({ error: 'Gagal menghapus data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ message: 'Data berhasil dihapus' });
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
