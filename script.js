//hämta alla portioner-fält
const quantityFields = [
	document.querySelector("#participants"),
	document.querySelector("#vegetarian"),
	document.querySelector("#vegan")
];

function validateQuantities(e) {
	const activeField = e.currentTarget; //aktiva fältet

	document.querySelectorAll(".error-message").forEach((message) => {
		message.textContent = "";
	}); //ta bort eventuella gamla felmeddelanden innan valideringen körs igen

	const values = quantityFields.map((field) => field.value);
	if (values.some((value) => value === "")) {
		return;
	} //gör en array av alla fältvärden och kolla om något är tomt, i så fall avbryts valideringen

	const [participants, vegetarian, vegan] = values.map(Number);
	if (vegetarian + vegan > participants) {
		activeField.parentElement.querySelector(".error-message").textContent = "Feltext";
	} //om summan av vegetarian och vegan är större än deltagare, visa "Feltext" på det aktiva fältet
}

//kör kontrollen varje gång användaren ändrar ett fält
quantityFields.forEach((field) => {
	field.addEventListener("input", validateQuantities);
});
