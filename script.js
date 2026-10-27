// =====================================================
// script.js - Validering av beställningsformuläret
// =====================================================


// ---------- 1. Hämta elementen från HTML ----------

var form = document.getElementById("orderForm");
var messages = document.getElementById("messages");
var submitBtn = document.getElementById("submitBtn");

// Fälten
var conferenceDate = document.getElementById("conferenceDate");
var deliveryDate = document.getElementById("deliveryDate");
var participants = document.getElementById("participants");
var vegetarian = document.getElementById("vegetarian");
var vegan = document.getElementById("vegan");

// Platserna där felmeddelandena visas (ett per fält)
var conferenceDateError = document.getElementById("conferenceDate-error");
var deliveryDateError = document.getElementById("deliveryDate-error");
var participantsError = document.getElementById("participants-error");
var vegetarianError = document.getElementById("vegetarian-error");
var veganError = document.getElementById("vegan-error");

// Två listor (arrayer) med fälten och felrutorna i SAMMA ordning som på sidan.
// Plats 0 i första listan hör ihop med plats 0 i andra listan osv.
var allaFalt = [conferenceDate, deliveryDate, participants, vegetarian, vegan];
var allaFelrutor = [conferenceDateError, deliveryDateError, participantsError, vegetarianError, veganError];

// Har användaren försökt skicka formuläret?
// Tomma fält får bara felmeddelande efter det första försöket.
var harForsoktSkicka = false;


// =====================================================
// 2. HJÄLPFUNKTIONER FÖR ATT ÄNDRA UTSEENDET
// =====================================================

// Visar ett felmeddelande vid ett fält
function visaFel(input, errorElement, text) {
  errorElement.textContent = text;
  input.setAttribute("aria-invalid", "true"); // används av CSS (röd ram) och skärmläsare
  input.classList.remove("is-valid");
}

// Markerar ett fält som godkänt (grön ram)
function markeraGiltig(input) {
  input.classList.add("is-valid");
}

// Rensar alla fält och felrutor
function rensaAllaFalt() {
  for (var i = 0; i < allaFalt.length; i++) {
    allaFalt[i].removeAttribute("aria-invalid");
    allaFalt[i].classList.remove("is-valid");
    allaFelrutor[i].textContent = "";
  }
}

// Returnerar true om en felruta innehåller ett felmeddelande
function harFel(errorElement) {
  if (errorElement.textContent !== "") {
    return true;
  } else {
    return false;
  }
}

// Flyttar markören till det första fältet (uppifrån och ner) som har fel
function fokuseraForstaFelet() {
  for (var i = 0; i < allaFalt.length; i++) {
    if (harFel(allaFelrutor[i])) {
      allaFalt[i].focus();
      return; // klart, vi vill bara fokusera på det första
    }
  }
}


// =====================================================
// 3. DEL 1 - INDIVIDUELLA KONTROLLER (ett fält i taget)
// =====================================================

// Kontrollerar ett antalsfält. Returnerar ett felmeddelande, eller "" om det är ok.
function kontrolleraAntal(input, namn) {
  var text = input.value.trim(); // trim() tar bort mellanslag i början och slutet

  // 1. Fältet får inte vara tomt
  // (Number("") blir 0, så tomt måste kollas först)
  if (text === "") {
    return "Ange " + namn + ".";
  }

  // Number("5apa") och Number("3,5") blir NaN (= "Not a Number").
  // parseInt("5apa") skulle ge 5 och missa felet, därför använder vi Number.
  var tal = Number(text);

  // 2. Måste kunna tolkas som ett tal
  if (isNaN(tal)) {
    return "Skriv " + namn + " som ett heltal med bara siffror, t.ex. 25 (inte 5apa eller 3,5).";
  }

  // 3. Får inte vara negativt
  if (tal < 0) {
    return "Du kan inte ange ett negativt tal för " + namn + ".";
  }

  // 4. Måste vara ett heltal (resten vid division med 1 är 0 för heltal)
  if (tal % 1 !== 0) {
    return "Skriv " + namn + " som ett heltal, utan decimaler.";
  }

  return ""; // inga fel
}

// Hämtar dagens datum med klockslaget nollställt (00:00:00)
function hamtaDagensDatum() {
  var idag = new Date();
  idag.setHours(0, 0, 0, 0);
  return idag;
}

// Kontrollerar ett datumfält: ifyllt och i framtiden.
// Returnerar ett felmeddelande, eller "" om det är ok.
function kontrolleraDatum(input, namn) {
  if (input.value === "") {
    return "Ange " + namn + ".";
  }

  // "T00:00:00" gör att datumet tolkas som midnatt i vår egen tidszon
  var valtDatum = new Date(input.value + "T00:00:00");
  var idag = hamtaDagensDatum();

  // Vi tolkar "i framtiden" som från och med imorgon
  if (valtDatum <= idag) {
    return "Du måste välja " + namn + " i framtiden (tidigast imorgon).";
  }

  return "";
}


// =====================================================
// 4. HITTA ALLA FEL
// =====================================================
// Felen sparas som objekt i en lista. Varje fel har:
//   input        - vilket fält det gäller
//   errorElement - var felet ska visas
//   kort         - kort text för felrutan överst
//   lang         - längre text vid fältet
//   tomt         - true om fältet är tomt

function laggTillFel(lista, input, errorElement, kortText, langText) {
  var fel = {
    input: input,
    errorElement: errorElement,
    kort: kortText,
    lang: langText,
    tomt: input.value.trim() === ""
  };
  lista.push(fel); // push() lägger till i slutet av listan
}

// ----- Del 1: individuell validering -----
function valideraIndividuellt(fel) {
  var text;

  text = kontrolleraDatum(conferenceDate, "bokmässans datum");
  if (text !== "") {
    laggTillFel(fel, conferenceDate, conferenceDateError, text, text);
  }

  text = kontrolleraDatum(deliveryDate, "leveransdatum");
  if (text !== "") {
    laggTillFel(fel, deliveryDate, deliveryDateError, text, text);
  }

  text = kontrolleraAntal(participants, "antal deltagare");
  if (text !== "") {
    laggTillFel(fel, participants, participantsError, text, text);
  }

  text = kontrolleraAntal(vegetarian, "antal vegetariska portioner");
  if (text !== "") {
    laggTillFel(fel, vegetarian, vegetarianError, text, text);
  }

  text = kontrolleraAntal(vegan, "antal veganportioner");
  if (text !== "") {
    laggTillFel(fel, vegan, veganError, text, text);
  }
}

// ----- Del 2: mellanfältsvalidering -----

// Skriver "1 dag" eller "2 dagar"
function dagarText(antal) {
  if (antal === 1) {
    return "1 dag";
  } else {
    return antal + " dagar";
  }
}

// Regel 1: vegetariska + veganska får inte vara fler än deltagarna
function valideraPortioner(fel) {
  // Kör bara om alla tre fält är giltiga var för sig, annars finns inga riktiga tal att jämföra
  var deltagareOk = kontrolleraAntal(participants, "antal deltagare") === "";
  var vegetariskaOk = kontrolleraAntal(vegetarian, "antal vegetariska portioner") === "";
  var veganskaOk = kontrolleraAntal(vegan, "antal veganportioner") === "";

  if (deltagareOk === false || vegetariskaOk === false || veganskaOk === false) {
    return; // avbryter funktionen
  }

  // Number() behövs, annars blir "2" + "3" texten "23" i stället för 5
  var antalDeltagare = Number(participants.value.trim());
  var antalVegetariska = Number(vegetarian.value.trim());
  var antalVeganska = Number(vegan.value.trim());
  var summa = antalVegetariska + antalVeganska;

  if (summa > antalDeltagare) {
    laggTillFel(
      fel,
      vegan,
      veganError,
      "Fler specialkostportioner än deltagare.",
      "Vegetariska (" + antalVegetariska + ") och veganska (" + antalVeganska + ") portioner blir " +
      summa + " tillsammans. Det är fler än antalet deltagare (" + antalDeltagare + "). " +
      "Minska antalet portioner eller öka antalet deltagare."
    );
  }
}

// Regel 2: leveransen ska vara samma dag som mässan eller dagen före
function valideraLeveransdatum(fel) {
  // Kör bara om båda datumen är giltiga var för sig
  var mässaOk = kontrolleraDatum(conferenceDate, "bokmässans datum") === "";
  var leveransOk = kontrolleraDatum(deliveryDate, "leveransdatum") === "";

  if (mässaOk === false || leveransOk === false) {
    return;
  }

  var massa = new Date(conferenceDate.value + "T00:00:00");
  var leverans = new Date(deliveryDate.value + "T00:00:00");

  // Skillnad i dagar. Math.round hanterar sommar-/vintertid (dygn med 23 eller 25 timmar).
  var millisekunderPerDag = 1000 * 60 * 60 * 24;
  var skillnadIDagar = Math.round((massa - leverans) / millisekunderPerDag);
  // 0 = samma dag, 1 = dagen före, negativt = efter mässan, över 1 = för tidigt

  if (skillnadIDagar < 0) {
    var dagarEfter = 0 - skillnadIDagar; // gör om till positivt tal
    laggTillFel(
      fel,
      deliveryDate,
      deliveryDateError,
      "Leveransdatum kan inte vara efter bokmässans datum.",
      "Leveransdatum är " + dagarText(dagarEfter) + " efter konferensdatumet " + conferenceDate.value +
      ". Leveransen måste ske på konferensdagen eller dagen före."
    );
  } else if (skillnadIDagar > 1) {
    laggTillFel(
      fel,
      deliveryDate,
      deliveryDateError,
      "Leveransdatum måste vara max 1 dag före bokmässans datum.",
      "Leveransdatum är " + dagarText(skillnadIDagar) + " före konferensdatumet " + conferenceDate.value +
      ". Leveransen måste ske på konferensdagen eller dagen före."
    );
  }
}

function valideraMellanFalt(fel) {
  valideraPortioner(fel);
  valideraLeveransdatum(fel);
}

// Samlar alla fel (både individuella och mellan fält) i en lista
function hittaFel() {
  var fel = []; // tom lista
  valideraIndividuellt(fel);
  valideraMellanFalt(fel);
  return fel;
}


// =====================================================
// 5. VISA RESULTATET PÅ SIDAN
// =====================================================

// Returnerar true om det finns ett fel i listan för just det fältet
function harFelObjekt(fel, input) {
  for (var i = 0; i < fel.length; i++) {
    if (fel[i].input === input) {
      return true;
    }
  }
  return false;
}

// Bygger felrutan överst. Får in en lista med korta texter.
// OBS: innerHTML är ok här eftersom texterna kommer från vår egen kod
// och inte innehåller något användaren skrivit.
function visaSammanfattning(korta) {
  if (korta.length === 0) {
    messages.innerHTML = "";
    return;
  }

  var html = '<div class="summary-box">';
  html += '<p class="summary-title">Det går inte att skicka beställningen än</p>';
  html += '<p class="summary-text">Rätta felen nedan. Varje fel står också vid det fält det gäller.</p>';
  html += '<ul class="summary-list">';
  for (var i = 0; i < korta.length; i++) {
    html += "<li>" + korta[i] + "</li>";
  }
  html += "</ul></div>";

  messages.innerHTML = html;
}

// Visar att beställningen har skickats
function visaFramgang() {
  messages.innerHTML =
    '<div class="summary-box summary-box--success">' +
    '<p class="summary-title">Beställningen är skickad!</p>' +
    "</div>";
}

// Gör knappen röd när hela formuläret är giltigt, annars grå
function uppdateraKnappen() {
  var fel = hittaFel();
  if (fel.length === 0) {
    submitBtn.classList.add("is-ready");
  } else {
    submitBtn.classList.remove("is-ready");
  }
}

// Huvudfunktion: kontrollerar allt och uppdaterar hela sidan
function uppdateraSidan() {
  var fel = hittaFel();
  var synligaKorta = []; // korta texter till felrutan

  // Börja med ren sida
  rensaAllaFalt();

  // Visa felen. Tomma fält visas bara efter att man försökt skicka.
  for (var i = 0; i < fel.length; i++) {
    if (fel[i].tomt === false || harForsoktSkicka === true) {
      visaFel(fel[i].input, fel[i].errorElement, fel[i].lang);
      synligaKorta.push(fel[i].kort);
    }
  }

  // Grön ram på ifyllda fält som inte har något fel
  for (var j = 0; j < allaFalt.length; j++) {
    if (allaFalt[j].value.trim() !== "" && harFelObjekt(fel, allaFalt[j]) === false) {
      markeraGiltig(allaFalt[j]);
    }
  }

  visaSammanfattning(synligaKorta);
  uppdateraKnappen();
}


// =====================================================
// 6. HÄNDELSER (events)
// =====================================================

// När formuläret skickas
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stoppar sidan från att laddas om

  harForsoktSkicka = true; // nu får även tomma fält fel
  uppdateraSidan();

  var fel = hittaFel();
  if (fel.length > 0) {
    fokuseraForstaFelet();
    return; // beställningen skickas inte
  }

  visaFramgang();
  // Här skulle man i ett riktigt projekt skicka datan till en server
});

// För varje fält:
// "change" = användaren är klar med fältet (lämnar det eller väljer datum) -> validera allt
// "input"  = användaren skriver -> uppdatera bara knappens färg
for (var i = 0; i < allaFalt.length; i++) {
  allaFalt[i].addEventListener("change", uppdateraSidan);
  allaFalt[i].addEventListener("input", uppdateraKnappen);
}

// Kör en gång när sidan laddas (ifall webbläsaren fyllt i fält automatiskt)
uppdateraSidan();