let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
let hasUnsavedChanges = false;

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
    e.returnValue = '';
  
});


document.getElementById("lang").addEventListener("change", function(){
 let selectedLang = this.value;
  const modes = {
    python: "python",
    html: "html",
    c: "c_cpp",
    cpp: "c_cpp"
  };

  const mode = modes[selectedLang] || "text";
  editor.session.setMode(`ace/mode/${mode}`);
});

function loadFile() {
  const input = document.createElement("input");
  input.type = "file";

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      editor.setValue(reader.result, -1); 

      const ext = file.name.split('.').pop().toLowerCase();

      const extToMode = {
        py: "python",
        html: "html",
        c: "c_cpp",
        cpp: "c_cpp",
        h: "c_cpp",
        js: "javascript",
        java: "java",
        txt: "text"
      };

      const mode = extToMode[ext] || "text";
      editor.session.setMode(`ace/mode/${mode}`);

      // Imposta anche la select per mostrare la lingua corretta
      const extToLang = {
        py: "python",
        html: "html",
        c: "c",
        cpp: "cpp"
      };
      if(extToLang[ext]){
        document.getElementById("lang").value = extToLang[ext];
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  input.click();
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

  closeModal(); 
  saveFile(inputName);
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


 

