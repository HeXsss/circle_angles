class Game {
  // Screen
  #screen = null
  #ctx = null
  // Properties
  #radius = null
  // Input data
  #user = null
  #cursor = null
  #circlePoints = []
  constructor({ radius = 200 } = { radius: 200 }) {
    this.#screen = document.querySelector("canvas")
    this.#ctx = this.#screen.getContext("2d")
    this.#radius = radius || this.#radius
    this.#frame()
    window.addEventListener("mousemove", this.#mouseMoveHandler.bind(this))
    window.addEventListener("touchmove", this.#mouseMoveHandler.bind(this))
    window.addEventListener("touchend", this.#mouseLeaveHandler.bind(this))
    window.addEventListener("mouseleave", this.#mouseLeaveHandler.bind(this))
    window.addEventListener("mouseout", this.#mouseLeaveHandler.bind(this))
  }
  #mouseMoveHandler(e) {
    const { pageX: x, pageY: y } = e
    const { width, height } = this.#screen
    const S = {
      Sx: width / 2,
      Sy: height / 2
    }
    const { Sx, Sy } = S
    // d + r calculations
    const xDiff = -1 * (Sx - x)
    const yDiff = Sy - y
    const d = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
    const b = -1 * (yDiff / d) * this.#radius
    const a = (xDiff / d) * this.#radius
    this.#user = {
      x: Sx + a,
      y: Sy + b
    }
    this.#cursor = { x, y }
  }
  #mouseLeaveHandler(e) {
    this.#user = null
    this.#cursor = null
  }
  #drawCircle(ctx, Sx, Sy, radius) {
    ctx.beginPath()
    for (let i = 0; i < 360; i++) {
      const x = Sx + radius * Math.cos((i * Math.PI) / 180)
      const y = Sy + radius * Math.sin((i * Math.PI) / 180)
      ctx.lineTo(x, y)
      this.#circlePoints.push({ Px: x, Py: y })
    }
    ctx.fill()
  }
  #frame() {
    this.#screen.width = window.innerWidth
    this.#screen.height = window.innerHeight
    const { width, height } = this.#screen
    const S = {
      Sx: width / 2,
      Sy: height / 2
    }
    const { Sx, Sy } = S
    // Rendering circle
    this.#ctx.fillStyle = "#009b48"
    this.#drawCircle(this.#ctx, Sx, Sy, this.#radius)
    this.#ctx.fillStyle = "#ffffd4"
    this.#drawCircle(this.#ctx, Sx, Sy, 10)
    // Rendering math data if given
    if (this.#user) {
      // Basic line from center to cursor position (x,y)
      const { x, y } = this.#user
      this.#ctx.fillStyle = "#ffffd4"
      this.#ctx.strokeStyle = "#ffffd4"
      this.#drawCircle(this.#ctx, x, y, 10)
      this.#ctx.lineWidth = 5
      this.#ctx.beginPath()
      this.#ctx.moveTo(Sx, Sy)
      this.#ctx.lineTo(x, y)
      this.#ctx.stroke()

      const anglePoint = {
        x: x,
        y: Sy
      }
      this.#drawCircle(this.#ctx, anglePoint.x, anglePoint.y, 10)
      this.#ctx.beginPath()
      this.#ctx.moveTo(anglePoint.x, anglePoint.y)
      this.#ctx.lineTo(x, y)
      this.#ctx.stroke()
      this.#ctx.beginPath()
      this.#ctx.moveTo(anglePoint.x, anglePoint.y)
      this.#ctx.lineTo(Sx, Sy)
      this.#ctx.stroke()
      // Text rendering
      this.#ctx.font = "15px serif"
      this.#ctx.fillText(
        `a=${Math.round(Math.abs(Sx - x))}`,
        (x + Sx) / 2,
        Sy + 20 * -1 * (Sy - y > 0 ? -1 : 1)
      )
      this.#ctx.fillText(
        `b=${Math.round(Math.abs(Sy - y))}`,
        x + 10 * -1 * (Sx - x > 0 ? 5 : -1),
        (y + Sy) / 2
      )
    }
    // Cursor rendering
    if (this.#cursor) {
      this.#ctx.fillStyle = "#16f04c"
      this.#drawCircle(this.#ctx, this.#cursor.x, this.#cursor.y, 10)
    }

    requestAnimationFrame(this.#frame.bind(this))
  }
}

const game = new Game({ radius: 200 })
