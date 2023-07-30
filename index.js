const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();

const prefix = '!'; // Prefixo para os comandos do bot

client.once('ready', () => {
  console.log('Bot está online!');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'upload') {
    // Verifica se o usuário digitou o comando corretamente
    if (!args[0] || !args[1]) {
      return message.channel.send('Uso correto: `!upload [nome_da_aplicacao] [caminho_do_arquivo]`');
    }

    const appName = args[0];
    const filePath = args[1];

    // Realiza a requisição para enviar o arquivo da aplicação
    try {
      const formData = new FormData();
      formData.append('appName', appName);
      formData.append('userId', message.author.id);
      formData.append('appId', generateUniqueId()); // Gera um ID único para a aplicação
      formData.append('appFile', fs.createReadStream(filePath));

      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();
      message.channel.send(result);
    } catch (error) {
      console.error('Erro ao enviar o arquivo da aplicação:', error);
      message.channel.send('Ocorreu um erro ao enviar a aplicação. Por favor, tente novamente mais tarde.');
    }
  } else if (command === 'details') {
    // Verifica se o usuário digitou o comando corretamente
    if (!args[0]) {
      return message.channel.send('Uso correto: `!details [appId]`');
    }

    const appId = args[0];

    // Realiza a requisição para obter os detalhes da aplicação
    try {
      const response = await fetch(`http://localhost:3000/app/${appId}`);
      const appData = await response.json();

      // Exibe os detalhes da aplicação
      message.channel.send(`**Nome da Aplicação:** ${appData.appName}\n**Status:** ${appData.appStatus}\n**Terminal:**\n${appData.appTerminal}`);
    } catch (error) {
      console.error('Erro ao obter os detalhes da aplicação:', error);
      message.channel.send('Ocorreu um erro ao obter os detalhes da aplicação. Por favor, tente novamente mais tarde.');
    }
  } else if (command === 'start' || command === 'restart' || command === 'stop') {
    // Verifica se o usuário digitou o comando corretamente
    if (!args[0]) {
      return message.channel.send('Uso correto: `!start [appId]`, `!restart [appId]` ou `!stop [appId]`');
    }

    const appId = args[0];

    // Realiza a requisição para executar a ação na aplicação
    try {
      const response = await fetch('http://localhost:3000/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appId, action: command }),
      });

      const result = await response.text();
      message.channel.send(result);
    } catch (error) {
      console.error('Erro ao executar ação na aplicação:', error);
      message.channel.send('Ocorreu um erro ao executar a ação na aplicação. Por favor, tente novamente mais tarde.');
    }
  } else if (command === 'remove') {
    // Verifica se o usuário digitou o comando corretamente
    if (!args[0]) {
      return message.channel.send('Uso correto: `!remove [appId]`');
    }

    const appId = args[0];

    // Realiza a requisição para remover a aplicação
    try {
      const response = await fetch('http://localhost:3000/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: message.author.id, appId }),
      });

      const result = await response.text();
      message.channel.send(result);
    } catch (error) {
      console.error('Erro ao remover a aplicação:', error);
      message.channel.send('Ocorreu um erro ao remover a aplicação. Por favor, tente novamente mais tarde.');
    }
  }
});

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Substitua 'SEU_TOKEN_DO_BOT' pelo token do seu bot
client.login('SEU_TOKEN_DO_BOT');
