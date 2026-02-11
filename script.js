const fileInput = document.getElementById('fileInput')
const cropButton = document.getElementById('cropButton')
const statusText = document.getElementById('statusText')

fileInput.addEventListener('change', () => {
  const files = fileInput.files

  if (files.length > 0) {
    statusText.textContent = `${files.length} file(s) selected`
    cropButton.disabled = false
  } else {
    statusText.textContent = 'Ready'
    cropButton.disabled = true
  }
})

cropButton.addEventListener('click', () => {
  alert('Crop feature is not implemented yet')
})
