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

let isDragging = false
let isResizing = false

let dragOffsetX = 0
let dragOffsetY = 0

const HANDLE_SIZE = 12
const MIN_SIZE = 50

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

  ctx.fillStyle = '#4f5dff'
  ctx.fillRect(
    cropRect.x + cropRect.width - HANDLE_SIZE,
    cropRect.y + cropRect.height - HANDLE_SIZE,
    HANDLE_SIZE,
    HANDLE_SIZE,
  )
}

function clearPreview() {
  ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
  previewCanvas.style.display = 'none'
  previewPlaceholder.style.display = 'block'
  currentImage = null
}

function getMousePos(event) {
  const rect = previewCanvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

// Dragging Logic

previewCanvas.addEventListener('mousedown', (e) => {
  const mouse = getMousePos(e)

  const onHandle =
    mouse.x >= cropRect.x + cropRect.width - HANDLE_SIZE &&
    mouse.x <= cropRect.x + cropRect.width &&
    mouse.y >= cropRect.y + cropRect.height - HANDLE_SIZE &&
    mouse.y <= cropRect.y + cropRect.height

  if (onHandle) {
    isResizing = true
    return
  }

  const inside =
    mouse.x >= cropRect.x &&
    mouse.x <= cropRect.x + cropRect.width &&
    mouse.y >= cropRect.y &&
    mouse.y <= cropRect.y + cropRect.height

  if (inside) {
    isDragging = true
    dragOffsetX = mouse.x - cropRect.x
    dragOffsetY = mouse.y - cropRect.y
  }
})

previewCanvas.addEventListener('mousemove', (e) => {
  const mouse = getMousePos(e)

  if (isResizing) {
    cropRect.width = mouse.x - cropRect.x
    cropRect.height = mouse.y - cropRect.y

    cropRect.width = Math.max(MIN_SIZE, cropRect.width)
    cropRect.height = Math.max(MIN_SIZE, cropRect.height)

    cropRect.width = Math.min(cropRect.width, previewCanvas.width - cropRect.x)
    cropRect.height = Math.min(
      cropRect.height,
      previewCanvas.height - cropRect.y,
    )

    draw()
  } else if (isDragging) {
    cropRect.x = mouse.x - dragOffsetX
    cropRect.y = mouse.y - dragOffsetY

    cropRect.x = Math.max(
      0,
      Math.min(cropRect.x, previewCanvas.width - cropRect.width),
    )
    cropRect.y = Math.max(
      0,
      Math.min(cropRect.y, previewCanvas.height - cropRect.height),
    )

    draw()
  }
})

previewCanvas.addEventListener('mouseup', (e) => {
  isDragging = false
  isResizing = false
})

previewCanvas.addEventListener('mouseleave', (e) => {
  isDragging = false
  isResizing = false
})

cropButton.addEventListener('click', () => {
  alert('Crop feature is not implemented yet')
})
