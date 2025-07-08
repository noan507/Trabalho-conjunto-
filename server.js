const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, 'data.json');

// Cria o data.json se não existir
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, '[]', 'utf-8');
  console.log('📦 Arquivo data.json criado automaticamente!');
}

app.use(express.static('public'));
app.use(express.json());

// Rota para registrar visita
app.post('/registrar-visita', (req, res) => {
  try {
    console.log('📥 Requisição recebida:', req.body);

    const visitante = req.body;

    if (!visitante.nome || visitante.nome.trim() === '') {
      console.log('⚠️ Nome inválido recebido:', visitante.nome);
      return res.status(400).json({ mensagem: 'Nome é obrigatório!' });
    }

    const banco = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    banco.push(visitante);
    fs.writeFileSync(dataFile, JSON.stringify(banco, null, 2));

    console.log('✅ Visitante salvo:', visitante);
    res.status(200).json({ mensagem: 'Visitante registrado com sucesso!' });
  } catch (error) {
    console.error('🔥 Erro ao salvar visitante:', error);
    res.status(500).json({ mensagem: 'Erro interno ao registrar visita.' });
  }
});

// Rota para listar visitas
app.get('/visitas', (req, res) => {
  try {
    const banco = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    res.json(banco);
  } catch (error) {
    console.error('🔥 Erro ao ler visitantes:', error);
    res.status(500).json({ mensagem: 'Erro interno ao buscar visitantes.' });
  }
});

// Rota para limpar visitantes
app.delete('/limpar-visitas', (req, res) => {
  try {
    fs.writeFileSync(dataFile, '[]', 'utf-8');
    console.log('🧹 Lista de visitantes limpa!');
    res.status(200).json({ mensagem: 'Lista de visitantes limpa com sucesso!' });
  } catch (error) {
    console.error('🔥 Erro ao limpar visitantes:', error);
    res.status(500).json({ mensagem: 'Erro ao limpar visitantes.' });
  }
});

// Rota para entregar index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
