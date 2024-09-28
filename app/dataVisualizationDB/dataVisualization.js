//TODO: schauen was man gegen doppelte einträge machen kann, vermutlich durch prellen der maus verursacht werden. in logging oder datamanagement...

//importScripts('../jquery.js');
// function filterTable() {


//     let txtValue;
//     let input = document.getElementById("filterInput");
//     let filter = input.value.toUpperCase()
//     let last = input.value.toUpperCase().slice(-1);
//     if ((filter.split("'").length - 1) % 2 == 1 || last == '&' || last == "'" || last == '!' || last == '>' || last == '<') {
//         let lastOccurrence = filter.lastIndexOf('&') == -1 ? 0 : filter.lastIndexOf('&');
//         filter = filter.slice(0, lastOccurrence);
//     }
//     let filterList = filter.split('&');
//     let table = document.getElementById("myTable");
//     let tr = table.getElementsByClassName("js-filter");





//     //reset table
//     for (let i = 0; i < tr.length; i++) {
//         tr[i].style.display = "";
//     }

//     console.log('---------------------')
//     goThroughRowsPos:
//     for (let i = 0; i < tr.length; i++) {
//         let matchFoundI = [];
//         let array_td = tr[i].getElementsByTagName("td");
//         goThroughFilterPos:
//         for (let filterIndex = 0; filterIndex < filterList.length; filterIndex++) {
//             const filterI = filterList[filterIndex];
//             matchFoundI[filterIndex] = false;
//             [_, headline, filterHeadline] = filterI.split("'");

//             if (filterI.slice(0, 1) == '!' || filterHeadline?.slice(0, 1) == '!') {
//                 matchFoundI[filterIndex] = true;
//                 continue goThroughFilterPos;
//             }
//             //console.log(headline, filterHeadline);
//             if (filterHeadline) {
//                 //console.log(headline, filterHeadline);

//                 const td = array_td[parseInt(headline)];
//                 if (td) {
//                     txtValue = td.textContent || td.innerText;
//                     if (filterHeadline.slice(0, 1) == '>' && headline == 0) {
//                         date = new Date(filterHeadline + ' GMT+0100 (Mitteleuropäische Normalzeit)');
//                         matchFoundI[filterIndex] = date < new Date(txtValue);

//                     } else if (filterHeadline.slice(0, 1) == '<' && headline == 0) {
//                         date = new Date(filterHeadline + ' GMT+0100 (Mitteleuropäische Normalzeit)');
//                         matchFoundI[filterIndex] = date > new Date(txtValue);

//                     } else if (txtValue.toUpperCase().match(filterHeadline)) {
//                         matchFoundI[filterIndex] = true;
//                     }
//                 }

//             } else {
//                 for (let index = 0; index < array_td.length; index++) {
//                     const td = array_td[index];
//                     if (td) {
//                         txtValue = td.textContent || td.innerText;
//                         if (txtValue.toUpperCase().match(filterI)) {
//                             matchFoundI[filterIndex] = true;
//                             break;
//                         }
//                     }
//                 }
//             }

//         }
//         let matchFound = matchFoundI.every(v => v === true);
//         if (matchFound) {
//             tr[i].style.display = "";
//         } else {
//             tr[i].style.display = "none";
//         }

//     }
//     console.log('2---------------------')
//     goThroughRowsNeg:
//     for (let i = 0; i < tr.length; i++) {
//         let matchFoundI = [];
//         let array_td = tr[i].getElementsByTagName("td");
//         goThroughFilterNeg:
//         for (let filterIndex = 0; filterIndex < filterList.length; filterIndex++) {
//             let filterI = filterList[filterIndex];
//             matchFoundI[filterIndex] = false;
//             [_, headline, filterHeadline] = filterI.split("'");

//             if (!(filterI.slice(0, 1) == '!' || filterHeadline?.slice(0, 1) == '!')) {
//                 matchFoundI[filterIndex] = false;
//                 continue goThroughFilterNeg;
//             }

//             console.log(headline, filterHeadline);
//             if (filterHeadline) {
//                 //console.log(headline, filterHeadline);
//                 filterHeadline = filterHeadline.slice(1);
//                 const td = array_td[parseInt(headline)];
//                 if (td) {
//                     txtValue = td.textContent || td.innerText;
//                     if (txtValue.toUpperCase().match(filterHeadline)) {
//                         matchFoundI[filterIndex] = true;
//                         break goThroughFilterNeg;
//                     }
//                 }

//             } else {
//                 filterI = filterI.slice(1);
//                 for (let index = 0; index < array_td.length; index++) {
//                     const td = array_td[index];
//                     if (td) {
//                         txtValue = td.textContent || td.innerText;
//                         console.log(txtValue, filterI);
//                         if (txtValue.toUpperCase().match(filterI)) {
//                             console.log(txtValue, filterI);
//                             matchFoundI[filterIndex] = true;
//                             break goThroughFilterNeg;
//                         }
//                     }
//                 }
//             }


//         }

//         let matchFound = matchFoundI.some(v => v === true);
//         if (matchFound) {
//             tr[i].style.display = "none";
//         } else {
//             //tr[i].style.display = "none";
//         }

//     }
//     calculateAverage();
// }

function filterUIRuns() {

    let uIRunFilters = [{//jeder Filter kann genau einen Filter einer art enthalten
        "columnIndex": 0,//-1 um alle spalten zu durchsuchen
        "filterType": "",//"","!","<",">"
        "filterText": "",
    }]
    uIRunFilters = [];

    let input = document.getElementById("filterInput").value.toUpperCase();

    let filterList = input.split('&');
    filterList.forEach(filter => {
        try {//versuche spaltenbasierte filter auszulesen
            let uIRunFilter = {};
            let result = /'[^']*'(:?[!<>]?)(.+)/g.exec(filter)[1];//TODO
            uIRunFilter.columnIndex = /'([^']*)'.+/g.exec(filter)[1];
            uIRunFilter.filterType = /'[^']*'([!<>]?).*/g.exec(filter)[1];
            uIRunFilter.filterText = /'[^']*'(:?[!<>]?)(.+)/g.exec(filter)[1];//TODO
            if (/('|!|<|>)/.test(uIRunFilter.filterText)) {
                throw new Error();

            }
            if ((uIRunFilter.filterType == '<' || uIRunFilter.filterType == '>') && uIRunFilter.filterText != "") {
                try {
                    uIRunFilter.filterText = new Date(uIRunFilter.filterText + ' GMT+0100 (Mitteleuropäische Normalzeit)');
                    if (condition) {
                        
                    }

                } catch (error) {//falls bei der nutzung kein korektes datum eingegeben wurde filter abbrechen
                    return;
                }
            }
            uIRunFilters.push(uIRunFilter);
        } catch (error) {
            try {//versuche zeilenbasierten filter zu lesen
                let uIRunFilter = {};
                uIRunFilter.filterType = /([!<>]?).+/g.exec(filter)[1];
                uIRunFilter.filterText = /[!<>]?(.+)/g.exec(filter)[1];
                if (/('|!|<|>)/.test(uIRunFilter.filterText)) {
                    throw new Error();
                }
                uIRunFilters.push(uIRunFilter);
            } catch (error) {//wenn der eingabestring das regex tötet ist es keine vollständige oder gültige eingabe
                return;
            }

        }


    });


    filteredUIRuns = g_UIRuns.filter((uIRun) => {
        return uIRunFilters.every(filter => {
            switch (filter.filterType) {
                case "":
                    if (filter.columnIndex) {//filter mit spaltenabhängigkeit
                        const cellText = uIRun[filter.columnIndex].filterText;
                        return cellText.toUpperCase().match(filter.filterText);
                    } else {//filter wird auf ganze zeile angewendet
                        return uIRun.some((column) => {
                            return column.filterText.match(filter.filterText);
                        });
                    }

                case "!":
                    if (filter.columnIndex == -1) {//filter wird auf ganze zeile angewendet

                        return !uIRun.some((column) => {
                            return column.filterText.toUpperCase().match(filter.filterText);
                        });


                    } else {//filter mit spaltenabhängigkeit
                        const cellText = uIRun[filter.columnIndex].filterText;

                        return !cellText.toUpperCase().match(filter.filterText);//wenn ein match gefunden wurde : false
                    }

                case ">":
                    return uIRun[0].sortCriteria > filter.filterText;

                case "<":
                    return uIRun[0].sortCriteria < filter.filterText;

                default:
                    return true;

            }

            // if (filter.columnIndex == -1) {//filter wird auf ganze zeile angewendet
            //     posFiltersTrue = uIRun.some((column) => {
            //         return column.innerHTML.toUpperCase().match(filter.positiveFilter);
            //     });//wenn in einer zeile mindestens ein match gefunden wurde ist posFiltersTrue true

            //     negMatchFound = negMatchFound || uIRun.some((column) => {
            //         return column.innerHTML.toUpperCase().match(filter.negativeFilter);
            //     });//wenn in einer zeile mindestens ein match gefunden wurde ist negMatchFound true

            //     return posFiltersTrue && !negMatchFound;//sobald ein negativer filter gefunden wurde kann abgebrochen werden//sobald ein positiver filter nicht erfüllt ist kann abgebrochen werden

            // } else {//filter mit spaltenabhängigkeit
            //     const cellText = uIRun[filter.columnIndex].innerHTML;

            //     posFiltersTrue = cellText.toUpperCase().match(filter.positiveFilter);//wenn für alle filter aller zellen mindestens ein match gefunden wurde ist posFiltersTrue true

            //     negMatchFound = cellText.toUpperCase().match(negativeFilter);//wenn für alle filter aller zellen mindestens ein match gefunden wurde ist negMatchFound true

            //     if (filter.columnIndex == 0) {//wenn die datumsspalte gefiltert wird kann auch größer kleiner verwendet werden
            //         posFiltersTrue = posFiltersTrue && uIRun.sortCriteria > greaterFilter;

            //         posFiltersTrue = posFiltersTrue && uIRun.sortCriteria < lesserFilter;

            //     }

            //     return posFiltersTrue && !negMatchFound;//sobald ein negativer filter gefunden wurde kann abgebrochen werden//sobald ein positiver filter nicht erfüllt ist kann abgebrochen werden

            // }

        });


        // for (let column = 0; column < filters.length; column++) {
        //     const cellText = uIRun[column].innerHTML;
        //     posFiltersTrue = posFiltersTrue && filters[column].positiveFilters.every(positiveFilter => {
        //         return cellText.toUpperCase().match(positiveFilter);
        //     });//wenn für alle filter aller zellen mindestens ein match gefunden wurde ist allFiltersTrue

        //     if (!posFiltersTrue) {//sobald ein positiver filter nicht erfüllt ist kann abgebrochen werden
        //         break;
        //     }

        //     negMatchFound = negMatchFound || filters[column].negativeFilters.some(negativeFilter => {
        //         return cellText.toUpperCase().match(negativeFilter);
        //     });//wenn für alle filter aller zellen mindestens ein match gefunden wurde ist allFiltersTrue!

        //     if (negMatchFound) {//sobald ein negativer filter gefunden wurde kann abgebrochen werden
        //         break;
        //     }
        // }

        // return posFiltersTrue && !negMatchFound;
    })
    buildTableForUIRuns(filteredUIRuns);
}

function calculateAverage() {
    let table = document.getElementById("myTable");
    let tr = table.getElementsByClassName("js-filter");
    let headlines = table.getElementsByTagName("th");

    headlines[0].innerHTML = "Startzeit / Anzahl: " + $(".js-filter:visible").length;

    let headline = headlines[2];
    let sum = 0;
    let count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum += Number(row.cells[2].id);
        }
    }
    let average = sum / count;
    headline.innerHTML = 'Drachme' + ': ' + (average * 100).toFixed(2) + "%";


    headline = headlines[3];
    sum = [0, 0, 0, 0];
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum = sum.map(function (num, idx) {
                return num + Array.from(row.cells[3].id.split(',')).map(Number)[idx];
            });

        }
    }
    headline.innerHTML = 'Startpferde' + ': ' + sum;



    headline = headlines[4];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none" && tr[j].cells[4].id != '-') {
            const row = tr[j];
            count++;
            sum += parseFloat(row.cells[4].id);
        }
    }
    average = sum / count;
    headline.innerHTML = 'Gewinnwahrscheinlichkeit' + ': ' + (average * 100).toFixed(2) + "%";


    headline = headlines[5];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum += parseFloat(row.cells[5].id);
        }
    }
    average = sum / count;
    headline.innerHTML = 'Boss geschafft' + ': ' + (average * 100).toFixed(2) + "%";


    headline = headlines[6];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none" && tr[j].cells[6].id != '-') {
            const row = tr[j];
            count++;
            sum += parseFloat(row.cells[6].id);
        }
    }
    average = sum / count;
    headline.innerHTML = 'Raum geschafft' + ': ' + (average).toFixed(2) + " / 22";


    headline = headlines[7];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum += Number(row.cells[7].id);
        }
    }
    headline.innerHTML = 'Fragmente' + ': ' + sum;


}

document.getElementById("filterInput").addEventListener("input", filterUIRuns);

//let dir = "asc";//global??
// function sortTable(n) {
//     console.log('sorting');
//     let table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
//     table = document.getElementById("myTable");

//     let headlines = table.getElementsByTagName("th");
//     for (let index = 0; index < headlines.length; index++) {
//         const element = headlines[index];
//         element.classList.remove("sorted");
//     }
//     headlines[n].classList.add('sorted');

//     switching = true;

//     let stupid = 0;
//     while (switching) {

//         switching = false;
//         //rows = table.getElementsByTagName("tr");
//         rows = table.querySelectorAll("tr:not([style*='display: none'])");
//         console.log("rows.length: ", rows.length);

//         for (i = 1; i < (rows.length - 1); i++) {
//             stupid++;
//             shouldSwitch = false;
//             x = rows[i].getElementsByTagName("td")[n];
//             y = rows[i + 1].getElementsByTagName("td")[n];

//             switch (n) {
//                 case 0:
//                     //console.log(new Date(x.innerHTML) < new Date(y.innerHTML));
//                     if (dir == "asc") {
//                         if (new Date(x.innerHTML) < new Date(y.innerHTML)) {
//                             shouldSwitch = true;
//                         }
//                     } else if (dir == "desc") {
//                         if (new Date(x.innerHTML) > new Date(y.innerHTML)) {
//                             shouldSwitch = true;
//                         }
//                     }
//                     break;
//                 case 4:
//                     letWinProbX = x.id == '-' ? 0 : parseFloat(x.id);
//                     letWinProbY = y.id == '-' ? 0 : parseFloat(y.id);

//                     if (dir == "asc") {
//                         if (letWinProbX > letWinProbY) {
//                             shouldSwitch = true;
//                         }
//                     } else if (dir == "desc") {
//                         if (letWinProbX < letWinProbY) {
//                             shouldSwitch = true;
//                         }
//                     }
//                     break;
//                 case 7:
//                     if (dir == "asc") {
//                         if (parseFloat(x.id) > parseFloat(y.id)) {
//                             shouldSwitch = true;
//                         }
//                     } else if (dir == "desc") {
//                         if (parseFloat(x.id) < parseFloat(y.id)) {
//                             shouldSwitch = true;
//                         }
//                     }
//                     break;

//                 default:
//                     if (dir == "asc") {
//                         if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
//                             shouldSwitch = true;
//                         }
//                     } else if (dir == "desc") {
//                         if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
//                             shouldSwitch = true;
//                         }
//                     }
//                     break;

//             }
//             if (shouldSwitch) {
//                 rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//                 switching = true;
//                 switchcount++;
//             }

//         }
//         //console.log(switching)
//         //s.log(dir)

//         if (!switching && dir == "asc") {
//             dir = "desc";
//             //console.log(dir)
//         } else if (!switching && dir == "desc") {
//             dir = "asc";
//             //console.log(dir)
//         }



//     }
//     console.log(stupid);
//     console.log(switchcount);
// }

let g_collumToSort = 0;
let asc = true;
function sortUIRuns(collumToSort) {
    if (collumToSort == g_collumToSort && asc) {
        asc = false;
        g_UIRuns.sort(sortUIRunsAsc);

    } else {
        g_collumToSort = collumToSort;
        g_UIRuns.sort(sortUIRunsDesc);
        asc = true
    }


    buildTableForUIRuns(g_UIRuns);

}

let header = document.querySelectorAll("th");

header.forEach(function (th, i) {
    th.addEventListener('click', function () {
        sortUIRuns(i);
    });
});
function loadRuns() {
    chrome.runtime.sendMessage({ mdText: "getAllRunsFromDB" }, ({msg, result}) => {
        if (msg === 'success') {
            console.log('loadedRuns: ', result);
            globalArrayOfRuns = result;
            g_UIRuns = buildArrayOfUIRuns(result);
            g_UIRuns.sort(sortUIRunsDesc);
            buildTableForUIRuns(g_UIRuns);
            calculateAverage();
        }else{
            console.log(msg);
        }

    });
}

function sortUIRunsAsc(a, b) {
    if (a[g_collumToSort].sortCriteria > b[g_collumToSort].sortCriteria)
        return 1;
    if (a[g_collumToSort].sortCriteria < b[g_collumToSort].sortCriteria)
        return -1;
    return 0;
}
function sortUIRunsDesc(a, b) {
    return sortUIRunsAsc(a, b) * -1;
}

// function sortUIRunsByDate(a, b) {
//     return new Date(b[0].innerHTML) - new Date(a[0].innerHTML);
// }
// function sortUIRunsByDomaine(a, b) {
//     if (a < b)
//         return -1;
//     if (a > b)
//         return 1;
//     return 0;
// }
// function sortUIRunsByDrachme(a, b) {
//     if (a < b)
//         return -1;
//     if (a > b)
//         return 1;
//     return 0;
// }
// function sortUIRunsByStartHorses(a, b) {
//     let cumulatedStartHorsesA = 0;
//     let cumulatedStartHorsesB = 0;
//     for (let index = 0; index < 4; index++) {

//         cumulatedStartHorsesA += a[index]*index;
//         cumulatedStartHorsesB += b[index]*index;

//     }
//     if (cumulatedStartHorsesA < cumulatedStartHorsesB)
//         return -1;
//     if (cumulatedStartHorsesA > cumulatedStartHorsesB)
//         return 1;
//     return 0;
// }
// function sortUIRunsByWinProb(a, b) {
//     if (a < b)
//         return -1;
//     if (a > b)
//         return 1;
//     return 0;
// }
// function sortUIRunsByBossDone(a, b) {
//     if (a < b)
//         return -1;
//     if (a > b)
//         return 1;
//     return 0;
// }
// function sortUIRunsByRoom(a, b) {
//     if (a < b)
//         return -1;
//     if (a > b)
//         return 1;
//     return 0;
// }
// function sortUIRunsByFragments(a, b) {
//     if (a < b)
//         return -1;
//     if (a > b)
//         return 1;
//     return 0;
// }


let globalArrayOfRuns = [];
let g_UIRuns = [];
loadRuns();

$(document).on('mouseover', '.tooltip', function () {
    let anzahlFragmente = 0;
    let horse = $(this).attr('class').split(' ')[0];
    let elements = document.getElementsByClassName(horse);
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (element.parentNode.parentNode.style.display != 'none') {
            anzahlFragmente += Number(element.id);
        }


    }
    $(this).find('span').text(anzahlFragmente);
})

$(document).on('click', '.js-openRun', function () {
    let clickedBtnID = $(this.parentNode).attr('id');
    chrome.tabs.create({ url: `app/dataVisualizationDB/fight.html#${clickedBtnID}`, active: true });
})

function buildArrayOfUIRuns(runs) {
    uIRuns = [];


    runs.forEach(run => {

        let uIRun = [];
        uIRun.isVisible = true;

        let startTime = {}
        startTime.innerHTML = run.dateRunStarted.substr(0, 24);
        startTime.id = new Date(run.dateRunStarted);
        startTime.sortCriteria = new Date(run.dateRunStarted);
        startTime.filterText = startTime.innerHTML.toUpperCase();
        uIRun.push(startTime);

        let domain = {}
        domain.className = 'js-openRun';
        domain.innerHTML = run.domain;
        domain.sortCriteria = run.domain;
        domain.filterText = domain.innerHTML.toUpperCase();
        uIRun.push(domain);

        let drachma = {}
        drachma.className = 'js-openRun';
        drachma.innerHTML = run.drachma;
        drachma.id = run.drachma ? 1 : 0;
        drachma.sortCriteria = run.drachma;
        drachma.filterText = toString(drachma.innerHTML).toUpperCase();
        uIRun.push(drachma);

        let startHorses = {}
        startHorses.className = 'js-openRun';

        let startHorsesTextContent = "";
        let startHorsesCount = [0, 0, 0, 0];
        let startHorsesSortCriteria = 0;
        for (let index = 0; index < run.startHorses.length; index++) {
            const horse = run.startHorses[index];
            switch (horse.levelmax) {
                case 2:
                    startHorsesTextContent += "common";
                    startHorsesCount[0] += 1;
                    startHorsesSortCriteria += 1;
                    break;
                case 3:
                    startHorsesTextContent += "rare";
                    startHorsesCount[1] += 1;
                    startHorsesSortCriteria += 2;
                    break;
                case 4:
                    startHorsesTextContent += "precious";
                    startHorsesCount[2] += 1;
                    startHorsesSortCriteria += 3;

                    break;
                case 5:
                    startHorsesTextContent += "devine";
                    startHorsesCount[3] += 1;
                    startHorsesSortCriteria += 4;

                    break;

                default:
                    break;
            }
            startHorsesTextContent += " ";
        }

        startHorses.innerHTML = startHorsesTextContent;
        startHorses.id = startHorsesCount;
        startHorses.sortCriteria = startHorsesSortCriteria;
        startHorses.filterText = startHorses.innerHTML.toUpperCase();
        uIRun.push(startHorses);

        let winProb = {}
        winProb.className = 'js-openRun';
        let winProbValue = 1;
        for (let index = 0; index < run.arrayOfFights.length; index++) {
            const element = run.arrayOfFights[index].winrate;
            winProbValue *= element / 100;
        }
        winProb.innerHTML = run.arrayOfFights.length == 0 ? '-' : (winProbValue * 100).toFixed(2) + "%";
        winProb.id = run.arrayOfFights.length == 0 ? '-' : winProbValue;
        winProb.sortCriteria = run.arrayOfFights.length == 0 ? 0 : winProbValue;//TODO: schauen wie - einträge zu behandeln sind
        winProb.filterText = winProb.innerHTML.toUpperCase();
        uIRun.push(winProb);

        let boss = {}
        boss.className = 'js-openRun';
        let bossDone = run.arrayOfRewards[run.arrayOfRewards.length - 1]?.room == 'boss' && !run.arrayOfRewards[run.arrayOfRewards.length - 1]?.lostRun;
        boss.innerHTML = bossDone ? "Ja" : "Nein";
        boss.id = bossDone ? 1 : 0;
        boss.sortCriteria = bossDone ? "Ja" : "Nein";//TODO: schauen wie - einträge zu behandeln sind
        boss.filterText = boss.innerHTML.toUpperCase();
        uIRun.push(boss);

        let lastRoom = {}
        lastRoom.className = 'js-openRun';
        let lastRoomValue = bossDone ? 22 : run.arrayOfFights.length - 1;
        lastRoom.innerHTML = run.arrayOfRewards.length > run.arrayOfFights.length + 1 ? "-" : lastRoomValue;
        lastRoom.id = run.arrayOfRewards.length > run.arrayOfFights.length + 1 ? "-" : parseInt(lastRoomValue);
        lastRoom.sortCriteria = run.arrayOfRewards.length > run.arrayOfFights.length + 1 ? 0 : parseInt(lastRoomValue);//TODO: schauen wie - einträge zu behandeln sind
        lastRoom.filterText = toString(lastRoom.innerHTML)//.toUpperCase();
        uIRun.push(lastRoom);

        let fragment = {}
        fragment.className = 'js-openRun';

        let fragments = { 'alle': 0 };
        for (let index = 0; index < run.arrayOfRewards.length; index++) {
            const element = run.arrayOfRewards[index];
            if (!isNaN(Number(element.fragments)) && !element.lostRun) {
                if (fragments[element.horse]) {
                    fragments[element.horse] += Number(element.fragments);
                    fragments.alle += Number(element.fragments);
                } else {
                    fragments[element.horse] = Number(element.fragments);
                    fragments.alle += Number(element.fragments);
                }
            }
        }
        let textContent = "";
        let filterText = "";
        for (const [key, value] of Object.entries(fragments)) {
            textContent += `<div class="${key} tooltip" id="${value}">${key}: ${value};<span class="tooltiptext">Tooltip text</span></div>`;
            filterText += key + ": " + value + ";";
        }

        fragment.innerHTML = textContent;
        fragment.id = fragments.alle;
        fragment.sortCriteria = fragments.alle;
        fragment.filterText = filterText.toUpperCase();
        uIRun.push(fragment);

        uIRuns.push(uIRun);

    });

    return uIRuns;
}

function buildTableForUIRuns(uIRuns) {
    $("#myTable > tbody").html("");


    let table = document.getElementById("myTableBody");
    uIRuns.forEach(uIRun => {
        if (uIRun.isVisible) {


            let row = table.insertRow(-1);
            row.className = "js-filter";//TODO eventuell raus?
            row.id = uIRun[0].id;

            for (let index = 0; index < uIRun.length; index++) {

                let cell = row.insertCell(index);
                const uIRunProperty = uIRun[index];
                cell.className = uIRunProperty.className;
                cell.innerHTML = uIRunProperty.innerHTML;
                cell.id = uIRunProperty.id;
            }
        }
    });

    calculateAverage();

}

