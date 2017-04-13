const jge = {};


jge.GameInstance = class {
    constructor(resolution) {

        this.renderer = new jge.Renderer(resolution);

        this.interns = {
            oldFrame: Date.now(),
            currentFrame: Date.now(),
            stepFrame: 0
        };

        console.log('A %cGame Instance%c of %cjge.js for canvas%c has been created;',
            'color: red',
            'color: black',
            'color: red',
            'color: black');
    }

    updateDelta() {

        this.interns.stepFrame = this.interns.oldFrame;
        this.interns.oldFrame = Date.now();

        this.delta = (this.interns.oldFrame - this.interns.stepFrame) / 1000;
    }
};


jge.Renderer = class Renderer {
    constructor(res) {

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        // disable right click context menu
        this.canvas.oncontextmenu = function() {
            return false;
        };

        this.resolution = res;

        document.body.appendChild(this.canvas);
    }

    get resolution() {

        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    set resolution(res) {

        this.canvas.width = res.width || window.innerWidth;
        this.canvas.height = res.height || window.innerHeight;
    }

    clear() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};


jge.Texture = class Texture {
    constructor(option) {

        if (option.src) {
            this.img = new Image();
            this.img.src = option.src;
        }

        this.width = option.width;
        this.height = option.height;

        this.position = {
            x: option.x || 0,
            y: option.y || 0
        };

        this.oldPosition = {
            x: 0,
            y: 0
        }

        this.translate = {
            x: 0,
            y: 0
        }

        this.rotate = -90;

        this.visible = true;
        this.trace = true;

        this.color = option.color || '#000000';
    }

    updatePosition() {
        this.oldPosition.x = this.position.x;
        this.oldPosition.y = this.position.y;

        this.position.x += this.translate.x;
        this.position.y += this.translate.y;

        this.translate.x = 0;
        this.translate.y = 0;
    }

    drawLineTranslate(renderer) {
        if (!this.trace)
            return;

        renderer.context.strokeStyle = this.color;
        renderer.context.beginPath();
        renderer.context.moveTo(this.oldPosition.x, this.oldPosition.y);
        renderer.context.lineTo(this.position.x, this.position.y);
        renderer.context.stroke();
    }

    render(renderer) {
        if (!this.visible)
            return;

        renderer.context.save();
        renderer.context.translate(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width);
        renderer.context.rotate(this.rotate * (Math.PI / 180));
        renderer.context.drawImage(this.img, 0, 0, this.width, this.height);
        renderer.context.restore();

        return;
    }

    renderBoundingBox(renderer, camera) {

        renderer.context.strokeStyle = '#409640';
        renderer.context.strokeRect(this.position.x - this.box.width / 2, this.position.y - this.box.height / 2, this.box.width, this.box.height);
    }
};


//module.exports = jge;