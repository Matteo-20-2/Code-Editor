let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");

 document.getElementById("lang").addEventListener("change", function(){
  let selectedLang = this.value;
    const modes = {
    python: "python",
    html: "html",
    c: "c_cpp",
    cpp: "c_cpp"
  };
  
  editor.session.setMode( `ace/mode/${selectedLang}`);
 });

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

  // 🔧 Ottieni il valore selezionato nel momento in cui premi "Salva"
  const lang = document.getElementById("lang").value;

  const extensions = {
    python: "py",
    html: "html",
    c: "c",
    cpp:"cpp"

  };

  const ext = extensions[lang] || "txt";
  const filename = "file." + ext;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url); // libera la memoria
}

 

