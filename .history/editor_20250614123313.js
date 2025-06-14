let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");

document.getElementById("lang").addEventListener("change",)


function changeSintax(){

  let selectedLang = this.value;
    const modes = {
    python: "python",
    html: "html",
    c: "c_cpp",
    cpp: "c_cpp"
  };

  const mode = modes[selectedLang] || "text";
  editor.session.setMode(`ace/mode/${mode}`);
 

}
 
// Funzione per aprire un file locale
function loadFile() {
  const input = document.createElement("input");
  input.type = "file";

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      editor.setValue(reader.result, -1); // -1: nessuno scroll
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  input.click(); // simula il click sul file picker
}


function openSaveAsModal() {
  document.getElementById("fileNameInput").value = ""; // reset input
  document.getElementById("saveModal").style.display = "block";
}

function closeModal() {
  document.getElementById("saveModal").style.display = "none";
}

function confirmSave() {
  const inputName = document.getElementById("fileNameInput").value.trim();

  if (!inputName) {
    alert("Inserisci un nome valido per il file.");
    return;
  }

  closeModal(); // chiudi la finestra
  saveFile(inputName); // usa direttamente la funzione saveFile
}

function saveFile(customName) {
  const content = editor.getValue();
  const lang = document.getElementById("lang").value;

  const extensions = {
    python: "py",
    html: "html",
    c: "c",
    cpp: "cpp"
  };

  const ext = extensions[lang] || "txt";
  const filename = customName + "." + ext;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}


 

