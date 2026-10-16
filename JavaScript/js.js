const akvarium =
document.querySelector(".akvarium");

const fiskRetning =
document.querySelector(".fisk-retning");

// finder fisksknappen
const fiskKnap =
document.querySelector("#fisk-knap");

const tykFisk =
document.querySelector(".fisktyk");

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
    function (event) {
        event.stopPropagation();

        // hvis fisken er fanget skal alt ikke køre igen ved tryk
        if (erFanget) {
            return;
        }
        // gemmer info om at fisken er fanget
        erFanget = true

        // her finder vi fisken placeringen, fordi den kan være hvor som helst
        const placering =
        fiskBane.getBoundingClientRect();

        // stopper animationen der får fisken til at svømme frem og tilbage
        fiskBane.style.animation = "none";

        // placerer fisken i forhold til hele browservinduet
        fiskBane.style.position = "fixed";

        // nu skal vi bare fastholde fisken i den aktuelle placering
        fiskBane.style.left = placering.left + "px";
        fiskBane.style.top = placering.top + "px";

        // fastholder fisken nuværende størrelse
        fiskBane.style.width = placering.width + "px";
        fiskBane.style.height = placering.height + "px";

        // fjerner den lodrette placering
        fiskBane.style.translate = "none";

        // fjerner transform fra svømmeanimationen
        fiskBane.style.transform = "none";

        // der skal ikke være en overgang, mens startplaceringen bliver sat
        fiskBane.style.transition = "none";

        // tvinger browseren til at registrere fiskens startplacering
        fiskBane.getBoundingClientRect();

        // afspiller lyden, når animationen med den tykke fisk er færdig
        tykFisk.addEventListener("animationend",
            function () {
                fiskelyd.currentTime = 0;
                fiskelyd.play();
            },
            { once: true }
        );

        // tilføjer klassen som starter "kom-her" animationen i css
        fiskBane.classList.add("er-fanget");

        // nu skal fisken flyttes ind mod midten
        // bevægelsen er blød
        fiskBane.style.transition =
        "left 1.6s ease-in-out, top 1.6s ease-in-out, transform 1.6s ease-in-out";

        // flytter fiskens beholder til midten af skærmen
        fiskBane.style.left = "50%";
        fiskBane.style.top = "50%";

        // gør så selve rammen om fisken rammer midten af skærmen også
        fiskBane.style.transform =
        "translate(-50%, -50%)";

    });

    akvarium.addEventListener("click",
        function () {
            if (!erFanget) {
                return;
            }

            // fisken er ikke længere fanget
            erFanget = false;

            // skifter tilbage fra tyk til tynd fisk
            fiskBane.classList.remove("er-fanget");

            // fjerner placeringen i midten
            fiskBane.style.position = "";
            fiskBane.style.left = "";
            fiskBane.style.top = "";
            fiskBane.style.width = "";
            fiskBane.style.height = "";
            fiskBane.style.translate = "";
            fiskBane.style.transform = "";
            fiskBane.style.transition = "";

            // starter de nye animationer fra midten igen
            fiskBane.style.animation =
            "svoem-fra-midten 12s linear infinite";

            fiskRetning.style.animation =
            "vend-fisk-fra-midten 12s linear infinite";
        });
