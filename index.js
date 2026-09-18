const questions = [
    {
        emoji: "🧺",
        question: "¿Recuerdas la fecha de nuestro primer picnic?",
        answers: [
            "26/02/2024",
            "26-02-2024",
            "26 02 2024"
        ]
    },

    {
        emoji: "🎬",
        question: "¿Qué película vimos en nuestra primera cita?",
        answers: [
            "gato con botas el ultimo deseo",
            "gato con botas: el ultimo deseo",
            "gato con botas ultimo deseo"
        ]
    },

    {
        emoji: "💋",
        question: "¿En qué lugar fue nuestro primer beso?",
        answers: [
            "cine",
            "en el cine"
        ]
    },

    {
        emoji: "🎂",
        question: "¿Qué día es mi cumpleaños?",
        answers: [
            "22/05/2005",
            "22-05-2005",
            "22 05 2005"
        ]
    },

    {
        emoji: "❤️",
        question: "¿Recuerdas la fecha en la que nos hicimos enamorados?",
        answers: [
            "25/10/2022",
            "25-10-2022",
            "25 10 2022"
        ]
    },

    {
        emoji: "🌻",
        question: "¿Recuerdas la fecha en que te regalé flores amarillas por primera vez?",
        answers: [
            "12/10/2024",
            "12-10-2024",
            "12 10 2024"
        ]
    },

    {
        emoji: "🍽️",
        question: "¿Cuál es mi comida favorita?",
        answers: [
            "arroz con mariscos",
            "arroz con marisco"
        ]
    },

    {
        emoji: "🎁",
        question: "¿Qué fue lo primero que te regalé?",
        answers: [
            "un libro y un martillo de madera",
            "libro y martillo de madera",
            "un libro y martillo de madera",
            "libro y un martillo de madera"
        ]
    },

    {
        emoji: "💤",
        question: "¿Cuál fue la fecha de nuestra primera pijamada juntos?",
        answers: [
            "03/05/2026",
            "3/05/2026",
            "03-05-2026",
            "3-05-2026",
            "03 05 2026",
            "3 05 2026"
        ]
    },

    {
        emoji: "🥞",
        question: "¿Qué fue lo primero que preparamos juntos?",
        answers: [
            "panqueques",
            "panqueque"
        ]
    },

    {
        emoji: "💕",
        question: "¿Quién dijo “te amo” primero?",
        answers: [
            "tu",
            "miguel",
            "miguel yupanqui"
        ]
    },

    {
        emoji: "💛",
        question: "Si llegamos juntos al 25/10/2030, ¿cuántos años cumpliríamos juntos?",
        answers: [
            "8",
            "8 años",
            "ocho",
            "ocho años"
        ]
    }
];


const puzzlePieces = document.querySelectorAll(".puzzle-piece");

const modal = document.getElementById("questionModal");
const closeModal = document.getElementById("closeModal");

const modalPieceNumber = document.getElementById("modalPieceNumber");
const questionEmoji = document.getElementById("questionEmoji");
const questionText = document.getElementById("questionText");

const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const answerMessage = document.getElementById("answerMessage");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const gameScreen = document.getElementById("gameScreen");
const rewardScreen = document.getElementById("rewardScreen");


let currentQuestion = null;

const solvedQuestions = new Set();


function normalizeAnswer(text) {

    return text
        .toLowerCase()
        .trim()

        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

        .replace(/[¿?¡!.,:;]/g, "")

        .replace(/\s+/g, " ");
}


function openQuestion(index) {

    if (solvedQuestions.has(index)) {
        return;
    }

    currentQuestion = index;

    const question = questions[index];

    modalPieceNumber.textContent = index + 1;
    questionEmoji.textContent = question.emoji;
    questionText.textContent = question.question;

    answerInput.value = "";

    answerMessage.textContent = "";
    answerMessage.className = "answer-message";

    modal.classList.add("show");

    setTimeout(() => {
        answerInput.focus();
    }, 200);
}


function closeQuestion() {

    modal.classList.remove("show");

    currentQuestion = null;
}


puzzlePieces.forEach((piece) => {

    piece.addEventListener("click", () => {

        const index = Number(piece.dataset.question);

        openQuestion(index);
    });

});


closeModal.addEventListener("click", closeQuestion);


modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeQuestion();
    }

});


answerForm.addEventListener("submit", (event) => {

    event.preventDefault();

    if (currentQuestion === null) {
        return;
    }

    const userAnswer = normalizeAnswer(answerInput.value);

    if (!userAnswer) {

        answerMessage.textContent =
            "Primero escribe una respuesta 👀";

        answerMessage.className =
            "answer-message wrong";

        return;
    }


    const validAnswers =
        questions[currentQuestion].answers.map(normalizeAnswer);


    if (validAnswers.includes(userAnswer)) {

        answerMessage.textContent =
            "Sabía que te acordarías 💛";

        answerMessage.className =
            "answer-message correct";

        unlockPiece(currentQuestion);

        setTimeout(() => {

            closeQuestion();

        }, 900);

    }

    else {

        const wrongMessages = [
            "Mmm... esa no es 👀",
            "¿Segura? Inténtalo otra vez 😂",
            "Casi... piensa un poquito más 💛",
            "Esa respuesta no abre esta pieza 🔒"
        ];

        const randomMessage =
            wrongMessages[
                Math.floor(Math.random() * wrongMessages.length)
            ];

        answerMessage.textContent =
            randomMessage;

        answerMessage.className =
            "answer-message wrong";
    }

});


function unlockPiece(index) {

    if (solvedQuestions.has(index)) {
        return;
    }

    solvedQuestions.add(index);

    const piece = puzzlePieces[index];

    piece.classList.add("solved");

    piece.querySelector(".lock").textContent = "💛";

    updateProgress();


    if (solvedQuestions.size === questions.length) {

        setTimeout(() => {

            finishPuzzle();

        }, 1500);
    }

}


function updateProgress() {

    const solved = solvedQuestions.size;

    const total = questions.length;

    progressText.textContent =
        `${solved} / ${total}`;

    const percentage =
        (solved / total) * 100;

    progressFill.style.width =
        `${percentage}%`;
}


function finishPuzzle() {

    gameScreen.style.animation =
        "fadeOut 0.8s ease forwards";

    setTimeout(() => {

        gameScreen.classList.add("hidden");

        rewardScreen.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 700);
}


const skipQuestions = document.getElementById("skipQuestions");

skipQuestions.addEventListener("click", () => {
    gameScreen.classList.add("hidden");
    rewardScreen.classList.remove("hidden");
});