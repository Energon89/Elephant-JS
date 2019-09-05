import { DrawingToolInterpretor } from "./drawing_interpretator.js";

//Initialize DOM Element
const htmlElements = {
  draw: document.querySelector(".draw"),
  inputFile: document.querySelector(".inputFile"),
  preview: document.querySelector(".preview"),
  saveButton: document.querySelector(".save")
};

document.addEventListener("DOMContentLoaded", event => {
  toggleButton();
  let drawText = "";
  const reader = new FileReader();
  reader.onload = function() {
    const commandLine = reader.result;
    try {
      const drawingInterpretor = new DrawingToolInterpretor(commandLine);
      drawText = drawingInterpretor.draw();
      console.log(drawText);
    } catch (event) {
      alert(event);
    }
  };

  htmlElements.inputFile.classList.add("hidden");
  htmlElements.inputFile.addEventListener("change", selectFile);

  //select the input file and render DOM elements
  function selectFile() {
    while (htmlElements.preview.firstChild) {
      htmlElements.preview.removeChild(htmlElements.preview.firstChild);
    }
    const curFiles = htmlElements.inputFile.files;
    if (curFiles.length === 0) {
      let paragraph = document.createElement("p");
      paragraph.textContent = "No files currently selected for upload";
      htmlElements.preview.appendChild(paragraph);
    } else {
      const list = document.createElement("ol");
      htmlElements.preview.appendChild(list);
      //it is possible to select multiple files for drawing, but only the first selected will draw
      for (let i = 0; i < curFiles.length; i++) {
        const listItem = document.createElement("div");
        if (validFileType(curFiles[i])) {
          const textFile = document.createElement("p");
          const fileName = curFiles[i].name;
          const reader = new FileReader();
          reader.readAsText(curFiles[i]);
          reader.onload = function() {
            textFile.innerText = `File name:  ${fileName}. 
              ${reader.result}`;
          };
          listItem.appendChild(textFile);
        } else {
          let paragraph = document.createElement("p");
          paragraph.textContent =
            "File name " +
            curFiles[i].name +
            ": Not a valid file type. Update your selection.";
          listItem.appendChild(paragraph);
        }
        list.appendChild(listItem);
      }
    }
    toggleButton();
  }

  const fileTypes = ["text/txt", "text/plain"];

  function validFileType(file) {
    for (let i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }
    return false;
  }

  htmlElements.draw.addEventListener(
    "click",
    () => {
      reader.readAsText(htmlElements.inputFile.files[0]);
    },
    false
  );
  htmlElements.saveButton.addEventListener(
    "click",
    () => {
      download(drawText, "output.txt");
    },
    false
  );
});

//save text in a file
function download(text, filename) {
  const file = new Blob([text], { type: "text/plain" });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

//disabled buttons when file is not selected
function toggleButton() {
  if (htmlElements.inputFile.value) {
    htmlElements.saveButton.removeAttribute("disabled");
    htmlElements.draw.removeAttribute("disabled");
  } else {
    htmlElements.draw.setAttribute("disabled", "true");
    htmlElements.saveButton.setAttribute("disabled", "true");
  }
}
