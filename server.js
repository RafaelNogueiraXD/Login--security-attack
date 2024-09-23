const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

// Configurar o Sequelize para usar SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Definir o modelo para os dados do formulário
const FormData = sequelize.define('FormData', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Sincronizar o modelo com o banco de dados (cria a tabela se ela não existir)
sequelize.sync();

// Middleware para processar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para processar o formulário
app.post('/process', async (req, res) => {
    const { name, email, message, password } = req.body;

    // Inserir os dados no banco de dados (vulnerável a SQL Injection para fins de teste)
    try {
        const formData = await FormData.create({ name, email, message, password });
        res.send(`
            <h1>Form submission successful!</h1>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        `);
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
