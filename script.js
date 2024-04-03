var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bird = document.querySelector('.bird')
var img = document.getElementById('bird-1');

var move_speed = 3, gravity = 0.5;
var birdY = 300;
var birdDY = 0;
var birdHeight = 40;
var birdWidth = 40;

var sound_point = new Audio('sound/point.mp3');
var sound_die = new Audio('sound/die.mp3');
var sound_backsound = new Audio('sound/best adventure.mp3');
var levelStage = 1;

var score_val = document.querySelector('.score_val');
var level_val = document.querySelector('.level_val');
var message = document.querySelector('.message');
var score_title = document.querySelector('.score_title');
var score_level = document.querySelector('.score_level');

var game_state = 'Start';
img.style.display = 'none';

message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        sound_backsound.play();

        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_level.innerHTML = 'Level : ';
        score_val.innerHTML = '0';
        level_val.innerHTML = '1';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    function move() {
        if (game_state != 'Play') return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bird
        ctx.drawImage(img, 50, birdY, birdWidth, birdHeight);

        var pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            var pipe_sprite_props = element.getBoundingClientRect();

            // Draw pipe
            ctx.fillRect(pipe_sprite_props.left, pipe_sprite_props.top, pipe_sprite_props.width, pipe_sprite_props.height);

            // Check collision with bird
            if (birdY < pipe_sprite_props.bottom &&
                birdY + birdHeight > pipe_sprite_props.top &&
                50 + birdWidth > pipe_sprite_props.left &&
                50 < pipe_sprite_props.right) {
                game_state = 'End';
                message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                message.classList.add('messageStyle');
                img.style.display = 'none';

                sound_die.play();
                sound_backsound.pause();
                return;
            }
            
            // Move pipe
            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                element.style.left = pipe_sprite_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    var bird_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                birdDY = -7.6; // Change bird's vertical velocity
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                birdDY = 0; // Reset bird's vertical velocity
            }
        });

        birdY += birdDY; // Update bird's position based on velocity

        if (birdY <= 0 || birdY >= canvas.height - birdHeight) { // Check collision with canvas edges
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    var pipe_seperation = 0;
    var pipe_gap = 40;

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 110) {
            pipe_seperation = 0;

            var pipe_posi = Math.floor(Math.random() * 43) + 8;
            var pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            var pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
