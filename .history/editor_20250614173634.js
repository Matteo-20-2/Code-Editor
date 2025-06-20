

ace.require("ace/ext/language_tools");
let editor = ace.edit("editor", {
  mode: "ace/mode/python",
  theme: "ace/theme/monokai",
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true
});

editor.setTheme("ace/theme/monokai");

let hasUnsavedChanges = false;

editor.setOptions({
  fontSize: "14px",
  fontFamily: "monospace"
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
  
});

let fontSize = 14; 
let tabs = [];
let currentTab = null;

window.addEventListener("wheel", function (e) {
  if (e.ctrlKey) {
    e.preventDefault(); 
    if (e.deltaY < 0) {
      fontSize = Math.min(fontSize + 1, 40);
    } else {
      fontSize = Math.max(fontSize - 1, 8);  
    }

    editor.setFontSize(fontSize);
  }
}, { passive: false });



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
      const content = reader.result;

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

      const extToLang = {
        py: "python",
        html: "html",
        c: "c",
        cpp: "cpp"
      };

      const lang = extToLang[ext] || "text";
      const mode = extToMode[ext] || "text";

      // Crea un nuovo tab con il contenuto letto
      const session = ace.createEditSession(content, `ace/mode/${mode}`);
      const tab = {
        name: file.name,
        lang: lang,
        session: session
      };

      tabs.push(tab);
      setActiveTab(tab);
      renderTabs();

      // aggiorna anche la select
      document.getElementById("lang").value = lang;
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  input.click();
}



function openSaveAsModal() {
  document.getElementById("fileNameInput").value = "";
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

function createNewTab(name = "Untitled", lang = "python") {
  const session = ace.createEditSession("", `ace/mode/${lang}`);
  const tab = { name, lang, session };

  tabs.push(tab);
  setActiveTab(tab);
  renderTabs();
}

function renderTabs() {
  const tabsContainer = document.getElementById("tabs");
  tabsContainer.innerHTML = "";

  tabs.forEach((tab, index) => {
    const tabButton = document.createElement("button");
    tabButton.className = "tab-button";
    tabButton.textContent = tab.name;

    if (tab === activeTab) {
      tabButton.classList.add("active");
    }

    tabButton.onclick = () => {
      setActiveTab(tab);
    };

    // Crea il pulsante X
    const closeBtn = document.createElement("span");
    closeBtn.textContent = " ❌";
    closeBtn.className = "close-tab";
    closeBtn.onclick = (e) => {
      e.stopPropagation(); // evita che venga attivata anche la selezione della tab
      closeTab(index);
    };

    tabButton.appendChild(closeBtn);
    tabsContainer.appendChild(tabButton);
  });
}


function setActiveTab(tab) {
  currentTab = tab;
  editor.setSession(tab.session);
  document.getElementById("lang").value = tab.lang;
}

document.getElementById("lang").addEventListener("change", function () {
  const selectedLang = this.value;
  if (currentTab) {
    currentTab.lang = selectedLang;
    const modeMap = {
      python: "python",
      html: "html",
      c: "c_cpp",
      cpp: "c_cpp"
    };
    const mode = modeMap[selectedLang] || "text";
    currentTab.session.setMode(`ace/mode/${mode}`);
  }
});

function closeTab(){
  currentTab

}

 
createNewTab("Untitled.py", "python");

