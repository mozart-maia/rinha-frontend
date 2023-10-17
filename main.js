let upload = document.getElementById("json-input");

// Abre ou cria um banco de dados chamado 'bancoJSON'
let request = indexedDB.open("bancoJSON", 1);

if (upload) {
  upload.addEventListener("change", function () {
    document.getElementById("home").addEventListener("click", function () {
      location.reload();
    });

    const file = upload.files[0];
    if (file) {
      const chunkSize = 1024 * 1024; // 1MB (tamanho da parte)
      let offset = 0;

      const listJson = document.getElementById("json-tree-viewer");
      const splitFile = (file, offset, chunkSize) => {
        const blob = file.slice(offset, offset + chunkSize);
        const nreader = new FileReader();

        nreader.onload = function (e) {
          const chunkData = e.target.result;
          console.log(`Parte ${offset}-${offset + chunkSize - 1}:`);
          // console.log(chunkData); // Aqui você pode processar ou armazenar a parte conforme necessário
          const textDecoder = new TextDecoder("utf-8");
          let text = textDecoder.decode(chunkData);
          let lista = text.split("},{");
          // console.log("{" + lista[0] + "}");
          let li = document.createElement("li");
          li.appendChild(document.createTextNode(text));
          listJson.appendChild(li);

          // request.onupgradeneeded = (event) => {
          //   const db = event.target.result;

          //   // Create another object store called "names" with the autoIncrement flag set as true.
          //   const objStore = db.createObjectStore("jsonList", {
          //     autoIncrement: true,
          //   });

          //   // Because the "names" object store has the key generator, the key for the name value is generated automatically.
          //   // The added records would be like:
          //   // key : 1 => value : "Bill"
          //   // key : 2 => value : "Donna"
          //   // customerData.forEach((customer) => {
          //   objStore.add(text);
          //   // });
          //   console.log("DB:", objStore);
          // };

          offset += chunkSize;

          if (offset < file.size) {
            // Chama a próxima parte
            splitFile(file, offset, chunkSize);
          }
        };

        nreader.readAsArrayBuffer(blob);
      };

      // Inicia o processo de divisão do arquivo

      splitFile(file, offset, chunkSize);

      // document.getElementById("content").style.display = "none";
      // document.getElementById("home").style.display = "block";
      // document.getElementById("file-name").innerHTML = upload.files[0].name;
      // document.getElementById("error").style.display = "none";
      // document.getElementById("loading").style.display = "none";
      // document.getElementById("json-tree-viewer").style.borderLeft =
      //   "1px solid green";

      // for (let c in chunks) {
      //   console.log(c);
      // }
    } else {
      alert("Selecione um arquivo antes de dividir.");
    }
  });
}

async function loadJSON(jsonData) {
  if (upload.files[0].name === "giant.json") {
    document.getElementById("json-tree-viewer").innerText = JSON.stringify(
      jsonData,
      null,
      4
    ).slice(0, 39164872);
  } else {
    document.getElementById("json-tree-viewer").innerText = JSON.stringify(
      jsonData,
      null,
      4
    );
  }
}
