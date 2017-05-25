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


//Liste des commandes gérées et actions liées
const commands = {
    'AV': function (args) {
        if ((args.length === 2) && (isNumeric(args[1]))) {
            const distance = Math.abs(args[1]); //Valeur absolue de l'argument pour bloquer les valeurs négatives
            turtle.translate.x = Math.cos(turtle.rotate * (Math.PI / 180)) * distance;
            turtle.translate.y = Math.sin(turtle.rotate * (Math.PI / 180)) * distance;
        } else {
            console.log('error');
        }
        console.log('AV command executée');
    },
    'RE': function (args) {

        if ((args.length === 2) && (isNumeric(args[1]))) {
            const distance = Math.abs(args[1]); //Valeur absolue de l'argument pour bloquer les valeurs négatives
            turtle.translate.x = Math.cos(turtle.rotate * (Math.PI / -180)) * distance;
            turtle.translate.y = Math.sin(turtle.rotate * (Math.PI / -180)) * distance;
        } else {
            console.log('error');
        }
        console.log('RE command executée');
    },
    'FCC': function (args) {

        if (args.length === 2) {
            const colortoset = args[1];
            if (colortoset.length === 7 && colortoset.match(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i)) {
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

        if ((args.length === 2) && (isNumeric(args[1]))) {
            const angle = Math.abs(args[1]);
            angletoset = '+' + angle;
            turtle.rotateTurtle(angletoset);
        }

        console.log('TG command executée');
    },

    'TD': function (args) {

        if ((args.length === 2) && (isNumeric(args[1]))) {
            const angle = Math.abs(args[1]);
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
        var matches = textInput.match(/\[(.*?)\]/);
        var submatch = matches[1];
        loopQty = words[1];
        arguments = submatch.split(' ');
        functionName = arguments[0];
        if (arguments.length === 4) {
            doubleCommand = true;
            command1 = arguments[2];
            subwords = arguments.slice(2, 4); //Créé une seconde liste contenant la commande et sa valeur
            arguments = arguments.slice(0, 2); // Garde uniquement premiere commande / argument
        } else {
            doubleCommand = false;
        }
        i = 0;
        while (i < loopQty) {
            commands[functionName](arguments);
            if (doubleCommand) {
                commands[command1](subwords);
            }
            turtle.updatePosition();
            turtle.drawLineTranslate(back_instance.renderer);
            turtle.render(front_instance.renderer);
            i++;
        }
        console.log('REPETE command executée');
    }

}

//Evenement touche appuyée
input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter')
        return;

    textInput = document.querySelector('input').value.toUpperCase();
    input.value = '';

    words = textInput.split(' ');

    const command = words[0];


    if (words.length === 4) { //Si deux commandes
        doubleCommand = true;
        command1 = words[2];
        subwords = words.slice(2, 4); //Créé une seconde liste contenant la commande et sa valeur
        words = words.slice(0, 2); // Garde uniquement premiere commande / argument
    } else {
        doubleCommand = false;
    }

    if (command in commands) {
        commands[command](words);

        if (doubleCommand) {
            commands[command1](subwords);
        }
    } else {
        console.log('Commande inconnue!');
    }

    historyDiv.innerHTML += `<p class="command">${textInput}</p>`;


    var objDiv = document.getElementsByClassName("history"); //Scroll l'historique vers le bas pour afficher
    objDiv[0].scrollTop = objDiv[0].scrollHeight; //la dernière commande tapée
})


// Instance pour les lignes
const back_instance = new jge.GameInstance({
    width: largeurEcran,
    height: hauteurEcran
});

// Instance pour la tortue
const front_instance = new jge.GameInstance({
    width: largeurEcran,
    height: hauteurEcran
});


turtle.render(front_instance.renderer);

// Active la tracé de la tortue
turtle.trace = true;

requestAnimationFrame(loop);

//Vérifie si la variable passée est un nombre
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


//Boucle d'affichage
function loop() {
    requestAnimationFrame(loop); // boucle 60fps

    front_instance.renderer.clear();

    turtle.updatePosition();
    turtle.drawLineTranslate(back_instance.renderer);
    turtle.render(front_instance.renderer);


};