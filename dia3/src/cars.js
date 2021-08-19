const carForm = document.querySelector('[data-js="car-form"]');
const carTable = document.querySelector('[data-js="car-table"] tbody');

const getForm = (event) => (name) => event.target.elements[name].value;

const hasNewCarValidData = (newCar) =>
  Object.keys(newCar).every((key) => newCar[key]);

function resetForm() {
  const inputs = carForm.querySelectorAll("input");

  inputs.forEach((input, index) => {
    if (index === 0) input.focus();
    input.value = "";
  });
}

function insertNewCarIntoTable(newCar) {
  const row = document.createElement("tr");

  Object.keys(newCar).forEach((key) => {
    const column = document.createElement("td");
    column.textContent = newCar[key];

    row.appendChild(column);
  });

  carTable.appendChild(row);

  resetForm();
}

function handleSubmitCarForm(event) {
  event.preventDefault();

  const getFieldValue = getForm(event);

  const newCar = {
    image: getFieldValue("image-url"),
    model: getFieldValue("model"),
    year: getFieldValue("year"),
    plate: getFieldValue("car-plate"),
    color: getFieldValue("color"),
  };

  if (hasNewCarValidData(newCar)) {
    insertNewCarIntoTable(newCar);
  } else {
    alert("Por favor, preencha todos os dados do carro.");
  }
}

carForm.addEventListener("submit", handleSubmitCarForm);
