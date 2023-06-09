createTextInput() {
  this.app.view.removeEventListener('click', this.placeTextInput);
  this.app.view.addEventListener('click', this.placeTextInput);
},
placeTextInput(event) {
  const mouseX = event.clientX - this.$refs.pixiCanvas.getBoundingClientRect().left;
  const mouseY = event.clientY - this.$refs.pixiCanvas.getBoundingClientRect().top;

  const textInput = document.createElement('textarea');
  textInput.style.position = 'absolute';
  textInput.style.left = `${mouseX}px`;
  textInput.style.top = `${mouseY}px`;
  textInput.style.resize = 'none'; // Turn off resizing for text inputs by user interaction
  textInput.style.overflow = 'hidden'; // hiden overflow

  const fontStyleSelect = document.createElement('select');
  fontStyleSelect.innerHTML = this.fonts.map(font => `<option value="${font}">${font}</option>`).join('');
  fontStyleSelect.addEventListener('change', () => {
    this.applyStyleToTextInput(textInput);
  });

  const colorSelect = document.createElement('input');
  colorSelect.type = 'color';
  colorSelect.id = 'color-select-' + this.textInputs.length; // Generate unique ID for each color select
  colorSelect.addEventListener('change', () => {
    this.applyStyleToTextInput(textInput, colorSelect.value);
  });

  const fontSizeSelect = document.createElement('select');
  fontSizeSelect.innerHTML = ['8px', '12px', '16px', '20px', '24px'].map(size => `<option value="${size}">${size}</option>`).join('');
  fontSizeSelect.id = 'font-size-select-' + this.textInputs.length; // Generate unique ID for each font size select
  fontSizeSelect.addEventListener('change', () => {
    this.applyStyleToTextInput(textInput, null, fontSizeSelect.value);
  });

  const boldButton = document.createElement('button');
  boldButton.innerHTML = 'Gras (Ctrl + B)';
  boldButton.addEventListener('click', () => {
    this.toggleBoldStyle(textInput);
  });

  const styleOptionsContainer = document.createElement('div');
  styleOptionsContainer.appendChild(fontStyleSelect);
  styleOptionsContainer.appendChild(colorSelect);
  styleOptionsContainer.appendChild(fontSizeSelect);
  styleOptionsContainer.appendChild(boldButton);

  const container = document.createElement('div');
  container.appendChild(styleOptionsContainer);
  container.appendChild(textInput);

  document.body.appendChild(container);

  textInput.addEventListener('input', (event) => {
    this.resizeTextInput(textInput);
  });

  textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const currentCursorPosition = textInput.selectionStart;
      const textBeforeCursor = textInput.value.substring(0, currentCursorPosition);
      const textAfterCursor = textInput.value.substring(textInput.selectionEnd);
      textInput.value = textBeforeCursor + '\n' + textAfterCursor;
      textInput.setSelectionRange(currentCursorPosition + 1, currentCursorPosition + 1);
      this.resizeTextInput(textInput);
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      setTimeout(() => {
        if (textInput.value === '') {
          container.remove();
          const index = this.textInputs.indexOf(textInput);
          if (index !== -1) {
            this.textInputs.splice(index, 1);
          }
        }
      }, 0);
    }
  });

  this.resizeTextInput(textInput);

  this.textInputs.push(textInput);
},
resizeTextInput(textInput) {
  textInput.style.height = 'auto';
  textInput.style.width = 'auto';

  const minHeight = 20;  
  const minWidth = 100; 

  const scrollHeight = textInput.scrollHeight;
  const scrollWidth = textInput.scrollWidth;

  textInput.style.height = `${Math.max(scrollHeight, minHeight)}px`;
  textInput.style.width = `${Math.max(scrollWidth, minWidth)}px`;
},
applyStyleToTextInput(textInput, colorValue = null, fontSizeValue = null) {
  const selectedFont = textInput.parentNode.querySelector('select').value;
  const isBold = textInput.style.fontWeight === 'bold';

  textInput.style.fontFamily = selectedFont;
  textInput.style.fontWeight = isBold ? 'bold' : 'normal';

  if (colorValue) {
    textInput.style.color = colorValue;
  }

  if (fontSizeValue) {
    textInput.style.fontSize = fontSizeValue;
  }
},
toggleBoldStyle(textInput) {
  if (textInput.style.fontWeight === 'bold') {
    textInput.style.fontWeight = 'normal';
  } else {
    textInput.style.fontWeight = 'bold';
  }
}
}