/*
    JAVASCRIPT-OVERBLIK
    1. Stor pindsvinefisk
    2. Jomfrufisk og fælles baggrundslyd
    3. Paletkirurg
    4. Fælles fokus: mørk baggrund og pause af andre fisk
    5. Små fisk: oplysninger, tilfældig svømning og taleboble
*/

// ========== 1. STOR PINDSVINEFISK ==========
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

const pindsvineInfo =
document.querySelector("#pindsvine-info");

// Fjerner det høje lag fra den gamle fisk og giver det til den nye valgte fisk.
function saetFiskForrest(fiskElement) {
    document.querySelectorAll(".fisk-forrest").forEach(function (element) {
        element.classList.remove("fisk-forrest");
    });

    fiskElement.classList.add("fisk-forrest");
}

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

        aktiverFiskFokus(fiskBane);
        fiskKnap.setAttribute("aria-expanded", "true");
        pindsvineInfo.setAttribute("aria-hidden", "false");

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

        // Centrerer fisken og boblen som én samlet gruppe.
        const fiskSkala =
        parseFloat(getComputedStyle(fiskBane).getPropertyValue("--pindsvine-skala")) || 3;
        const mellemrum = window.innerWidth <= 650 ? 12 : 40;
        const storFiskBredde = placering.width * fiskSkala;
        const gruppeBredde = storFiskBredde + mellemrum + pindsvineInfo.offsetWidth;
        const gruppeStart = Math.max(0, (window.innerWidth - gruppeBredde) / 2);
        const fiskMidte = gruppeStart + storFiskBredde / 2;

        fiskBane.style.left = fiskMidte + "px";
        fiskBane.style.top = "50%";
        pindsvineInfo.style.left = gruppeStart + storFiskBredde + mellemrum + "px";
        pindsvineInfo.style.top = "50%";

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
            fiskBane.classList.remove("fisk-forrest");
            fiskKnap.setAttribute("aria-expanded", "false");
            pindsvineInfo.setAttribute("aria-hidden", "true");

            // fjerner placeringen i midten
            fiskBane.style.position = "";
            fiskBane.style.left = "";
            fiskBane.style.top = "";
            fiskBane.style.width = "";
            fiskBane.style.height = "";
            fiskBane.style.translate = "";
            fiskBane.style.transform = "";
            fiskBane.style.transition = "";
            pindsvineInfo.style.left = "";
            pindsvineInfo.style.top = "";

            // starter de nye animationer fra midten igen
            const svoemmeTid =
            getComputedStyle(fiskBane).getPropertyValue("--pindsvine-svoemmetid").trim() || "16s";

            fiskBane.style.animation =
            `svoem-fra-midten ${svoemmeTid} linear infinite`;

            fiskRetning.style.animation =
            `vend-fisk-fra-midten ${svoemmeTid} linear infinite`;

            afslutFiskFokusHvisMuligt();
        });

// ========== 2. JOMFRUFISK OG BAGGRUNDSLYD ==========
const jomfrufisk = document.querySelector("#jomfrufisk");
const jomfrufiskKnap = document.querySelector("#jomfrufisk-knap");
const jomfrufiskLyd = document.querySelector("#jomfrufisk-lyd");
const baggrundslyd = document.querySelector("#baggrundslyd");

baggrundslyd.volume = 0.5;

// Browsere tillader først lyd, når brugeren har klikket på siden.
document.addEventListener("click", function startBaggrundslyd() {
    baggrundslyd.play().catch(function () {});
}, { once: true, capture: true });

jomfrufiskKnap.addEventListener("click", function (event) {
    event.stopPropagation();

    aktiverFiskFokus(jomfrufisk);
    jomfrufisk.classList.add("er-stoppet");
    jomfrufiskKnap.setAttribute("aria-expanded", "true");
    jomfrufiskLyd.currentTime = 0;
    jomfrufiskLyd.play().catch(function () {});
    baggrundslyd.volume = 0.15;
});

akvarium.addEventListener("click", function () {
    jomfrufisk.classList.remove("er-stoppet");
    jomfrufisk.classList.remove("fisk-forrest");
    jomfrufiskKnap.setAttribute("aria-expanded", "false");
    jomfrufiskLyd.pause();
    jomfrufiskLyd.currentTime = 0;
    baggrundslyd.volume = 0.5;
    afslutFiskFokusHvisMuligt();
});

jomfrufiskLyd.addEventListener("ended", function () {
    baggrundslyd.volume = 0.5;
});

// ========== 3. PALETKIRURG ==========
const paletkirurgAkvarium = document.querySelector("#akvarium");
const paletkirurgLyd = document.querySelector("#paletkirurg-lyd");
const paletkirurgInfo = document.querySelector("#paletkirurg-info");

function lavPaletkirurg() {
    // Paletkirurgen findes ikke som et <img> i HTML, så den oprettes her.
    const paletkirurg = document.createElement("img");

    paletkirurg.src = "svg/fiskkirurg.svg";
    paletkirurg.alt = "En paletkirurg, der svømmer";
    paletkirurg.classList.add("paletkirurg-fisk");
    paletkirurg.style.animationDuration = "12s";
    paletkirurg.setAttribute("role", "button");
    paletkirurg.setAttribute("tabindex", "0");
    paletkirurg.setAttribute("aria-controls", "paletkirurg-info");
    paletkirurg.setAttribute("aria-expanded", "false");

    function skiftPaletkirurg() {
        const erTaet = paletkirurgAkvarium.classList.toggle("paletkirurg-taet");

        paletkirurg.setAttribute("aria-expanded", String(erTaet));
        paletkirurgInfo.setAttribute("aria-hidden", String(!erTaet));

        if (erTaet) {
            aktiverFiskFokus(paletkirurg);
            paletkirurgLyd.currentTime = 0;
            paletkirurgLyd.play().catch(function () {});
            baggrundslyd.volume = 0.15;
        } else {
            paletkirurg.classList.remove("fisk-forrest");
            paletkirurgLyd.pause();
            baggrundslyd.volume = 0.5;
            afslutFiskFokusHvisMuligt();
        }
    }

    paletkirurg.addEventListener("click", function (event) {
        event.stopPropagation();
        skiftPaletkirurg();
    });

    paletkirurg.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            skiftPaletkirurg();
        }
    });

    paletkirurgAkvarium.appendChild(paletkirurg);
}

paletkirurgLyd.addEventListener("ended", function () {
    baggrundslyd.volume = 0.5;
});

lavPaletkirurg();

// ========== 4. FÆLLES FOKUS OG PAUSE ==========
// Disse variabler bruges også af systemet med de små fisk nedenfor.
const samleFiskAkvarium = document.querySelector(".akvarium");
const alleSamleFisk = document.querySelectorAll(".samlefisk");
const samleFiskTaleboble = document.querySelector(".samlefisk-taleboble");

let valgtSamleFisk = null;
let genstartSamleFiskTimer = null;

function aktiverFiskFokus(aktivFisk) {
    // Stop en planlagt genstart, hvis brugeren vælger en ny fisk med det samme.
    clearTimeout(genstartSamleFiskTimer);

    // Klassen viser overlayet og pauser CSS-animationerne på de store fisk.
    akvarium.classList.add("fisk-fokus");
    saetFiskForrest(aktivFisk);

    // De små fisk bruger CSS-overgange i stedet for keyframes og fryses derfor med JavaScript.
    alleSamleFisk.forEach(function (fisk) {
        frysSamleFisk(fisk);
    });
}

function afslutFiskFokusHvisMuligt() {
    // Vent til alle klikfunktioner på akvariet har nået at lukke deres fisk.
    setTimeout(function () {
        const harAktivFisk =
        erFanget ||
        jomfrufisk.classList.contains("er-stoppet") ||
        paletkirurgAkvarium.classList.contains("paletkirurg-taet") ||
        valgtSamleFisk !== null;

        if (harAktivFisk) {
            return;
        }

        // Når ingen fisk længere er valgt, fjernes overlayet og de små fisk genstartes.
        akvarium.classList.remove("fisk-fokus");
        clearTimeout(genstartSamleFiskTimer);
        genstartSamleFiskTimer = setTimeout(function () {
            alleSamleFisk.forEach(function (fisk) {
                fisk.nyTur();
            });
        }, 600);
    }, 0);
}

// ========== 5. SMÅ FISK OG DERES OPLYSNINGER ==========
// Placeringen i listen matcher data-fisk-nr i HTML.
const samleFiskInfo = [
    {
        navn: "Pindsvinefisken",
        art: "Diodon holocanthus",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx",
        pustOp: "svg/tykfisk.svg"
    },
    {
        navn: "Den blå chromis",
        art: "Chromis cyanea",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Dværgkejseren",
        art: "Centropyge",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Klovnfisken",
        art: "Amphiprion ocellaris",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Den gule kirurgfisk",
        art: "Zebrasoma flavescens",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Jomfrufisken",
        art: "Pomacentridae",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Rævehovedfisken",
        art: "Siganus vulpinus",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Paletkirurgen",
        art: "Paracanthurus hepatus",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Sommerfuglefisken",
        art: "Chaetodontidae",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Ildhalekutlingen",
        art: "Nemateleotris magnifica",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx"
    },
    {
        navn: "Konge Febars",
        art: "Gramma loreto",
        levested: "xxx",
        stoerrelse: "xxx",
        vaegt: "xxx",
        fartTekst: "xxx",
        funFact: "xxx",
        paaHovedet: true
    }
];

function svoemSamleFisk(fisk) {
    // Hent den valgte fisks regler ud fra dens data-fisk-nr.
    const nummer = Number(fisk.dataset.fiskNr);
    const regler = samleFiskInfo[nummer] || {};

    fisk.originalSrc = fisk.getAttribute("src");
    if (regler.pustOp) {
        new Image().src = regler.pustOp;
    }

    // De små fisk svømmer roligt med lidt forskellig fart.
    const hastighed = regler.hastighed ?? 30 + Math.random() * 35;
    const [minDybde, maxDybde] = regler.dybde ?? [0, 1];
    fisk.retning = regler.kigger === "venstre" ? -1 : 1;

    if (regler.bredde) {
        fisk.style.setProperty("--bredde", regler.bredde + "px");
    }

    fisk.nyTur = function () {
        // Kun én timer må være aktiv for hver fisk.
        clearTimeout(fisk.timer);

        // Vælg et tilfældigt punkt, som stadig holder hele fisken inde i akvariet.
        const maxX = Math.max(0, samleFiskAkvarium.clientWidth - fisk.clientWidth);
        const maxY = Math.max(0, samleFiskAkvarium.clientHeight - fisk.clientHeight);
        const nyX = Math.random() * maxX;
        const nyY = (minDybde + Math.random() * (maxDybde - minDybde)) * maxY;
        const retning = nyX > fisk.offsetLeft ? 1 : -1;

        fisk.style.transform = `scaleX(${retning * fisk.retning})`;

        // En længere strækning tager længere tid, så hastigheden virker ensartet.
        const afstand = Math.hypot(nyX - fisk.offsetLeft, nyY - fisk.offsetTop);
        const tid = Math.max(afstand / hastighed, 1);

        fisk.style.setProperty("--tid", tid + "s");
        fisk.style.left = nyX + "px";
        fisk.style.top = nyY + "px";
        fisk.timer = setTimeout(fisk.nyTur, tid * 1000);
    };

    fisk.nyTur();
}

function frysSamleFisk(fisk) {
    // Gem den beregnede placering fra browseren, så fisken ikke hopper, når den stoppes.
    clearTimeout(fisk.timer);
    const stil = getComputedStyle(fisk);

    fisk.style.setProperty("--tid", "0s");
    fisk.style.left = stil.left;
    fisk.style.top = stil.top;
}

function vaelgSamleFisk(fisk) {
    // Stop gruppen, vis overlayet og fyld den fælles boble med den valgte fisks data.
    valgtSamleFisk = fisk;
    alleSamleFisk.forEach(frysSamleFisk);
    samleFiskAkvarium.classList.add("samlefisk-pause");
    aktiverFiskFokus(fisk);

    const nummer = Number(fisk.dataset.fiskNr);
    const info = samleFiskInfo[nummer] || {};

    samleFiskTaleboble.querySelectorAll("[data-felt]").forEach(function (element) {
        element.textContent = info[element.dataset.felt] ?? "";
    });

    // Beregn en samlet, centreret placering til fisken og boblen.
    const mellemrum = Math.min(40, samleFiskAkvarium.clientWidth * 0.04);
    const fiskBredde = Math.min(350, samleFiskAkvarium.clientWidth * 0.38);
    const fiskHoejde = fiskBredde * (fisk.clientHeight / fisk.clientWidth);
    const pladsTilBoble = samleFiskAkvarium.clientWidth - fiskBredde - mellemrum - 30;
    const bobleBredde = Math.max(180, Math.min(460, pladsTilBoble));
    const gruppeBredde = fiskBredde + mellemrum + bobleBredde;
    const startX = Math.max(10, (samleFiskAkvarium.clientWidth - gruppeBredde) / 2);

    fisk.style.setProperty("--valgt-bredde", fiskBredde + "px");
    fisk.classList.add("valgt");
    fisk.style.transform = `scaleX(${fisk.retning})`;
    fisk.style.setProperty("--tid", "1s");
    fisk.style.left = startX + "px";
    fisk.style.top = Math.max(10, (samleFiskAkvarium.clientHeight - fiskHoejde) / 2) + "px";

    samleFiskTaleboble.style.width = bobleBredde + "px";
    samleFiskTaleboble.style.left = startX + fiskBredde + mellemrum + "px";
    samleFiskTaleboble.style.top = Math.max(10, (samleFiskAkvarium.clientHeight - samleFiskTaleboble.offsetHeight) / 2) + "px";
    samleFiskTaleboble.classList.add("vis");
    samleFiskTaleboble.setAttribute("aria-hidden", "false");

    fisk.efterTimer = setTimeout(function () {
        if (info.pustOp) {
            fisk.src = info.pustOp;
            fisk.classList.add("puster");
        }

        if (info.paaHovedet) {
            fisk.style.transform = `scale(${fisk.retning}, -1)`;
        }
    }, 1000);
}

function slipSamleFisk() {
    // Gendan billede, størrelse og retning, før fisken svømmer videre.
    if (!valgtSamleFisk) {
        return;
    }

    clearTimeout(valgtSamleFisk.efterTimer);
    valgtSamleFisk.src = valgtSamleFisk.originalSrc;
    valgtSamleFisk.classList.remove("puster", "valgt", "fisk-forrest");
    valgtSamleFisk.style.transform = `scaleX(${valgtSamleFisk.retning})`;
    valgtSamleFisk = null;

    samleFiskAkvarium.classList.remove("samlefisk-pause");
    samleFiskTaleboble.classList.remove("vis");
    samleFiskTaleboble.setAttribute("aria-hidden", "true");

    afslutFiskFokusHvisMuligt();
}

alleSamleFisk.forEach(function (fisk) {
    function klikPaaSamleFisk(event) {
        event.stopPropagation();

        if (valgtSamleFisk) {
            slipSamleFisk();
        } else {
            vaelgSamleFisk(fisk);
        }
    }

    fisk.addEventListener("click", klikPaaSamleFisk);
    fisk.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            klikPaaSamleFisk(event);
        }
    });
});

samleFiskAkvarium.addEventListener("click", function () {
    slipSamleFisk();
});

window.addEventListener("load", function () {
    alleSamleFisk.forEach(function (fisk) {
        svoemSamleFisk(fisk);
    });
});
