const fileInput = document.getElementById('fileInput')
const cropButton = document.getElementById('cropButton')
const statusText = document.getElementById('statusText')
const previewImage = document.getElementById('previewImage')
const previewPlaceholder = document.getElementById('previewPlaceholder')

let images = []

fileInput.addEventListener('change', () => {
  const files = Array.from(fileInput.files)

  const imageFiles = files.filter((file) => file.type.startsWith('image/'))

  images = imageFiles.map((file) => {
    return {
      file,
      url: URL.createObjectURL(file),
    }
  })

  if (images.length > 0) {
    showPreview(images[0])
    statusText.textContent = `Loaded ${images.length} image(s)`
    cropButton.disabled = false
  } else {
    clearPreview()
    statusText.textContent = 'No images selected'
    cropButton.disabled = true
  }
})

function showPreview(image) {
  previewImage.src = image.url
  previewImage.style.display = 'block'
  previewPlaceholder.style.display = 'none'
}

function clearPreview() {
  previewImage.src = ''
  previewImage.style.display = 'none'
  previewPlaceholder.style.display = 'block'
}

cropButton.addEventListener('click', () => {
  alert('Crop feature is not implemented yet')
})
