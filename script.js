let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sound/point.mp3');
let sound_die = new Audio('sound/die.mp3');
let sound_backsound = new Audio('sound/best adventure.mp3')
var levelStage = 1;
// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let level_val = document.querySelector('.level_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let score_level = document.querySelector('.score_level');
let level = document.querySelector('.level');

let game_state = 'Start';
img.style.display = 'none';

// menampilkan tulisan sebelum mulai game
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    
	// mulai game saat klik enter
    if(e.key == 'Enter' && game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        // menambah backsound 
        sound_backsound.play();

        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        // menampilkan score
        score_title.innerHTML = 'Score : ';
        score_level.innerHTML = 'Level : ';
        score_val.innerHTML = '0';
        level_val.innerHTML = '1';
        message.classList.remove('messageStyle');
        play();
    }
});

function play(){
    // fungsi untuk menggerakkan rintangan
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // berhasil dilewati
            if(pipe_sprite_props.right <= 0){
                element.remove();
            // gagal dilewati
            }else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    // mengatur audio
                    sound_die.play();
                    sound_backsound.pause();
                    return;

                // mendapat poin
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                        // menambah level
                        if (score_val.innerHTML != 0 && score_val.innerHTML % 5 == 0) {
                            move_speed += 2;
                            levelStage += 1;
                            level_val.innerHTML =+ level_val.innerHTML + 1;
                        }
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
       
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + grativy;
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird-2.png';
                bird_dy = -7.6;
            }
        });
        // image ketika klik panah atas
        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird.png';
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 40;

    // fungsi untuk mengatur rintangan
    function create_pipe(){
        if(game_state != 'Play') return;

        // jarak antar pipa
        if(pipe_seperation > 110){
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
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