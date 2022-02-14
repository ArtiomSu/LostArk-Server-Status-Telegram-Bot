
module.exports = {
    BOT_NAME: process.env.BOT_NAME,
    TOKEN: process.env.BOT_TOKEN,
    HELP_MESSAGE:
        "<b>NewWorld Server Status Bot help</b><pre>\n</pre>"+
        "Type @bot_name followed by one of the following to get what you need<pre>\n</pre>"+
        "<b>all</b> <pre>to get all servers\n</pre>"+
        "<b>eu</b> <pre>to get Europe\n</pre>"+
        "<b>us east</b> <pre>to get US EAST\n</pre>"+
        "<b>sa</b> <pre>to get South US\n</pre>"+
        "<b>us west</b> <pre>to get US WEST\n\n</pre>"+
        "or type sever name instead to show matching servers",
    SERVER_REGIONS: ['West North America', 'East North America', 'Central Europe', 'South America'],
    NOTIFY_USERS: process.env.NOTIFY_USERS
}

