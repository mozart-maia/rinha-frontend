const jsoninput = document.getElementById("json-input");
const preEl = document.getElementById("json-tree-viewer");
const loadingp = document.getElementById("loading");
const loadingimg = document.getElementById("loadingimg");
const btnhome = document.getElementById("home");

let indexScroll = 5;
let contentToLoadonScroll;
let intervalID;

const reader = new FileReader();

function loadItens() {
  if (indexScroll < contentToLoadonScroll.length) {
    if (indexScroll > contentToLoadonScroll.length - 100) {
      for (let i = indexScroll; i < contentToLoadonScroll.length; i++) {
        let someText = document.createTextNode(
          contentToLoadonScroll[indexScroll + 1]
        );
        preEl.appendChild(someText);
      }
    } else {
      for (let i = 0; i < 100; i++) {
        let someText = document.createTextNode(
          contentToLoadonScroll[indexScroll + i]
        );
        preEl.appendChild(someText);
      }
      indexScroll += 10;
    }
    let someText = document.createTextNode(contentToLoadonScroll[indexScroll]);
    preEl.appendChild(someText);
    indexScroll++;
  } else {
    clearInterval(intervalID);
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(file);
  });
}

if (jsoninput) {
  jsoninput.addEventListener("change", async function () {
    // clearInterval(intervalID);
    preEl.innerText = "";
    btnhome.style.display = "block";
    document.getElementById("labelfile").style.display = "none";
    const comeco = new Date();
    loadingp.style.display = "block";
    loadingimg.style.display = "block";
    document.getElementById("home").addEventListener("click", function () {
      location.reload();
    });

    const file = jsoninput.files[0];

    console.log(file);

    if (file.size > 30000000) {
      let content = await readFile(file);

      const textDecoder = new TextDecoder("utf-8");
      let text = textDecoder.decode(content);

      const re = new RegExp(/},/gm);
      text = text.replace(re, "}, \n\t");
      const listText = text.split(re);

      // const listText = [];
      // for (let i = 0; i < text.length; i += 200001) {
      //   listText.push(text.slice(i, i + 200000));
      // }

      loadingp.style.display = "none";
      loadingimg.style.display = "none";

      for (let i = 0; i < 5; i++) {
        let someText = document.createTextNode(listText[i]);
        preEl.appendChild(someText);
      }

      contentToLoadonScroll = listText;

      setInterval(loadItens, 4);

      const fim = new Date();

      console.log("Tempo:", (fim - comeco) / 1000);
    } else {
      let content = await readFile(file);
      const textDecoder = new TextDecoder("utf-8");
      let text = textDecoder.decode(content);
      preEl.innerText = text;
      loadingp.style.display = "none";
      loadingimg.style.display = "none";
    }
  });
}
