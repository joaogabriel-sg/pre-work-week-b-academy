import "./style.css";

const carForm = $('[data-js="car-form"]');
const carTable = $('[data-js="car-table"] tbody');
const carTableTitle = $('[data-js="car-table-title"]');

const emptyCarMessageRow = document.createElement("tr");
const errorMessage = document.createElement("span");
const deleteErrorMessage = document.createElement("span");

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
  carForm.insertAdjacentElement("beforeEnd", errorMessage);
}

function showTableErrorMessage(message) {
  deleteErrorMessage.textContent = message;
  carTableTitle.insertAdjacentElement("afterEnd", deleteErrorMessage);
}

function showEmptyCarsMessageInTable() {
  const column = document.createElement("td");
  column.textContent = "Nenhum carro encontrado";

  emptyCarMessageRow.innerHTML = "";

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
  deleteErrorMessage.remove();

  cars.forEach((car) => {
    const row = document.createElement("tr");
    const { image, brandModel, year, plate, color } = car;

    [image, brandModel, year, plate, color].forEach((data) => {
      const column = document.createElement("td");
      column.textContent = data;

      row.appendChild(column);
    });

    const deleteButtonColumn = document.createElement("td");
    const deleteButton = createDeleteCarButtonByPlate(plate);

    deleteButtonColumn.appendChild(deleteButton);
    row.appendChild(deleteButtonColumn);
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
    showTableErrorMessage("Servidor não está funcionando.");
    console.debug("ERROR getCars() :::", error);
  }
}

async function handleDeleteCarByPlate(plate) {
  try {
    const response = await fetch(getURL("/cars"), {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ plate }),
    });

    if (!response.ok) return;

    deleteErrorMessage.remove();
    getCars();
  } catch (error) {
    showTableErrorMessage("Não é possível excluir um carro.");
    console.debug("ERROR handleDeleteCarByPlate() :::", error);
  }
}

function createDeleteCarButtonByPlate(plate) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "❌";

  deleteButton.addEventListener("click", () => handleDeleteCarByPlate(plate));

  return deleteButton;
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
