document.addEventListener("DOMContentLoaded", function () {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/python");
});

function loadFile(){
  const input = document.createElement("input");
  input.type = "file";

  input.onchange = e => {
    editor.setValue(reader.result, -1);
  };
}

