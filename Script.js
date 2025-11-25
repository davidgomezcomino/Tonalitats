// Base de Dades del Joc: Totes les armadures fins a 7 alteracions (SENSE CANVIS)
const tonalitats = [
    { alt: 0, tipus: '', img: '0.png', major: 'Do Major', menor: 'La menor' },
    // Sostinguts
    { alt: 1, tipus: 's', img: '1s.png', major: 'Sol Major', menor: 'Mi menor' },
    { alt: 2, tipus: 's', img: '2s.png', major: 'Re Major', menor: 'Si menor' },
    { alt: 3, tipus: 's', img: '3s.png', major: 'La Major', menor: 'Fa♯ menor' },
    { alt: 4, tipus: 's', img: '4s.png', major: 'Mi Major', menor: 'Do♯ menor' },
    { alt: 5, tipus: 's', img: '5s.png', major: 'Si Major', menor: 'Sol♯ menor' },
    { alt: 6, tipus: 's', img: '6s.png', major: 'Fa♯ Major', menor: 'Re♯ menor' },
    { alt: 7, tipus: 's', img: '7s.png', major: 'Do♯ Major', menor: 'La♯ menor' },
    // Bemolls
    { alt: 1, tipus: 'b', img: '1b.png', major: 'Fa Major', menor: 'Re menor' },
    { alt: 2, tipus: 'b', img: '2b.png', major: 'Si♭ Major', menor: 'Sol menor' },
    { alt: 3, tipus: 'b', img: '3b.png', major: 'Mi♭ Major', menor: 'Do menor' },
    { alt: 4, tipus: 'b', img: '4b.png', major: 'La♭ Major', menor: 'Fa menor' },
    { alt: 5, tipus: 'b', img: '5b.png', major: 'Re♭ Major', menor: 'Si♭ menor' },
    { alt: 6, tipus: 'b', img: '6b.png', major: 'Sol♭ Major', menor: 'Mi♭ menor' },
    { alt: 7, tipus: 'b', img: '7b.png', major: 'Do♭ Major', menor: 'La♭ menor' },
];

let score = 0;
let errors = 0; 
let currentTonalitat = null;
let currentCorrectAnswer = '';
const numOptions = 4;

// NOVES VARIABLES PER AL CRONÒMETRE
let startTime; 
let timerInterval;

// Referències als elements del DOM
const scoreDisplay = document.getElementById('score');
const errorsCountDisplay = document.getElementById('errors-count');
const timerDisplay = document.getElementById('timer-display'); // NOU
const armaduraImg = document.getElementById('armadura-img');
const questionTypeDisplay = document.getElementById('question-type');
const optionsContainer = document.getElementById('options-container');
const optionButtons = document.querySelectorAll('.option-btn');
const feedbackDisplay = document.getElementById('feedback');
const startButton = document.getElementById('start-btn');
const quizArea = document.getElementById('quiz-area');

// ------------------------------------------
// Funcions del Cronòmetre
// ------------------------------------------

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsed / 1000);
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // Format Mantenir dos dígits (00:00)
    const formattedTime = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    timerDisplay.textContent = formattedTime;
}

function startTimer() {
    // Esborrem qualsevol timer anterior
    stopTimer(); 
    // Guardem el temps d'inici
    startTime = Date.now(); 
    // Actualitzem el display cada segon
    timerInterval = setInterval(updateTimer, 1000); 
}

function stopTimer() {
    clearInterval(timerInterval);
}


// ------------------------------------------
// Funcions de Lògica de Joc (Actualitzada)
// ------------------------------------------

function startGame() {
    score = 0;
    errors = 0; 
    scoreDisplay.textContent = score;
    errorsCountDisplay.textContent = errors; 
    feedbackDisplay.textContent = '';
    startButton.style.display = 'none';
    quizArea.style.display = 'block';
    
    // INICIEM EL CRONÒMETRE
    startTimer();
    
    nextQuestion();
}

// ... (Funcions nextQuestion i generateOptions són idèntiques) ...

function generateOptions(correctAnswer) {
    // (Aquesta funció és idèntica a l'anterior)
    let options = [correctAnswer];
    const pool = tonalitats.flatMap(t => [t.major, t.menor]).filter(ans => ans !== correctAnswer);

    while (options.length < numOptions) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        const randomOption = pool[randomIndex];
        
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
        pool.splice(randomIndex, 1);
    }

    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
}


function checkAnswer(clickedButton, selectedAnswer) {
    // Deshabilita tots els botons
    optionButtons.forEach(btn => btn.disabled = true);
    
    if (selectedAnswer === currentCorrectAnswer) {
        // Resposta Correcta
        clickedButton.classList.add('correct');
        feedbackDisplay.textContent = '✅ Correcte! Molt bé.';
        score++;
        scoreDisplay.textContent = score;
    } else {
        // Resposta Incorrecta
        clickedButton.classList.add('incorrect');
        feedbackDisplay.textContent = `❌ Incorrecte. La resposta correcta era: ${currentCorrectAnswer}`;
        
        errors++;
        errorsCountDisplay.textContent = errors;
        
        optionButtons.forEach(btn => {
            if (btn.textContent === currentCorrectAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    // Espera un moment abans de la següent pregunta
    setTimeout(() => {
        // Neteja les classes de feedback
        optionButtons.forEach(btn => btn.classList.remove('correct', 'incorrect'));
        feedbackDisplay.textContent = '';
        nextQuestion();
    }, 1500);
}

// ------------------------------------------
// Inicialització
// ------------------------------------------

quizArea.style.display = 'none';
startButton.addEventListener('click', startGame);