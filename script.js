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

fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files)

  const imageFiles = files.filter((file) => file.type.startsWith('image/'))

  images = []

  for (const file of imageFiles) {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await img.decode()

    images.push({ file, url, img })
  }

  // images = imageFiles.map((file) => {
  //   return {
  //     file,
  //     url: URL.createObjectURL(file),
  //   }
  // })

  if (images.length > 0) {
    currentImage = images[0]
    setupCanvasForImage(currentImage.img)
    statusText.textContent = `Loaded ${images.length} image(s)`
    cropButton.disabled = false
  } else {
    clearPreview()
    statusText.textContent = 'No images selected'
    cropButton.disabled = true
  }
})

function setupCanvasForImage(img) {
  previewCanvas.width = img.width
  previewCanvas.height = img.height

  cropRect.width = Math.floor(img.width * 0.6)
  cropRect.height = Math.floor(img.height * 0.6)
  cropRect.x = Math.floor((img.width - cropRect.width) / 2)
  cropRect.y = Math.floor((img.height - cropRect.height) / 2)

  previewCanvas.style.display = 'block'
  previewPlaceholder.style.display = 'none'

  draw()
}

function draw() {
  if (!currentImage) return

  const img = currentImage.img

  ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)

  ctx.drawImage(img, 0, 0)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height)

  ctx.clearRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height)

  ctx.strokeStyle = '#4f5dff'
  ctx.lineWidth = 3
  ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height)
}

// function showPreview(image) {
//   previewImage.src = image.url
//   previewImage.style.display = 'block'
//   previewPlaceholder.style.display = 'none'
// }

function clearPreview() {
  ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
  previewImage.style.display = 'none'
  previewPlaceholder.style.display = 'block'
  currentImage = null
}

cropButton.addEventListener('click', () => {
  alert('Crop feature is not implemented yet')
})
