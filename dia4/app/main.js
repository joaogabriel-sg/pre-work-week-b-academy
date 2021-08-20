import "./style.css";

const carTable = document.querySelector('[data-js="car-table"] tbody');
const emptyCarMessageRow = document.createElement("tr");

function getURL(endpoint = "") {
  const baseURL = "http://localhost:3333/";
  const newEndpoint = endpoint.charAt(0) !== "/" ? endpoint : endpoint.slice(1);
  return `${baseURL}${newEndpoint}`;
}

function showEmptyMessage() {
  const column = document.createElement("td");
  column.textContent = "Nenhum carro encontrado";

  emptyCarMessageRow.appendChild(column);
  carTable.appendChild(emptyCarMessageRow);
}

function insertCarsIntoTable(cars) {
  if (!cars.length) {
    showEmptyMessage();
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

    if (!response.ok) throw new Error("");

    const cars = await response.json();
    insertCarsIntoTable(cars);
  } catch (error) {
    alert("Desculpe, ocorreu um erro durante no servidor.");
    console.log("ERROR getCars() :::", error);
  }
}

getCars();
