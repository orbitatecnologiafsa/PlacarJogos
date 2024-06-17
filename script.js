function updateScore(team, player) {
    const scoreElement = document.getElementById(`placar-${team}`);
    const goalsList = document.getElementById(`jogadores-gol-${team}`);
    const golsVideoDiv = document.getElementById('video-jogador');
    const golsVideo = document.getElementById(`jogador-video-${player}`);
    
    if (scoreElement && goalsList) {
        let score = parseInt(scoreElement.textContent);
        scoreElement.textContent = score + 1;
        
        const goalItem = document.createElement('li');
        goalItem.textContent = player;
        goalItem.textContent = player.replace(/-/g, ' ');
        goalsList.appendChild(goalItem);

        if (golsVideoDiv && golsVideo) {
            
            const allVideos = document.querySelectorAll('.jogador-video');
            allVideos.forEach(video => {
                video.pause();
                video.style.display = 'none';
            });

            golsVideoDiv.style.display = 'flex';
            golsVideo.style.display = 'block';
            golsVideo.currentTime = 0;
            golsVideo.play();

            golsVideo.addEventListener('ended', function() {
                golsVideoDiv.style.display = 'none';
            });
        }
    } else {
        console.error(`Elementos para o time ${team} não encontrados.`);
    }
}

let intervalId;
let minutos = 0;
let segundos = 0;

function updateDisplay() {
    document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
    document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

function startTimer() {
    intervalId = setInterval(() => {
        segundos++;
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        if (minutos === 45) {
            clearInterval(intervalId);
        }
        updateDisplay();
    }, 1000);
}

function startSecondHalfTimer() {
    intervalId = setInterval(() => {
        segundos++;
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        if (minutos === 90) {
            clearInterval(intervalId);
        }
        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;
}

function resumeTimer() {
    if (minutos < 45) {
        startTimer();
    } else if (minutos >= 45 && minutos < 90) {
        startSecondHalfTimer();
    }
}

function fecharPropaganda() {
    localStorage.setItem('propagandaFechada', 'true');
}

window.addEventListener('storage', (event) => {
    if (event.key === 'goal') {
        const goalData = JSON.parse(event.newValue);
        updateScore(goalData.team, goalData.player);
        localStorage.removeItem('goal');
    }

    if (event.key === 'propaganda' && event.newValue === 'true') {
        showPropaganda();
        localStorage.removeItem('propaganda');
    }
   
    if (event.key === 'propagandaFechada' && event.newValue === 'true') {
        propaganda.style.display = 'none';
        localStorage.removeItem('propagandaFechada');
    }
   
    if (event.key === 'timerControl') {
        switch (event.newValue) {
            case 'startFirstHalf':
                minutos = 0;
                segundos = 0;
                updateDisplay();
                startTimer();
                break;
            case 'startSecondHalf':
                minutos = 45;
                segundos = 0;
                updateDisplay();
                startSecondHalfTimer();
                break;
            case 'pause':
                pauseTimer();
                break;
            case 'resume':
                resumeTimer();
                break;
        }
        localStorage.removeItem('timerControl'); // Limpa o valor de controle após o processamento
    }
});

function showPropaganda() {
    const propaganda = document.getElementById('propaganda');
    if (propaganda) {
        propaganda.style.display = 'flex';
        const video = document.getElementById('propaganda-video');
        video.currentTime = 0;
        if (video) {
            video.play();
            video.addEventListener('ended', function() {
                propaganda.style.display = 'none';
            });
        } else {
            console.error('Elemento de vídeo da propaganda não encontrado.');
        }
    } else {
        console.error('Elemento da propaganda não encontrado.');
    }
}

window.onstorage = function() {
    if (localStorage.getItem('teamData')) {
        const teamData = JSON.parse(localStorage.getItem('teamData'));
        document.getElementById('time2_nome_exibir').textContent = teamData.name;
        document.getElementById('time2_logo').src = teamData.logo;
        document.getElementById('time2_gols').textContent = 'GOLS ' + teamData.name.toUpperCase();
        document.getElementById('time2_logo_exibir').src = teamData.logo;
    }
}
function autoPropaganda(){
    const interval = 2 * 60 * 1000;
    //showPropaganda();
    //setInterval(showPropaganda, interval);
}
window.onload = function() {
    if (localStorage.getItem('teamData')) {
        const teamData = JSON.parse(localStorage.getItem('teamData'));
        document.getElementById('time2_nome_exibir').textContent = teamData.name;
        document.getElementById('time2_logo').src = teamData.logo;
        document.getElementById('time2_gols').textContent = 'GOLS ' + teamData.name.toUpperCase();
        document.getElementById('time2_logo_exibir').src = teamData.logo;
    }
}

autoPropaganda();


document.getElementById('gear').addEventListener('click', function() {
    window.open('./config.html', '_blank');
})