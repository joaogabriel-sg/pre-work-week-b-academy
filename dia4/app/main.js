import "./style.css";

const carForm = $('[data-js="car-form"]');
const carTable = $('[data-js="car-table"] tbody');

const emptyCarMessageRow = document.createElement("tr");
const errorMessage = document.createElement("span");

function $(element) {
  return document.querySelector(element);
}

function getURL(endpoint = "") {
  const baseURL = "http://localhost:3333/";
  const newEndpoint = endpoint.charAt(0) !== "/" ? endpoint : endpoint.slice(1);
  return `${baseURL}${newEndpoint}`;
}

function getFormElements(event) {
  return (element) => event.target.elements[element].value;
}

function resetForm() {
  carForm.reset();
  carForm.querySelector("input:nth-of-type(1)").focus();
  errorMessage.remove();
}

function showFormErrorMessage(message) {
  errorMessage.textContent = message;
  carForm.insertAdjacentElement("beforeend", errorMessage);
}

function showEmptyCarsMessageInTable() {
  const column = document.createElement("td");
  column.textContent = "Nenhum carro encontrado";

  emptyCarMessageRow.appendChild(column);
  carTable.appendChild(emptyCarMessageRow);
}

function insertCarsIntoTable(cars) {
  carTable.innerHTML = "";

  if (!cars.length) {
    showEmptyCarsMessageInTable();
    return;
  }

  emptyCarMessageRow.remove();

  cars.forEach((car) => {
    const row = document.createElement("tr");
    const { image, brandModel, year, plate, color } = car;

    [image, brandModel, year, plate, color].forEach((data) => {
      const column = document.createElement("td");
      column.textContent = data;

      row.appendChild(column);
    });

    carTable.appendChild(row);
  });
}

async function getCars() {
  try {
    const response = await fetch(getURL("/cars"));

    if (!response.ok) return;

    const cars = await response.json();
    insertCarsIntoTable(cars);
  } catch (error) {
    showEmptyCarsMessageInTable();
    showFormErrorMessage("Servidor não está funcionando.");
    console.debug("ERROR getCars() :::", error);
  }
}

async function handleCreateNewCar(event) {
  event.preventDefault();

  const elements = getFormElements(event);
  const newCar = {
    image: elements("image-url"),
    brandModel: elements("brand-model"),
    year: +elements("year"),
    plate: elements("plate"),
    color: elements("color"),
  };

  try {
    const response = await fetch(getURL("/cars"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newCar),
    });

    if (!response.ok) {
      const { message } = await response.json();
      showFormErrorMessage(message);
      return;
    }

    getCars();
    resetForm();
  } catch (error) {
    showFormErrorMessage("Servidor não está funcionando.");
    console.debug("ERROR handleCreateNewCar() :::", error);
  }
}

carForm.addEventListener("submit", handleCreateNewCar);

getCars();
