/* eslint-disable no-console */
require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTIES_LIST = require('./countries.js')

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`
Привіт, ${ctx.message.from.first_name}!
Дізнатися статистику по Covid-19 можна прямо зараз!
Лише введи назву країни на англійській мові, та отримай свої дані!
Подивитися доступний список країн можна за командою /help.
`,  Markup.keyboard([
      ['US', 'RUSSIA'],
      ['Ukraine', 'Poland'],
    ])
    .resize()
    .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};

  try {
  data = await api.getReportsByCountries(ctx.message.text);

  const formatData = `
Країна: ${data[0][0].country}
Випадки: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вилікувалось: ${data[0][0].recovered}
  `;
  ctx.reply(formatData);
  } catch {
      console.log('Ошибка!')
      ctx.reply('Помилка, такої країни не існує!')
    }
});
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
console.log('Бот запущен!');
