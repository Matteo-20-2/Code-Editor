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

const langToModeMap = {
  python: "python",
  html: "html",
  c: "c_cpp",
  cpp: "c_cpp",
  java: "java",
  text: "text",
  javascript: "javascript",
  json: "json"
};

const extToLang = {
  py: "python",
  html: "html",
  c: "c",
  cpp: "cpp",
  h: "c",
  js: "javascript",
  java: "java",
  txt: "text",
  json: "json"
};

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

let lastTouchDist = null;

function getTouchDistance(touches) {
  const [touch1, touch2] = touches;
  const dx = touch1.pageX - touch2.pageX;
  const dy = touch1.pageY - touch2.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

editor.container.addEventListener('touchstart', function(e) {
  if (e.touches.length === 2) {
    lastTouchDist = getTouchDistance(e.touches);
    e.preventDefault();
  }
}, { passive: false });

editor.container.addEventListener('touchmove', function(e) {
  if (e.touches.length === 2 && lastTouchDist !== null) {
    const newDist = getTouchDistance(e.touches);
    const zoomSensitivity = 0.1; // regola la velocità zoom

    if (newDist > lastTouchDist + 5) {
      // zoom in
      fontSize = Math.min(fontSize + zoomSensitivity, 40);
      editor.setFontSize(fontSize);
      lastTouchDist = newDist;
    } else if (newDist < lastTouchDist - 5) {
      // zoom out
      fontSize = Math.max(fontSize - zoomSensitivity, 8);
      editor.setFontSize(fontSize);
      lastTouchDist = newDist;
    }

    e.preventDefault();
  }
}, { passive: false });

editor.container.addEventListener('touchend', function(e) {
  if (e.touches.length < 2) {
    lastTouchDist = null;
  }
});


document.getElementById("lang").addEventListener("change", function () {
  const selectedLang = this.value;
  const mode = langToModeMap[selectedLang] || "text";
  const extensions = {
    python: "py",
    html: "html",
    c: "c",
    cpp: "cpp",
    java: "java",
    text: "txt",
    javascript: "js",
    json: "json"
  };

  if (currentTab) {
    currentTab.lang = selectedLang;
    currentTab.session.setMode(`ace/mode/${mode}`);

    if (currentTab.name.startsWith("Untitled")) {
      currentTab.name = `Untitled.${extensions[selectedLang] || "txt"}`;
      renderTabs();
    }
  } else {
    editor.session.setMode(`ace/mode/${mode}`);
  }
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

      const lang = extToLang[ext] || "text";
      const mode = langToModeMap[lang] || "text";

      const session = ace.createEditSession(content, `ace/mode/${mode}`);
      const tab = {
        name: file.name,
        lang: lang,
        session: session
      };

      tabs.push(tab);
      setActiveTab(tab);
      renderTabs();

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
    java: "java",
    text: "txt",
    javascript: "js",
    json: "json"
  };

  const ext = extensions[lang] || "txt";
  const filename = customName + "." + ext;

  if (currentTab) {
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
  const mode = langToModeMap[lang] || "text";
  const session = ace.createEditSession("", `ace/mode/${mode}`);
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

function closeTab(index) {
  tabs.splice(index, 1);
  if (tabs.length > 0) {
    setActiveTab(tabs[tabs.length - 1]);
  } else {
    editor.setValue("");
    currentTab = null;
  }
  renderTabs();
}

function saveAllFiles() {
  tabs.forEach(tab => {
    const content = tab.session.getValue();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = tab.name || "Untitled.txt";
    a.click();

    URL.revokeObjectURL(url);
  });
}


createNewTab();
