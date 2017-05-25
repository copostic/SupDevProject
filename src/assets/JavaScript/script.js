//MISE EN PLACE DU GAME ENGINE

const jge = {};


jge.GameInstance = class {
    constructor(resolution) {

        this.renderer = new jge.Renderer(resolution);

        this.interns = {
            oldFrame: Date.now(),
            currentFrame: Date.now(),
            stepFrame: 0
        };
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
        this.canvas.oncontextmenu = function () {
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

    changeColor(color) {
        this.color = color;
    }

    rotateTurtle(angle) {
        angle -= 90;
        this.rotate += angle;
    }

    setVisibility(status) {
        this.visible = status;
    }

    setTraceVisibility(status) {
        this.trace = status;
    }
};

const input = document.querySelector('input');
const historyDiv = document.querySelector('div.history');

const largeurEcran = window.innerWidth;
const hauteurEcran = window.innerHeight;
const turtle = new jge.Texture({
    src: 'assets/img/img.png',
    width: 16,
    height: 16,
    x: largeurEcran / 2,
    y: ((hauteurEcran / 2) - 50),
});


//GESTION DES COMMANDES ENTREES PAR L'UTILISATEUR ET DE L'HISTORIQUE
const history = [];
const commands = {
    'AV': function (args) {

        if (args.length === 2) {
            const distance = Number(args[1]);
            turtle.translate.x = Math.cos(turtle.rotate * (Math.PI / 180)) * distance;
            turtle.translate.y = Math.sin(turtle.rotate * (Math.PI / 180)) * distance;
        } else {
            console.log('error');
        }
        console.log('AV command executée');
    },
    'RE': function (args) {

        if (args.length === 2) {
            const distance = Number(args[1]);

            turtle.translate.x = Math.cos(turtle.rotate * (Math.PI / -180)) * distance; // Il faut trouver le bon nombre à la place de 111
            turtle.translate.y = Math.sin(turtle.rotate * (Math.PI / -180)) * distance;
        } else {
            console.log('error');
        }
        console.log('RE command executée');
    },
    'FCC': function (args) {

        if (args.length === 2) {
            const colortoset = args[1];
            if ((colortoset.length === 7) && (colortoset !== "#ffffff")) {
                console.log(colortoset);
                turtle.changeColor(colortoset);
            }
        }

        console.log('FCC command executée');
    },

    'LC': function (args) {

        if (args.length === 1) {
            turtle.setTraceVisibility(false);
        }

        console.log('LC command executée');
    },

    'BC': function (args) {

        if (args.length === 1) {
            turtle.setTraceVisibility(true);
        }

        console.log('BC command executée');
    },

    'TG': function (args) {

        if (args.length === 2) {
            const angle = args[1];
            angletoset = '+' + angle;
            turtle.rotateTurtle(angletoset);
        }

        console.log('TG command executée');
    },

    'TD': function (args) {

        if (args.length === 2) {
            const angle = args[1];
            angletoset = '-' + angle;
            turtle.rotateTurtle(angletoset);
        }

        console.log('TD command executée');
    },

    'CT': function (args) {

        if (args.length === 1) {
            turtle.setVisibility(false);
        }

        console.log('CT command executée');
    },

    'MT': function (args) {

        if (args.length === 1) {
            turtle.setVisibility(true);
        }

        console.log('MT command executée');
    },

    'VE': function (args) {

        if (args.length === 1) {
            location.reload();
        }

        console.log('VE command executée');
    },

    'REPETE': function (args) {
        console.log('REPETE command executée');
    }

}


input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter')
        return;

    const textInput = document.querySelector('input').value;
    input.value = '';

    const words = textInput.split(' ');

    const command = words[0];

    history.push(command);

    if (command in commands) {
        if (command === 'REPETE') {

            var re = /\[(.*?)\]/;
            var matches = textInput.match(re);
            var submatch = matches[1];
            loopQty = words[1];
            const arguments = submatch.split(' ');
            functionName = arguments[0];
            i = 0;
            while (i < loopQty) {
                commands[functionName](arguments);
                turtle.updatePosition();
                turtle.drawLineTranslate(back_instance.renderer);
                turtle.render(front_instance.renderer);
                i++;
            }
        }
        commands[command](words);

    } else {
        console.log('Commande inconnue!');
    }

    historyDiv.innerHTML += `<p class="command">${textInput}</p>`;

    var objDiv = document.getElementsByClassName("history");
    objDiv[0].scrollTop = objDiv[0].scrollHeight;
})




// instance pour les lignes
const back_instance = new jge.GameInstance({
    width: largeurEcran,
    height: hauteurEcran
});

// instance pour la tortue
const front_instance = new jge.GameInstance({
    width: largeurEcran,
    height: hauteurEcran
});


turtle.render(front_instance.renderer);

// desactive la trace de la tortue
turtle.trace = true;

requestAnimationFrame(loop);

function loop() {
    requestAnimationFrame(loop); // boucle 60fps

    front_instance.renderer.clear();

    turtle.updatePosition();
    turtle.drawLineTranslate(back_instance.renderer);
    turtle.render(front_instance.renderer);


};