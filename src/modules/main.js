import { DrawingToolInterpretor } from "./drawing_interpretator.js";

document.addEventListener("DOMContentLoaded", function(event) {
  const draw = document.querySelector(".submit");
  const inputFile = document.querySelector(".inputFile");
  const preview = document.querySelector(".preview");

  let reader = new FileReader();
  reader.onload = function() {
    let commandLine = reader.result;
    try {
      let drawingInterpretor = new DrawingToolInterpretor(commandLine);
      let drawText = drawingInterpretor.draw();
      download(drawText, "output.txt");
      console.log(drawText);
    } catch (event) {
      alert(event);
    }
  };

  inputFile.style.opacity = 0;
  inputFile.addEventListener("change", showTextDisplay);
  function showTextDisplay() {
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    let curFiles = inputFile.files;
    if (curFiles.length === 0) {
      let para = document.createElement("p");
      para.textContent = "No files currently selected for upload";
      preview.appendChild(para);
    } else {
      let list = document.createElement("ol");
      preview.appendChild(list);
      for (var i = 0; i < curFiles.length; i++) {
        let listItem = document.createElement("div");
        //let para = document.createElement("p");
        if (validFileType(curFiles[i])) {
          let textFile = document.createElement("p");
          const fileName = curFiles[i].name;
          //para.textContent = "File name " + curFiles[i].name + ".";
          let reader = new FileReader();
          reader.readAsText(curFiles[i]);
          reader.onload = function() {
            textFile.innerText = `File name:  ${fileName}. 
              ${reader.result}`;
          };

          //listItem.appendChild(para);
          listItem.appendChild(textFile);
        } else {
          para.textContent =
            "File name " +
            curFiles[i].name +
            ": Not a valid file type. Update your selection.";
          listItem.appendChild(para);
        }

        list.appendChild(listItem);
      }
    }
  }

  const fileTypes = ["text/txt", "text/plain"];

  function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }

    return false;
  }

  draw.addEventListener(
    "click",
    function() {
      reader.readAsText(inputFile.files[0]);
    },
    false
  );
});

function download(text, filename) {
  let file = new Blob([text], { type: "text/plain" });
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
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
