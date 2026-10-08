// Scratchpad.js - Interactive working canvas for calculations

export class Scratchpad {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.isDrawing = false;
    this.mode = 'pen'; // 'pen' | 'eraser'
    this.color = '#2f3542';
    this.lineWidth = 3;

    this.initCanvasSize();
    this.bindEvents();
  }

  initCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 400;
    this.canvas.height = rect.height || 140;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.clear();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const newW = Math.round(rect.width);
    const newH = Math.round(rect.height);
    if (newW > 0 && newH > 0 && (newW !== this.canvas.width || newH !== this.canvas.height)) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(this.canvas, 0, 0);

      this.canvas.width = newW;
      this.canvas.height = newH;
      this.clear();
      this.ctx.drawImage(tempCanvas, 0, 0);
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  }

  setMode(mode) {
    this.mode = mode;
  }

  clear() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  bindEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const start = (e) => {
      this.isDrawing = true;
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
      if (e.cancelable) e.preventDefault();
    };

    const draw = (e) => {
      if (!this.isDrawing) return;
      const pos = getPos(e);
      this.ctx.lineWidth = this.mode === 'eraser' ? 16 : 3;
      this.ctx.strokeStyle = this.mode === 'eraser' ? '#ffffff' : this.color;
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
      if (e.cancelable) e.preventDefault();
    };

    const stop = () => {
      this.isDrawing = false;
      this.ctx.closePath();
    };

    this.canvas.addEventListener('mousedown', start);
    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stop);

    this.canvas.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stop);
  }
}
