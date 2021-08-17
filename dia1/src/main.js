import "./style.css";

const app = document.querySelector('[data-js="app"]');
const buttonLink = document.querySelector('[data-js="link"]');

function handleToggleAppVisibility(event) {
  event.preventDefault();

  /*
    Optei por utilizar a abordagem com visibility
    por ter colocado o botão abaixo da div .app e por
    por ele não influenciar no posicionamento do botão
    ou quaisquer outros elementos quando a app não for visível
    em tela, ou seja, no meu caso, o botão não subiria.
  */

  const appVisibility = getComputedStyle(app).visibility;
  const isAppVisible = appVisibility === "visible";

  app.style.visibility = isAppVisible ? "hidden" : "visible";
}

buttonLink.addEventListener("click", handleToggleAppVisibility, false);

document.querySelector('[data-js="app"]').innerHTML = `
  <h1>B. Academy</h1>
  <p>Boas vindas à semana de pré-work para o Bootcamp em React.js 😁</p>
`;
