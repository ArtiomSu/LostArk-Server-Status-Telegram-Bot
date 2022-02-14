const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const Constants = require('./Constants');

get_status = (status) => {
    if (status == 'good') {
        return '✅ (good)';
    } else if (status == 'full') {
        return '⚠️ (full)';
    } else if (status == 'busy') {
        return '❌ (busy)';
    } else {
        return '🔧 (maintenance)';
    }
}

get_data = (options, current_chat, bot, keep_track, keep_track_object) => {
    cloudscraper({ method: 'GET', url: 'https://www.playlostark.com/en-us/support/server-status'})
        .then( (htmlString) => {
            let servers = {};
            const cheerio$ = cheerio.load(htmlString);
            let counter = 0;
            cheerio$('.ags-ServerStatus-content-responses-response--centered').each( (i, region) => { //loop through each region
                let severStatuses = [];
                cheerio$(region).children().each( (i, server_info) =>{
                    let serverWrapper = cheerio$(server_info).children()[0];
                    let cssClassWrapper = cheerio$(serverWrapper).attr('class');

                    let serverName = cheerio$(server_info).children()[1];
                    let cssClassName = cheerio$(serverName).attr('class');

                    let serverStatusText = 'Unknown Status';
                    let serverNameText = "Unknown Name";

                    let skip = true;

                    if(cssClassWrapper === 'ags-ServerStatus-content-responses-response-server-status-wrapper'){
                        let serverStatus = cheerio$(serverWrapper).children();
                        let serverStatusCss = cheerio$(serverStatus).attr('class');
                        if(serverStatusCss.includes('ags-ServerStatus-content-responses-response-server-status--full')){
                            serverStatusText = 'Full';
                        }else if(serverStatusCss.includes('ags-ServerStatus-content-responses-response-server-status--busy')){
                            serverStatusText = 'Busy';
                        }else if(serverStatusCss.includes('ags-ServerStatus-content-responses-response-server-status--good')){
                            serverStatusText = 'Good';
                        }else if(serverStatusCss.includes('ags-ServerStatus-content-responses-response-server-status--maintenance')){
                            serverStatusText = 'Maintenance';
                        }
                    }

                    if(cssClassName === 'ags-ServerStatus-content-responses-response-server-name'){
                        serverNameText = cheerio$(serverName).text().trim();
                        skip = false;
                    }

                    if(!skip){
                        //console.log("server name ",serverNameText, "\t\tserver status ", serverStatusText);
                        severStatuses.push({name: serverNameText, status: serverStatusText});
                    }

                });
                servers[Constants.SERVER_REGIONS[counter]] = severStatuses;
                counter++;
            });

            const last_updated = cheerio$('.ags-ServerStatus-content-lastUpdated').text().trim();

            let outString = "";
            if(options === 'a'){
                outString += "All Server Statuses";
                for(region in servers){
                    outString += "<pre>\n</pre>";
                    outString += "<strong>"+region+"</strong>";
                    outString += "<pre>\n</pre>";
                    let servers_found = "";
                    for(server in servers[region]){
                        servers_found += servers[region][server].name+" ";
                        servers_found += get_status(servers[region][server].status);
                        servers_found += "\n";
                    }
                    outString += "<pre>" + servers_found + "</pre>";
                }
            }
            else if(options >= 0 && options < Constants.SERVER_REGIONS.length){
                outString += "<b>" + Constants.SERVER_REGIONS[options]+" Server Statuses</b>";
                outString += "<pre>\n</pre>";
                let servers_found = "";
                for(server in servers[Constants.SERVER_REGIONS[options]]){
                    servers_found += servers[Constants.SERVER_REGIONS[options]][server].name+" ";
                    servers_found += get_status(servers[Constants.SERVER_REGIONS[options]][server].status);
                    servers_found += "\n";
                }
                outString += "<pre>" + servers_found + "</pre>";

            }
            else{
                let found = false;
                outString += "<b>Search Results for " + options + "</b>";
                outString += "<pre>\n</pre>";
                for(region in servers){
                    let servers_found = "";
                    for(server in servers[region]){
                        if(servers[region][server].name.toLowerCase().includes(options.toLowerCase())){
                            found = true;
                            if(keep_track){
                                if(keep_track_object.status !== servers[region][server].status){
                                    keep_track_object.status = servers[region][server].status;
                                    outString = Constants.NOTIFY_USERS + "<pre>\n</pre>";
                                    outString += "<b>Status for "+keep_track_object.name+" Changed</b>";
                                    keep_track_object.notify = true;
                                    outString += "<pre>\n";
                                    outString += servers[region][server].name+" ";
                                    outString += get_status(servers[region][server].status);
                                    outString += "</pre>";
                                }
                            }else{
                                servers_found += servers[region][server].name+" ";
                                servers_found += get_status(servers[region][server].status);
                                servers_found += "\n";
                            }

                        }
                    }
                    outString += "<pre>" + servers_found + "</pre>"
                }
                if(!found){


                    outString = "Could not find " + options +" see bellow for options";
                    outString += "<pre>\n</pre>";
                    outString += Constants.HELP_MESSAGE;
                }
            }
            outString += "<pre>\n</pre>";
            outString += "<i>"+ last_updated + "</i>";
            if(keep_track){
                if(keep_track_object.notify){
                    keep_track_object.notify = false;
                    console.log("keep track CHANGED for", keep_track_object.name, keep_track_object.status, last_updated);
                    bot.sendMessage(current_chat,outString, {parse_mode: "HTML"});
                }else{
                    console.log("keep track unchanged for", keep_track_object.name, keep_track_object.status, last_updated);
                }
            }else{
                bot.sendMessage(current_chat,outString, {parse_mode: "HTML"});
            }
        })
        .catch( (err) => {
            console.log(err)
        });
}

module.exports = {
    get_data: get_data
};