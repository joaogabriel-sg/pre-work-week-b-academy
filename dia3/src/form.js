const colors = [
  { name: "Vermelho", hexCode: "#e74c3c" },
  { name: "Verde", hexCode: "#2ecc71" },
  { name: "Azul", hexCode: "#3498db" },
  { name: "Preto", hexCode: "#191919" },
  { name: "Amarelo", hexCode: "#f1c40f" },
  { name: "Laranja", hexCode: "#e67e22" },
];

const form = document.querySelector('[data-js="form"]');
const inputName = document.querySelector('[data-js="input-name"]');

const colorsSelect = document.createElement("select");
colorsSelect.setAttribute("multiple", true);
colors.forEach((color) => {
  const option = document.createElement("option");
  option.value = color.hexCode;
  option.textContent = color.name;

  colorsSelect.appendChild(option);
});

form.appendChild(colorsSelect);

const divSelectedColorsContainer = document.createElement("div");
divSelectedColorsContainer.classList.add("selected-color-container");
colorsSelect.insertAdjacentElement("afterend", divSelectedColorsContainer);

function handleFormatInputName(event) {
  const unformattedName = event.target.value;

  const unformattedWordsArray = unformattedName.split(" ");
  const removedWords = ["da", "de", "do", "dos"];

  const formattedWordsArray = unformattedWordsArray.map((word) => {
    const wordInLowerCase = word.toLowerCase();

    if (removedWords.includes(wordInLowerCase)) return wordInLowerCase;

    const wordFirstLetter = wordInLowerCase.charAt(0).toUpperCase();
    const wordWithoutFirstLetter = wordInLowerCase.slice(1);

    return wordFirstLetter + wordWithoutFirstLetter;
  });

  const formattedName = formattedWordsArray.join(" ");
  event.target.value = formattedName;
}

function handleShowSelectedColors(event) {
  const selectedOptions = [...event.target.selectedOptions];

  divSelectedColorsContainer.innerHTML = "";

  selectedOptions.forEach((option) => {
    const hexColorCode = option.value;
    const selectedColorDiv = document.createElement("div");
    selectedColorDiv.style.background = hexColorCode;

    divSelectedColorsContainer.appendChild(selectedColorDiv || "#ccc");
  });
}

inputName.addEventListener("input", handleFormatInputName);
colorsSelect.addEventListener("change", handleShowSelectedColors);
