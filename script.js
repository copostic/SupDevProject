const input = document.querySelector('input');
const historyDiv = document.querySelector('div.history');

const largeurEcran = window.innerWidth;
const hauteurEcran = window.innerHeight;
const turtle = new jge.Texture({
    src: 'img.png',
    width: 16,
    height: 16,
    x: largeurEcran / 2,
    y: hauteurEcran / 2,
});

const history = [];
const commands = {
    'AV': function(args) {
        args[0]; // nom de commande

        if (args.length === 2) {
            const distance = Number(args[1]);

            turtle.translate.x = Math.cos(turtle.rotate * (Math.PI / 180)) * distance;
            turtle.translate.y = Math.sin(turtle.rotate * (Math.PI / 180)) * distance;
        } else {
            console.log('error');
        }
        console.log('AV command executée');
    },
    'RE': function(args) {
        args[0]; // nom de commande

        if (args.length === 2) {
            const distance = Number(args[1]);

            turtle.translate.x = Math.cos(turtle.rotate * (Math.PI / 111)) * distance; // Il faut trouver le bon nombre à la place de 111
            turtle.translate.y = Math.sin(turtle.rotate * (Math.PI / 111)) * distance;
        } else {
            console.log('error');
        }
        console.log('RE command executée');
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
        commands[command](words);

    } else {
        console.log('Commande inconnue!');
    }

    historyDiv.innerHTML = history.map(command => `<p>${command}</p>`)
        .join('')
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