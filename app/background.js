importScripts("Datamanagement.js");
importScripts("dataprocessing.js");
const dataAccessForOlympRuns = new DataAccessForOlympRuns();
const dataAccessForSeasons = new DataAccessForSeasons();


function formatData(data){
    let formatted = "";
    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (formatted == "") {
            formatted = element.dateRunStarted + "\t" + element.timeStamp + "\t" + element.threshold + "\t" + element.room + "\t" + element.dificulty + "\t" + element.reward1 + "\t" + element.reward2 + "\t" + element.reward3;
        }else{
            formatted = formatted + "\n" + element.dateRunStarted + "\t" + element.timeStamp + "\t" + element.threshold + "\t" + element.room + "\t" + element.dificulty + "\t" + element.reward1 + "\t" + element.reward2 + "\t" + element.reward3;
        }
    }
    return formatted;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    for (let index = 0; index < 10000; index++) {
        const element = null;
        
    }
    
    switch (message.mdText) {
        case "clear":
            chrome.storage.local.set({ "arrayOfStartHorses": [] });
            chrome.storage.local.set({ "arrayOfRewards": [] });
            let timeStamp = new Date();
            chrome.storage.local.set({ "lastDeleted": timeStamp });
            sendResponse();
            break;
        case "downloadTable":
            downloadTable(sendResponse);
            break;

        /******************
         * new Datamanagement
         */    
        case "addRunToDB":
            dataAccessForOlympRuns.addRunToDB(message.olympRun)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "addStartHorsesToRun":
            dataAccessForOlympRuns.addStartHorsesToRun(message.startHorsesFull, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "addFightToRun":
            dataAccessForOlympRuns.addFightToRun(message.fight, message.dateRunStarted)
            .then(({msg, result})=>{
                console.log(msg)
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                console.log('error')
                sendResponse({msg: e});
            });
            break;
        case "addRewardsToRun":
            dataAccessForOlympRuns.addRewardsToRun(message.rewards, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;            
        case "addHorseIdToReward":
            dataAccessForOlympRuns.addHorseIdToReward(message.horseID, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "addBossToRun":
            dataAccessForOlympRuns.addBossToRun(message.rewards, message.fight, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;            
        case "addLostRunToBossRewards":
            dataAccessForOlympRuns.addLostRunToBossRewards(message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "getAllRunsFromDB":
            console.log('getAllRunsFromDB');
            dataAccessForOlympRuns.getAllRuns()
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });

            break;
        case "getRunFromTimestamp":
            dataAccessForOlympRuns.getRunFromTimestamp(message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "deleteRunFromTimestamp":
            dataAccessForOlympRuns.deleteRunFromTimestamp(message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "updateRunToDB":
            dataAccessForOlympRuns.updateRunToDB(message.olympRun)
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "getKeys":
            dataAccessForOlympRuns.getKeys()
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "getAllSeasonsFromDB":
            dataAccessForSeasons.getAllSeasons()
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "addSeasonToDB":
            dataAccessForSeasons.addSeasonToDB(message.season)
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
            
              
            
        default:
            console.log(message, sender, sendResponse);
            if (sendResponse) {
                sendResponse(message);
            }
            break;
    }
    
    return true;
  });

/**
 * Lädt eine Tabelle als CSV-Datei herunter.
 *
 * Diese Funktion ruft Belohnungs- und Startpferdedaten aus dem lokalen Speicher ab,
 * generiert einen CSV-String aus diesen Daten und initiiert den Download der CSV-Datei.
 * Wenn keine Belohnungsdaten vorhanden sind, wird eine entsprechende Nachricht zurückgegeben.
 *
 * @param {function} sendResponse - Callback-Funktion, um die Antwort an den Aufrufer zu senden.
 *                                  Diese Funktion wird aufgerufen, um das Ergebnis des Downloads
 *                                  oder eine Fehlermeldung zurückzugeben.
 *
 * @returns {void} - Es gibt keinen Rückgabewert. Die Funktion führt asynchrone Operationen durch,
 *                   um die Daten abzurufen und den Download zu initiieren.
 */
function downloadTable(sendResponse){
    chrome.storage.local.get(["arrayOfRewards", "arrayOfStartHorses"], function(value){
        if (!value.arrayOfRewards) {
            sendResponse({ mdText: "no Data" });
            return false;
        }else{
            chrome.offscreen.createDocument({
            url: chrome.runtime.getURL("app/offscreen.html"),
            reasons: ["BLOBS"],
            justification: "justification is required.",
            }, () => {
                    let data = getCsvString(value.arrayOfRewards, value.arrayOfStartHorses);
                    chrome.runtime.sendMessage({ mdText: data }, (response) => {
                    const url = response.url;
                    let timeStamp = new Date();
                    console.log("howrse_stats" + timeStamp.toLocaleDateString().replace('.', '-') + timeStamp.toLocaleTimeString().replace('.', '-') + ".csv")
                    chrome.downloads.download({
                        url: url,
                        filename: "howrse_stats" + '-' + timeStamp.toLocaleDateString().replaceAll('.', '-') + '-' + timeStamp.toLocaleTimeString().replaceAll(':', '-') + ".csv"
                    });
                    chrome.offscreen.closeDocument();
                });
            });
        }
        
    });
}

/*******************************************************************************************************
 * Index DB access
 */

