
const userStory = {
    name: "-name-",
    uuid: "-uuid-",
    results: [],
    taps: []
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

var uuid = "nouuid";
if (window.localStorage) {
    uuid = localStorage.getItem("userUUID")
    if (!uuid) {
        uuid = generateUUID();
        localStorage.setItem("userUUID", uuid);
    }
    userStory.uuid = uuid;
}
function setName(){
    const name = document.getElementById("nameInput").value;
    console.log(name);
    localStorage.setItem("userName", name);
    checkName();
}
function checkName(){
    if (window.localStorage) {
        const user = localStorage.getItem("userName");
        if (user && user.length > 0) {
            document.getElementById("nameScreen").style.display = "none";
        } else {
            document.getElementById("nameScreen").style.display = "block";
        }
        userStory.name = user;
    } else {
        document.getElementById("nameScreen").style.display = "none";
    }
}
checkName();

function parseIntoCSV(array) {
    let parsed = "";
    Object.keys(array[0]).forEach(key => {
        parsed += key + ";"
    });
    parsed += "\n";
    array.forEach(element => {
        Object.values(element).forEach (value => {
            parsed += value + ";"
        })
        parsed += "\n";
    })
    return parsed;
}

function saveLocal() {
    const filename = "i_"+uuid+".csv";
    const element = document.createElement('a');
    var filetext = "";
    filetext += userStory.name + "\n";
    filetext += userStory.uuid + "\n";

    if (userStory.results.length > 0) {
        filetext += parseIntoCSV(userStory.results);
    }
    filetext += "\n";

    if (userStory.taps.length > 0) {
        filetext += parseIntoCSV(userStory.taps);
    }
    filetext += "\n";

    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(filetext));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function saveExternal() {
    fetch("/results/"+uuid, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userStory)
    });
}
    
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}