const { ipcRenderer } = require('electron');
const form = {
  encryptBtn: document.querySelector('#encrypt'),
  decryptBtn: document.querySelector('#decrypt'),
  file: document.querySelector('#file'),
  fileText: document.querySelector('#file-text'),
  key: document.querySelector('#key'),
  overlay: document.querySelector('.overlay'),
};

function isFileSelected() {
  if (!form.file.files || !form.file.files[0]) return false;

  if (form.file.files[0].type != '') return true;

  form.file.value = '';
  return false;
}

function setFileText() {
  if (isFileSelected()) {
    form.fileText.innerText = form.file.files[0].name;
  } else {
    form.fileText.innerHTML = 'Выбрать файл';
  }
}

function overlayVisible(val) {
  form.overlay.style.display = val ? 'flex' : 'none';
  form.encryptBtn.disabled = val;
  form.decryptBtn.disabled = val;
  form.key.disabled = val;
  form.file.disabled = val;
}

function sendFile(operation) {
  if (!isFileSelected()) {
    alert('Выберите файл');
    return;
  }

  const { path } = form.file.files[0];
  const key = form.key.value;

  overlayVisible(true);
  ipcRenderer.send(`file:${operation}`, { path, key });
}

form.file.addEventListener('change', setFileText);

form.encryptBtn.addEventListener('click', () => sendFile('encrypt'));
form.decryptBtn.addEventListener('click', () => sendFile('decrypt'));

ipcRenderer.on('file:done', e => {
  overlayVisible(false);
  form.file.value = '';
  setFileText();
});

ipcRenderer.on('file:cancel', e => {
  overlayVisible(false);
});
ipcRenderer.on('file:error', (e, err) => {
  alert('Ошибка. Что-то пошло не так');
  overlayVisible(false);
  form.file.value = '';
  setFileText();
  console.log(err);
});

setFileText();
