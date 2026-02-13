const fileInput = document.getElementById('fileInput')
const cropButton = document.getElementById('cropButton')
const statusText = document.getElementById('statusText')
const previewCanvas = document.getElementById('previewCanvas')
const previewPlaceholder = document.getElementById('previewPlaceholder')

const ctx = previewCanvas.getContext('2d')

let images = []
let currentImage = null

let cropRect = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
}

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
