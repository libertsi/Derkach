const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const tasksFile = path.join(__dirname, 'tasks.json');

app.get('/tasks', (req, res) => {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання завдань');
        res.json(JSON.parse(data || '[]'));
    });
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання завдань');
        const tasks = JSON.parse(data || '[]');
        tasks.push(newTask);
        fs.writeFile(tasksFile, JSON.stringify(tasks), (err) => {
            if (err) return res.status(500).send('Помилка збереження завдання');
            res.status(201).json(newTask);
        });
    });
});

app.put('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index);
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання завдань');
        const tasks = JSON.parse(data || '[]');
        if (index >= 0 && index < tasks.length) {
            tasks[index] = req.body;
            fs.writeFile(tasksFile, JSON.stringify(tasks), (err) => {
                if (err) return res.status(500).send('Помилка збереження завдання');
                res.json(req.body);
            });
        } else {
            res.status(404).send('Завдання не знайдено');
        }
    });
});

app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index);
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання завдань');
        const tasks = JSON.parse(data || '[]');
        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            fs.writeFile(tasksFile, JSON.stringify(tasks), (err) => {
                if (err) return res.status(500).send('Помилка збереження завдання');
                res.status(204).send();
            });
        } else {
            res.status(404).send('Завдання не знайдено');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущений на порту ${PORT}`);
});