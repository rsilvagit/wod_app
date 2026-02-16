const totalTime = 30 * 60;
const phases = [
  { name: "Aquecimento", duration: 5 * 60 },
  { name: "WOD", duration: 20 * 60 },
  { name: "Descompressão", duration: 5 * 60 }
];

let currentTime = 0;
let timerInterval = null;
let currentPhaseIndex = 0;

const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const phaseTitle = document.getElementById("phaseTitle");
const historyList = document.getElementById("historyList");

const exercisesInfo = {
  "Air Squat": "Agachamento livre. Trabalha quadríceps, glúteos e core.",
  "Burpee": "Movimento completo que combina agachamento, prancha e salto.",
  "Push-up": "Flexão de braço. Foco em peitoral, tríceps e core.",
  "Plank": "Prancha isométrica para fortalecimento abdominal.",
  "Lunges": "Passada caminhando. Trabalha pernas e equilíbrio."
};

const wods = [
  { name: "The Runner's Strength" },
  { name: "Upper Body Focus" },
  { name: "Core & Balance" },
  { name: "The Pyramid" },
  { name: "Agility & Speed" }
];

function loadWods() {
  const container = document.getElementById("wodList");
  wods.forEach(wod => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${wod.name}</h3>`;
    card.onclick = () => showExerciseInfo("Air Squat");
    container.appendChild(card);
  });
}

function startWorkout() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    currentTime++;
    updateTimer();

    if (currentTime >= totalTime) {
      clearInterval(timerInterval);
      saveHistory();
    }

    updatePhase();
  }, 1000);
}

function pauseWorkout() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetWorkout() {
  clearInterval(timerInterval);
  timerInterval = null;
  currentTime = 0;
  currentPhaseIndex = 0;
  progressBar.style.width = "0%";
  phaseTitle.innerText = "Pronto para iniciar";
  timerDisplay.innerText = "00:00";
}

function updateTimer() {
  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime % 60;
  timerDisplay.innerText =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  progressBar.style.width = `${(currentTime / totalTime) * 100}%`;
}

function updatePhase() {
  let elapsed = 0;
  for (let i = 0; i < phases.length; i++) {
    elapsed += phases[i].duration;
    if (currentTime <= elapsed) {
      currentPhaseIndex = i;
      phaseTitle.innerText = phases[i].name;
      break;
    }
  }
}

function saveHistory() {
  const date = new Date().toLocaleString();
  const record = `Treino concluído em ${date}`;
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(record);
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    historyList.appendChild(li);
  });
}

function showExerciseInfo(name) {
  document.getElementById("modalTitle").innerText = name;
  document.getElementById("modalDescription").innerText =
    exercisesInfo[name] || "Descrição disponível no dicionário Teebox.";
  document.getElementById("exerciseModal").style.display = "block";
}

function closeModal() {
  document.getElementById("exerciseModal").style.display = "none";
}

loadWods();
renderHistory();
