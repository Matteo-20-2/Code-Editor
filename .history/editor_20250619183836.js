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
    cpp: "c_cpp",
    
    text: "text",
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
        cpp: "cpp",
        txt: "text"
      };

      const lang = extToLang[ext] || "text";
      const mode = extToMode[ext] || "text";

      const session = ace.createEditSession(content, `ace/mode/${mode}`);
      const tab = {
        name: file.name,
        lang: lang,
        session: session
      };

      tabs.push(tab);
      setActiveTab(tab);
      renderTabs();

      // Update the language selector
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
    alert("Please enter a valid file name.");
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
    cpp: "cpp",
    text: "txt"
  };

  const ext = extensions[lang] || "txt";
  const filename = customName + "." + ext;

  if(currentTab){
    currentTab.name = filename;
    renderTabs();
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function createNewTab(name = "Untitled.py", lang = "python") {
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

    if (tab === currentTab) {
      tabButton.classList.add("active");
    }

    tabButton.onclick = () => {
      setActiveTab(tab);
    };

    const closeBtn = document.createElement("span");
    closeBtn.textContent = " ❌";
    closeBtn.className = "close-tab";
    closeBtn.onclick = (e) => {
      e.stopPropagation(); 
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
      cpp: "c_cpp",
      text: "text"
    };
    const mode = modeMap[selectedLang] || "text";
    currentTab.session.setMode(`ace/mode/${mode}`);
  }
});

function closeTab(index) {
  tabs.splice(index, 1);
  if (tabs.length > 0) {
    setActiveTab(tabs[tabs.length - 1]); 
    editor.setValue("");
    currentTab = null;
  }
  renderTabs();
}

createNewTab();


