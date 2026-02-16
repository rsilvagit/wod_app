const workouts = [
  {
    name: "Runner's Strength",
    exercises: [
      {name:"Corrida / High Knees", desc:"200m corrida no parque ou 1 min joelho alto em casa."},
      {name:"Walking Lunges", desc:"20 passadas alternadas mantendo postura ereta."},
      {name:"Air Squats", desc:"15 agachamentos profundos com coluna neutra."},
      {name:"Burpees", desc:"10 repetições versão adaptada."}
    ]
  },
  {
    name: "Upper Body Focus",
    exercises: [
      {name:"Push-ups", desc:"Flexões tradicionais ou joelhos no chão."},
      {name:"Dips", desc:"Tríceps no banco ou sofá."},
      {name:"Shoulder Taps", desc:"Toque alternado no ombro em prancha."},
      {name:"Corrida/Polichinelo", desc:"100m ou 30s de polichinelo."}
    ]
  },
  {
    name: "Core & Balance",
    exercises: [
      {name:"Step-ups", desc:"Subir e descer banco ou degrau."},
      {name:"Sit-ups", desc:"Abdominal remador."},
      {name:"Plank", desc:"30 segundos prancha."},
      {name:"Superman", desc:"Elevação simultânea de braços e pernas."}
    ]
  },
  {
    name: "The Pyramid",
    exercises: [
      {name:"Agachamentos", desc:"5,10,15,20 reps progressivas."},
      {name:"Flexões", desc:"Progressivas a cada round."},
      {name:"Abdominais", desc:"Progressivas."},
      {name:"Corrida", desc:"50m fixos por round."}
    ]
  },
  {
    name: "Agility & Speed",
    exercises: [
      {name:"Shuttle Run/Lateral Hops", desc:"Agilidade entre pontos ou saltos laterais."},
      {name:"Mountain Climbers", desc:"15 reps."},
      {name:"Glute Bridges", desc:"10 reps."},
      {name:"Jumping Jacks", desc:"15 reps."}
    ]
  }
];

let currentWorkout = 0;
let currentExercise = 0;
let timer;
let totalTime = 30 * 60;
let remainingTime = totalTime;
let running = false;

function openWorkout(index){
  currentWorkout = index;
  currentExercise = 0;
  document.getElementById("workoutTitle").innerText = workouts[index].name;
  updateExercise();
  document.getElementById("workoutModal").style.display = "flex";
}

function closeModal(){
  stopTimer();
  document.getElementById("workoutModal").style.display = "none";
}

function updateExercise(){
  const ex = workouts[currentWorkout].exercises[currentExercise];
  document.getElementById("exerciseName").innerText = ex.name;
  document.getElementById("exerciseDesc").innerText = ex.desc;
}

function nextExercise(){
  currentExercise = (currentExercise + 1) % workouts[currentWorkout].exercises.length;
  updateExercise();
}

function prevExercise(){
  currentExercise = (currentExercise - 1 + workouts[currentWorkout].exercises.length) % workouts[currentWorkout].exercises.length;
  updateExercise();
}

function startTimer(){
  if(running) return;
  running = true;
  timer = setInterval(()=>{
    if(remainingTime <= 0){
      stopTimer();
      saveHistory();
      return;
    }
    remainingTime--;
    updateTimer();
  },1000);
}

function pauseTimer(){
  running = false;
  clearInterval(timer);
}

function stopTimer(){
  running = false;
  clearInterval(timer);
  remainingTime = totalTime;
  updateTimer();
}

function updateTimer(){
  let min = Math.floor(remainingTime/60);
  let sec = remainingTime%60;
  document.getElementById("timer").innerText =
    `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;

  let progress = ((totalTime - remainingTime)/totalTime)*100;
  document.getElementById("progressBar").style.width = progress+"%";

  if(remainingTime > 1500) document.getElementById("phaseLabel").innerText="Aquecimento";
  else if(remainingTime > 300) document.getElementById("phaseLabel").innerText="WOD";
  else document.getElementById("phaseLabel").innerText="Descompressão";
}

function saveHistory(){
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({
    workout: workouts[currentWorkout].name,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
}

function loadHistory(){
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const list = document.getElementById("historyList");
  list.innerHTML="";
  history.forEach(h=>{
    const li = document.createElement("li");
    li.innerText=`${h.workout} - ${h.date}`;
    list.appendChild(li);
  });
}

updateTimer();
loadHistory();
