import "./style.css";
import { get, post, del } from "./http";

const url = "http://localhost:3333/cars";
const form = document.querySelector<HTMLFormElement>('[data-js="cars-form"]')!;
const table = document.querySelector<HTMLTableElement>('[data-js="table"]')!;

type Types = "image" | "text" | "color";

type ImageData = { src: string; alt: string };

type ElementByTypes = {
  ["image"]: (data: ImageData) => HTMLTableCellElement;
  ["text"]: (value: string) => HTMLTableCellElement;
  ["color"]: (value: string) => HTMLTableCellElement;
};

const getFormElement = (event: Event) => (elementName: string) => {
  const eventTarget = event.target as HTMLFormElement;
  return eventTarget.elements.namedItem(elementName) as HTMLInputElement;
};

const elementTypes: ElementByTypes = {
  image: createImage,
  text: createText,
  color: createColor,
};

type CreateImageDataType = { src: string; alt: string };

function createImage(data: CreateImageDataType) {
  const td = document.createElement("td");
  const img = document.createElement("img");
  img.src = data.src;
  img.alt = data.alt;
  img.width = 100;
  td.appendChild(img);
  return td;
}

function createText(value: string) {
  const td = document.createElement("td");
  td.textContent = value;
  return td;
}

function createColor(value: string) {
  const td = document.createElement("td");
  const div = document.createElement("div");
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.background = value;
  td.appendChild(div);
  return td;
}

type FormDataType = {
  image: string;
  brandModel: string;
  year: number;
  plate: string;
  color: string;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const getElement = getFormElement(e);

  const data: FormDataType = {
    image: getElement("image")?.value,
    brandModel: getElement("brand-model")?.value,
    year: +getElement("year")?.value,
    plate: getElement("plate")?.value,
    color: getElement("color")?.value,
  };

  const result = await post(url, data);

  if (result.error) {
    console.log("deu erro na hora de cadastrar", result.message);
    return;
  }

  const noContent = document.querySelector('[data-js="no-content"]');
  if (noContent) {
    table.removeChild(noContent);
  }

  createTableRow(data);

  const formTarget = e.target as HTMLFormElement;

  formTarget.reset();
  formTarget.querySelector<HTMLInputElement>('input[name="image"]')?.focus();
});

type Element =
  | {
      type: Types;
      value: {
        src: string;
        alt: string;
      };
    }
  | {
      type: Types;
      value: string;
    };

function createTableRow(data: FormDataType) {
  const elements: Element[] = [
    { type: "image", value: { src: data.image, alt: data.brandModel } },
    { type: "text", value: data.brandModel },
    { type: "text", value: data.year.toString() },
    { type: "text", value: data.plate },
    { type: "color", value: data.color },
  ];

  const tr = document.createElement("tr");
  tr.dataset.plate = data.plate;

  elements.forEach((element) => {
    const td = (elementTypes as { [key: string]: any })[element.type](
      element.value
    );
    // const td = elementTypes[element.type](element.value);
    tr.appendChild(td);
  });

  const button = document.createElement("button");
  button.textContent = "Excluir";
  button.dataset.plate = data.plate;

  button.addEventListener("click", handleDelete);

  tr.appendChild(button);

  table.appendChild(tr);
}

async function handleDelete(e: Event) {
  const button = e.target as HTMLButtonElement;
  const plate = button.dataset.plate;

  const result = await del(url, { plate });

  if (result.error) {
    console.log("erro ao deletar", result.message);
    return;
  }

  const tr = document.querySelector<HTMLTableRowElement>(
    `tr[data-plate="${plate}"]`
  )!;
  table.removeChild(tr);
  button.removeEventListener("click", handleDelete);

  const allTrs = table.querySelector("tr");
  if (!allTrs) {
    createNoCarRow();
  }
}

function createNoCarRow() {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  const thsLength =
    document.querySelectorAll<HTMLTableCellElement>("table th").length;
  td.setAttribute("colspan", thsLength.toString());
  td.textContent = "Nenhum carro encontrado";

  tr.dataset.js = "no-content";
  tr.appendChild(td);
  table.appendChild(tr);
}

async function main() {
  const result = await get(url);

  if (result.error) {
    console.log("Erro ao buscar carros", result.message);
    return;
  }

  if (result.length === 0) {
    createNoCarRow();
    return;
  }

  result.forEach(createTableRow);
}

main();
