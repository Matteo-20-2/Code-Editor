let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/text");

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

// Funzione per salvare il contenuto su file
function saveFile() {
  const content = editor.getValue();
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "file.txt"; // nome file di default
  a.click();

  URL.revokeObjectURL(url); // libera la memoria
}
  document.getElementById("lang").addEventListener("change")

