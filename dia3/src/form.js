const inputName = document.querySelector('[data-js="input-name"]');

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

inputName.addEventListener("input", handleFormatInputName);
