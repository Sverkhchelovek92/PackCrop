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

// let isResizing = false

let resizeMode = null

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

  const scaleX = previewCanvas.width / rect.width
  const scaleY = previewCanvas.height / rect.height

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}

// Resizing Logic

previewCanvas.addEventListener('mousedown', (e) => {
  const mouse = getMousePos(e)

  const nearTop =
    mouse.y >= cropRect.y - HANDLE_SIZE &&
    mouse.y <= cropRect.y + HANDLE_SIZE &&
    mouse.x >= cropRect.x &&
    mouse.x <= cropRect.x + cropRect.width

  const nearBottom =
    mouse.y >= cropRect.y + cropRect.height - HANDLE_SIZE &&
    mouse.y <= cropRect.y + cropRect.height + HANDLE_SIZE &&
    mouse.x >= cropRect.x &&
    mouse.x <= cropRect.x + cropRect.width

  const nearLeft =
    mouse.x >= cropRect.x - HANDLE_SIZE &&
    mouse.x <= cropRect.x + HANDLE_SIZE &&
    mouse.y >= cropRect.y &&
    mouse.y <= cropRect.y + cropRect.height

  const nearRight =
    mouse.x >= cropRect.x + cropRect.width - HANDLE_SIZE &&
    mouse.x <= cropRect.x + cropRect.width + HANDLE_SIZE &&
    mouse.y >= cropRect.y &&
    mouse.y <= cropRect.y + cropRect.height

  if (nearTop) resizeMode = 'top'
  else if (nearBottom) resizeMode = 'bottom'
  else if (nearLeft) resizeMode = 'left'
  else if (nearRight) resizeMode = 'right'
})

previewCanvas.addEventListener('mousemove', (e) => {
  // if (!isResizing) return

  const mouse = getMousePos(e)

  previewCanvas.style.cursor = 'default'

  const nearTop =
    mouse.y >= cropRect.y - HANDLE_SIZE &&
    mouse.y <= cropRect.y + HANDLE_SIZE &&
    mouse.x >= cropRect.x &&
    mouse.x <= cropRect.x + cropRect.width

  const nearBottom =
    mouse.y >= cropRect.y + cropRect.height - HANDLE_SIZE &&
    mouse.y <= cropRect.y + cropRect.height + HANDLE_SIZE &&
    mouse.x >= cropRect.x &&
    mouse.x <= cropRect.x + cropRect.width

  const nearLeft =
    mouse.x >= cropRect.x - HANDLE_SIZE &&
    mouse.x <= cropRect.x + HANDLE_SIZE &&
    mouse.y >= cropRect.y &&
    mouse.y <= cropRect.y + cropRect.height

  const nearRight =
    mouse.x >= cropRect.x + cropRect.width - HANDLE_SIZE &&
    mouse.x <= cropRect.x + cropRect.width + HANDLE_SIZE &&
    mouse.y >= cropRect.y &&
    mouse.y <= cropRect.y + cropRect.height

  if (nearTop || nearBottom) {
    previewCanvas.style.cursor = 'ns-resize'
  } else if (nearLeft || nearRight) {
    previewCanvas.style.cursor = 'ew-resize'
  }

  if (!resizeMode) return

  if (resizeMode === 'top') {
    const newY = Math.max(
      0,
      Math.min(mouse.y, cropRect.y + cropRect.height - MIN_SIZE),
    )
    cropRect.height += cropRect.y - newY
    cropRect.y = newY
  }

  if (resizeMode === 'bottom') {
    const newHeight = Math.min(
      previewCanvas.height - cropRect.y,
      Math.max(MIN_SIZE, mouse.y - cropRect.y),
    )
    cropRect.height = newHeight
  }

  if (resizeMode === 'left') {
    const newX = Math.max(
      0,
      Math.min(mouse.x, cropRect.x + cropRect.width - MIN_SIZE),
    )
    cropRect.width += cropRect.x - newX
    cropRect.x = newX
  }

  if (resizeMode === 'right') {
    const newWidth = Math.min(
      previewCanvas.width - cropRect.x,
      Math.max(MIN_SIZE, mouse.x - cropRect.x),
    )
    cropRect.width = newWidth
  }

  draw()
})

previewCanvas.addEventListener('mouseup', (e) => {
  resizeMode = null
})

previewCanvas.addEventListener('mouseleave', (e) => {
  resizeMode = null
})

cropButton.addEventListener('click', async () => {
  if (!images.length) return

  for (const item of images) {
    const { img, file } = item

    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')

    tempCanvas.width = cropRect.width
    tempCanvas.height = cropRect.height

    tempCtx.drawImage(
      img,
      cropRect.x,
      cropRect.y,
      cropRect.width,
      cropRect.height,
      0,
      0,
      cropRect.width,
      cropRect.height,
    )

    const blob = await new Promise((resolve) =>
      tempCanvas.toBlob(resolve, 'image/png'),
    )

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `cropped_${file.name}`
    link.click()
  }

  statusText.textContent = `Cropped ${images.length} image(s)`
})
