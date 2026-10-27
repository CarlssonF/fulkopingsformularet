const orderForm = document.getElementById("orderForm");
const messageArea = document.getElementById("messages");
const submitButton = document.getElementById("submitBtn");

// objekt för varje fält i formuläret
const conferenceDateField = {
  field: document.getElementById("conferenceDate"),
  errorMessage: document.getElementById("conferenceDate-error"),
  name: "bokmässans datum",
  type: "date"
};

const deliveryDateField = {
  field: document.getElementById("deliveryDate"),
  errorMessage: document.getElementById("deliveryDate-error"),
  name: "leveransdatum",
  type: "date"
};

const participantCountField = {
  field: document.getElementById("participants"),
  errorMessage: document.getElementById("participants-error"),
  name: "antal deltagare",
  type: "number"
};

const vegetarianCountField = {
  field: document.getElementById("vegetarian"),
  errorMessage: document.getElementById("vegetarian-error"),
  name: "antal vegetariska portioner",
  type: "number"
};

const veganCountField = {
  field: document.getElementById("vegan"),
  errorMessage: document.getElementById("vegan-error"),
  name: "antal veganportioner",
  type: "number"
};

// array med alla fältobjekt 
const formFields = [
  conferenceDateField,
  deliveryDateField,
  participantCountField,
  vegetarianCountField,
  veganCountField
];

/* utgår från att användaren inte har försökt skicka formuläret än, 
de här används sen för att inte visa felmeddelanden för tomma fält innan användaren försöker skicka formuläret, 
och visa felmeddelanden för specialkostportioner vid senast ändrade fältet */
let hasTriedToSubmit = false;
let lastEditedPortionField = null; // inget är senast ändrat vid start, därav null

// =====================================================
// VISA OCH TA BORT FELMEDDELANDEN
// =====================================================

function showFieldError(fieldObject, errorText) {
  fieldObject.errorMessage.textContent = errorText; // tar felmeddelandet från objektet och sätter det som text i felmeddelandeelementet
  fieldObject.field.setAttribute("aria-invalid", "true"); // aria för att visa att fältet är ogiltigt
  fieldObject.field.classList.remove("is-valid"); // tar bort den gröna kanten om fältet tidigare var giltigt
}

function markFieldAsValid(fieldObject) {
  fieldObject.field.classList.add("is-valid");
}

// tar bort alla felmeddelanden och markeringar för ogiltiga och giltiga fält, nollställer
function clearFieldErrors() {
  for (let i = 0; i < formFields.length; i++) {
    const field = formFields[i];

    field.field.removeAttribute("aria-invalid");
    field.field.classList.remove("is-valid");
    field.errorMessage.textContent = "";
  }
}

// fokuserar på det första fältet som har ett felmeddelande, när man försöker skicka formuläret med fel
function focusFirstFieldWithError() {
  for (let i = 0; i < formFields.length; i++) {
    const field = formFields[i];

    if (field.errorMessage.textContent !== "") {
      field.field.focus();
      return;
    }
  }
}

// =====================================================
// VALIDERING AV INDIVIDUELLA FÄLT
// =====================================================

// validerar att ett fält innehåller ett heltal som är 0 eller större, och returnerar felmeddelanden
function validateWholeNumber(field, fieldName) {
  const text = field.value.trim(); // texten i fältet utan mellanslag i början och slutet

  if (text === "") {
    return "Ange " + fieldName + ".";
  }

  const number = Number(text);

  if (isNaN(number)) {
    return "Skriv " + fieldName + " som ett heltal med bara siffror, t.ex. 25 (inte 5apa eller 3,5).";
  }

  if (number < 0) {
    return "Du kan inte ange ett negativt tal för " + fieldName + ".";
  }

  if (number % 1 !== 0) {
    return "Skriv " + fieldName + " som ett heltal, utan decimaler.";
  }

  return "";
}

// validerar att ett fält innehåller ett datum i framtiden, returnerar annars felmeddelanden
function validateFutureDate(field, fieldName) {
  if (field.value === "") {
    return "Ange " + fieldName + ".";
  }

  const today = new Date();
  const todayAsText = // dagens datum i formatet YYYY-MM-DD
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0"); // padStart lägger till en nolla framför månaden och dagen om de är ensiffriga

  if (field.value <= todayAsText) {
    return "Du måste välja " + fieldName + " i framtiden (tidigast imorgon).";
  }

  return "";
}

// skapar och lägger till ett objekt med fält, felmeddelande och kort felmeddelande i en lista med fel, och markerar om fältet är tomt
function addError(errorList, field, errorText, shortErrorText) {
  errorList.push({
    field: field,
    text: errorText,
    shortText: shortErrorText,
    isEmpty: field.field.value.trim() === ""
  });
}

// validerar alla fält individuellt och lägger till eventuella fel i errorList
function validateIndividualFields(errorList) {
  for (let i = 0; i < formFields.length; i++) {
    const field = formFields[i];
    let errorText = "";

    if (field.type === "date") {
      errorText = validateFutureDate(field.field, field.name);
    } else {
      errorText = validateWholeNumber(field.field, field.name);
    }

    if (errorText !== "") {
      addError(errorList, field, errorText, errorText);
    }
  }
}

// formaterar antal dagar till en textsträng, t.ex. "1 dag" eller "3 dagar" till felmeddelanden
function formatDayCount(numberOfDays) {
  if (numberOfDays === 1) {
    return "1 dag";
  }

  return numberOfDays + " dagar";
}

// =====================================================
// MELLANFÄLTSVALIDERING
// =====================================================

// validerar att antalet vegetariska och veganska portioner inte är fler än antalet deltagare, lägger till fel i errorList om det är fler
function validatePortionCounts(errorList) {
  const participantCountIsValid =
    validateWholeNumber(participantCountField.field, participantCountField.name) === "";
  const vegetarianCountIsValid =
    validateWholeNumber(vegetarianCountField.field, vegetarianCountField.name) === "";
  const veganCountIsValid =
    validateWholeNumber(veganCountField.field, veganCountField.name) === "";

// om fälten inte har heltal eller är tomma, returnera utan att göra fler kontroller och visa det felmeddelandet istället
  if (
    participantCountIsValid === false ||
    vegetarianCountIsValid === false ||
    veganCountIsValid === false
  ) {
    return;
  }

  const participantCount = Number(participantCountField.field.value.trim());
  const vegetarianCount = Number(vegetarianCountField.field.value.trim());
  const veganCount = Number(veganCountField.field.value.trim());
  const totalSpecialPortions = vegetarianCount + veganCount;

  // om det totala antalet specialkostportioner är fler än antalet deltagare
  if (totalSpecialPortions > participantCount) {
    const errorText =
      "Vegetariska (" + vegetarianCount + ") och veganska (" + veganCount +
      ") portioner blir " + totalSpecialPortions +
      " tillsammans. Det är fler än antalet deltagare (" + participantCount +
      "). Minska antalet portioner eller öka antalet deltagare.";
    const fieldWithError = lastEditedPortionField || veganCountField; // visar felmeddelandet vid det senast ändrade fältet, eller veganfältet som standard

    addError(
      errorList,
      fieldWithError,
      errorText,
      "Fler specialkostportioner än deltagare."
    );
  }
}

// validerar att leveransdatumet är på konferensdagen eller dagen innan, lägger till fel i errorList om det inte är det
function validateDeliveryDate(errorList) {
  const conferenceDateIsValid =
    validateFutureDate(conferenceDateField.field, conferenceDateField.name) === "";
  const deliveryDateIsValid =
    validateFutureDate(deliveryDateField.field, deliveryDateField.name) === "";

// om fälten inte har giltiga datum eller är tomma, returnera utan att göra fler kontroller och visa det felmeddelandet istället
  if (conferenceDateIsValid === false || deliveryDateIsValid === false) {
    return;
  }

  const conferenceDate = new Date(conferenceDateField.field.value);
  const deliveryDate = new Date(deliveryDateField.field.value);
  const daysBetweenDates =
    (conferenceDate - deliveryDate) / (1000 * 60 * 60 * 24); // skillnaden i dagar mellan konferensdatumet och leveransdatumet, js lagrar datum som millisekunder därav divisionen för att få skillnaden i dagar

  // om leveransdatumet är efter konferensdatumet
  if (daysBetweenDates < 0) {
    const daysAfterConference = 0 - daysBetweenDates; // vänder tecknet på skillnaden så att det blir ett positivt tal, för att visa i felmeddelandet
    const errorText =
      "Leveransdatum är " + formatDayCount(daysAfterConference) +
      " efter konferensdatumet " + conferenceDateField.field.value +
      ". Leveransen måste ske på konferensdagen eller dagen före.";

    addError(
      errorList,
      deliveryDateField,
      errorText,
      "Leveransdatum kan inte vara efter bokmässans datum."
    );
// om leveransdatumet är mer än en dag före konferensdatumet
  } else if (daysBetweenDates > 1) {
    const errorText =
      "Leveransdatum är " + formatDayCount(daysBetweenDates) +
      " före konferensdatumet " + conferenceDateField.field.value +
      ". Leveransen måste ske på konferensdagen eller dagen före.";

    addError(
      errorList,
      deliveryDateField,
      errorText,
      "Leveransdatum måste vara max 1 dag före bokmässans datum."
    );
  }
}

// =====================================================
// HÄMTA ALLA FEL
// =====================================================

// här skapas listan med alla felmeddelanden genom att köra funktionerna för individuell och mellanfältsvalidering, returnerar listan med alla fel som hittas
function getAllErrors() {
  const errorList = [];

  validateIndividualFields(errorList);
  validatePortionCounts(errorList);
  validateDeliveryDate(errorList);

  return errorList;
}

// kollar om ett fält finns i listan med fel, returnerar true om det finns, annars false, alltså om det har fel eller inte
function fieldHasError(errorList, field) {
  for (let i = 0; i < errorList.length; i++) {
    if (errorList[i].field === field) {
      return true;
    }
  }

  return false;
}

// =====================================================
// VISA FELSAMMANFATTNING OCH UPPDATERA SKICKA-KNAPP
// =====================================================

// visar en sammanfattning av alla felmeddelanden i ett fält högst upp i formuläret, om det finns några fel
function showErrorSummary(shortErrorTexts) {

// om det inte finns några fel, visa ingen sammanfattning
  if (shortErrorTexts.length === 0) {
    messageArea.innerHTML = "";
    return;
  }

// skapar html för sammanfattningsrutan
  let html = '<div class="summary-box">';
  html += '<p class="summary-title">Det går inte att skicka beställningen än</p>';
  html += '<p class="summary-text">Rätta felen nedan. Varje fel står också vid det fält det gäller.</p>';
  html += '<ul class="summary-list">';

// listar alla korta felmeddelanden i en lista och lägger till dem rutan
  for (let i = 0; i < shortErrorTexts.length; i++) {
    html += "<li>" + shortErrorTexts[i] + "</li>";
  }

  html += "</ul></div>";
  messageArea.innerHTML = html;
}

// bekräftelse när formuläret skickas
function showSuccessMessage() {
  messageArea.innerHTML =
    '<div class="summary-box summary-box--success">' +
    '<p class="summary-title">Beställningen är skickad!</p>' +
    "</div>";
}

// aktiverar eller inaktiverar skicka-knappen beroende på om det finns några fel i formuläret
function updateSubmitButton(errorList) {
  if (errorList.length === 0) {
    submitButton.classList.add("is-ready");
  } else {
    submitButton.classList.remove("is-ready");
  }
}

// huvudfunktion som validerar alla fält, visar felmeddelanden och uppdaterar skicka-knappen, returnerar listan med alla fel
function validateAndUpdateForm() {
  const errorList = getAllErrors();
  const shortErrorTexts = [];

  clearFieldErrors(); // tar bort alla tidigare felmeddelanden och markeringar för ogiltiga och giltiga fält, nollställer

// loopar igenom alla fel och visar dem vid respektive fält, samt lägger till korta felmeddelanden i en lista till sammanfattningsrutan
  for (let i = 0; i < errorList.length; i++) {
    const error = errorList[i];

    if (error.isEmpty === false || hasTriedToSubmit === true) {
      showFieldError(error.field, error.text);
      shortErrorTexts.push(error.shortText);
    }
  }
  
// loopar igenom alla fält och markerar de som är giltiga
  for (let i = 0; i < formFields.length; i++) {
    const field = formFields[i];
    const fieldIsFilledIn = field.field.value.trim() !== "";
    const fieldHasAnError = fieldHasError(errorList, field);

    if (fieldIsFilledIn && fieldHasAnError === false) {
      markFieldAsValid(field);
    }
  }

  // visar sammanfattningsrutan och uppdaterar skicka-knappen beroende på om det finns några fel i formuläret eller om det är giltigt
  showErrorSummary(shortErrorTexts);
  updateSubmitButton(errorList);

  return errorList;
}

// uppdaterar skicka-knappen när användaren skriver i ett fält, och sparar vilket fält som senast ändrades med hjälp av event.target (det aktiva fältet)
function updateSubmitButtonAfterTyping(event) {
  if (event.target === vegetarianCountField.field) {
    lastEditedPortionField = vegetarianCountField;
  } else if (event.target === veganCountField.field) {
    lastEditedPortionField = veganCountField;
  }

  const errorList = getAllErrors();
  updateSubmitButton(errorList);
}

// =====================================================
// EVENT (ALLT KÖRS)
// =====================================================

// när man skickar formuläret, körs valideringen och visar felmeddelanden eller bekräftelse om det är giltigt
orderForm.addEventListener("submit", function (event) {
  
// ladda inte om sidan när man skickar formuläret, vilket är default, utan visa felmeddelanden och markera fält med fel eller visa bekräftelse om det är giltigt
  event.preventDefault();
  hasTriedToSubmit = true;
  
  // listan med alla fel som fås av huvudfunktionen validateAndUpdateForm, som nu körs när man försöker skicka formuläret
  const errorList = validateAndUpdateForm();

  if (errorList.length > 0) {
    focusFirstFieldWithError();
    return;
  }

// visa bekräftelse om det inte finns några fel
  showSuccessMessage();
});

// Validera formuläret när ett fält ändras och uppdatera knappen medan användaren skriver.
for (let i = 0; i < formFields.length; i++) {
  const field = formFields[i].field;

  field.addEventListener("change", validateAndUpdateForm);
  field.addEventListener("input", updateSubmitButtonAfterTyping);
}

// när sidan laddas körs valideringen
validateAndUpdateForm();