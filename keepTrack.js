const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const Constants = require("./Constants");
const {get_data} = require("./getData");

const bot = new TelegramBot(Constants.TOKEN, {polling: false});

let keep_track_of_Thaemine = {
    name: "Thaemine",
    chat: process.env.NOTIFICATION_CHANNEL,
    check_every: 1000 * 60,
    status: false,
    notify: true
}

//keep track of Thaemine
get_data(keep_track_of_Thaemine.name, keep_track_of_Thaemine.chat, bot, true, keep_track_of_Thaemine);
setInterval( () => {
    get_data(keep_track_of_Thaemine.name, keep_track_of_Thaemine.chat, bot, true, keep_track_of_Thaemine);
}, keep_track_of_Thaemine.check_every);
