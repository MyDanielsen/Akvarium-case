// finder fisksknappen
const fiskKnap =
document.querySelector("#fisk-knap");

// finder lydklippet i html
const fiskelyd =
document.querySelector("#fiskelyd")

// finder beholderen, som styrer fiskens placering
const fiskBane =
document.querySelector("#fisk-bane");

// husker om fisken allerede er blevet fanget
let erFanget = false

// gør så lyden spilelr når man trykker på fisken
fiskKnap.addEventListener("click",
    function () {
        // hvis fisken er fanget skal alt ikke køre igen ved tryk
        if (erFanget) {
            return;
        }
        // gemmer info om at fisken er fanget
        erFanget = true

        // starten lyden fra start hver gang man klikker selvom lyden ikke er færdig
        fiskelyd.currentTime = 0;
        // afspiller lydklippet
        fiskelyd.play();

        // her finder vi fisken placeringen, fordi den kan være hvor som helst
        
    });