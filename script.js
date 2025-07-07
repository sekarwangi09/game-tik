// ====== VARIABEL DASAR ======
let allQuestions = [
  // Dasar
  { category: "dasar", question: "Apa kepanjangan dari TIK?", choices: ["Teknologi Ilmu Komputer", "Teknologi Informasi dan Komunikasi", "Teknik Industri Kreatif", "Teknik Informasi Komersial"], answer: "Teknologi Informasi dan Komunikasi" },
  { category: "dasar", question: "Apa fungsi utama komputer?", choices: ["Mengetik saja", "Menggambar", "Mengolah data", "Main game"], answer: "Mengolah data" },
  { category: "dasar", question: "Salah satu perangkat output adalah:", choices: ["Mouse", "Printer", "Keyboard", "Scanner"], answer: "Printer" },
  { category: "dasar", question: "Apa itu perangkat keras?", choices: ["Aplikasi", "Data", "Fisik komputer", "Bahasa program"], answer: "Fisik komputer" },
  { category: "dasar", question: "Contoh perangkat input adalah:", choices: ["Monitor", "Proyektor", "Mouse", "Speaker"], answer: "Mouse" },

  // Internet
  { category: "internet", question: "Apa kepanjangan dari URL?", choices: ["Universal Resource Locator", "Uniform Resource Locator", "United Reference Line", "Unique Read Link"], answer: "Uniform Resource Locator" },
  { category: "internet", question: "Contoh browser berikut adalah:", choices: ["Photoshop", "Chrome", "Excel", "CorelDraw"], answer: "Chrome" },
  { category: "internet", question: "Jaringan komputer terbesar adalah:", choices: ["LAN", "MAN", "WAN", "Internet"], answer: "Internet" },
  { category: "internet", question: "Agar terhubung ke internet harus punya:", choices: ["Kabel HDMI", "Printer", "Modem", "Mouse"], answer: "Modem" },
  { category: "internet", question: "Kegiatan mencari info lewat internet disebut:", choices: ["Searching", "Printing", "Uploading", "Browsing"], answer: "Browsing" },

  // Hardware
  { category: "hardware", question: "Bagian CPU yang memproses data disebut:", choices: ["ALU", "RAM", "ROM", "VGA"], answer: "ALU" },
  { category: "hardware", question: "RAM berfungsi untuk:", choices: ["Mencetak data", "Menyimpan sementara", "Menampilkan gambar", "Mengalirkan listrik"], answer: "Menyimpan sementara" },
  { category: "hardware", question: "Harddisk digunakan untuk:", choices: ["Cetak dokumen", "Main game", "Penyimpanan utama", "Tampilkan gambar"], answer: "Penyimpanan utama" },
  { category: "hardware", question: "Monitor termasuk:", choices: ["Input", "Output", "Proses", "Sumber daya"], answer: "Output" },
  { category: "hardware", question: "Contoh port di komputer adalah:", choices: ["USB", "VGA", "HDMI", "Semua benar"], answer: "Semua benar" }
];

let questions = [];
let questionOrders = [];
let currentQuestion = 0;
let currentPlayer = 0;
let playerCount = 0;
let scores = [];
let correctCounts = [];
let wrongCounts = [];
let timeLeft = 10;
let timer;
let isVsComputer = false;

// DOM
const qScreen = document.getElementById("quiz-screen");
const tScreen = document.getElementById("turn-screen");
const rScreen = document.getElementById("result-screen");
const sScreen = document.getElementById("start-screen");
const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const choicesDiv = document.getElementById("choices");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const playerTurn = document.getElementById("player-turn");
const leaderboardDiv = document.getElementById("leaderboard");

// START
function startGame() {
  playerCount = parseInt(document.getElementById("playerCount").value);
  const selectedCategory = document.getElementById("category").value;
  isVsComputer = playerCount === 1;
  scores = new Array(playerCount).fill(0);
  correctCounts = new Array(playerCount).fill(0);
  wrongCounts = new Array(playerCount).fill(0);
  questions = allQuestions.filter(q => q.category === selectedCategory);
  questionOrders = Array.from({ length: playerCount }, () => shuffle([...questions]));
  currentQuestion = 0;
  currentPlayer = 0;
  sScreen.style.display = "none";
  showTurnScreen();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showTurnScreen() {
  qScreen.style.display = "none";
  tScreen.style.display = "block";
  const giliran = isVsComputer ? (currentPlayer === 0 ? "Kamu" : "Komputer") : `Pemain ${currentPlayer + 1}`;
  document.getElementById("next-turn-text").innerText = `Giliran: ${giliran}`;
  if (isVsComputer && currentPlayer === 1) {
    setTimeout(() => startTurn(), 1000);
  }
}

function startTurn() {
  tScreen.style.display = "none";
  qScreen.style.display = "block";
  showQuestion();
}

function showQuestion() {
  const q = questionOrders[currentPlayer][currentQuestion];
  questionNumber.innerText = `Soal ${currentQuestion + 1}`;
  questionText.innerText = q.question;
  choicesDiv.innerHTML = "";
  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    choicesDiv.appendChild(btn);
  });
  timeLeft = 10;
  updateTimer();
  timer = setInterval(updateTimer, 1000);
  updateDisplay();
}

function updateTimer() {
  timerDisplay.textContent = `⏱️ ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    wrongCounts[currentPlayer]++;
    nextTurn();
  }
  timeLeft--;
}

function checkAnswer(choice) {
  clearInterval(timer);
  const correct = questionOrders[currentPlayer][currentQuestion].answer;
  if (choice === correct) {
    scores[currentPlayer] += 10;
    correctCounts[currentPlayer]++;
  } else {
    wrongCounts[currentPlayer]++;
  }
  setTimeout(nextTurn, 500);
}

function nextTurn() {
  currentQuestion++;
  currentPlayer = (currentPlayer + 1) % playerCount;
  if (currentQuestion < questions.length) {
    showTurnScreen();
  } else {
    showResult();
  }
}

function updateDisplay() {
  scoreDisplay.textContent = `Skor: ${scores[currentPlayer]}`;
  playerTurn.textContent = isVsComputer ? (currentPlayer === 0 ? "Kamu" : "Komputer") : `Pemain ${currentPlayer + 1}`;
}

function showResult() {
  qScreen.style.display = "none";
  tScreen.style.display = "none";
  rScreen.style.display = "block";
  const scoresDiv = document.getElementById("scores");
  scoresDiv.innerHTML = "";
  scores.forEach((score, i) => {
    const label = isVsComputer ? (i === 0 ? "Kamu" : "Komputer") : `Pemain ${i + 1}`;
    const p = document.createElement("p");
    p.textContent = `${label} → Benar: ${correctCounts[i]}, Salah: ${wrongCounts[i]}, Skor: ${score}`;
    scoresDiv.appendChild(p);
  });
  saveLeaderboard();
  renderLeaderboard();
}

function saveLeaderboard() {
  const existing = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const newData = scores.map((s, i) => ({
    name: isVsComputer ? (i === 0 ? "Kamu" : "Komputer") : `Pemain ${i + 1}`,
    score: s
  }));
  const updated = [...existing, ...newData];
  localStorage.setItem("leaderboard", JSON.stringify(updated.sort((a, b) => b.score - a.score).slice(0, 10)));
}

function renderLeaderboard() {
  const data = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboardDiv.innerHTML = data.map((d, i) => `<p>${i + 1}. ${d.name}: ${d.score}</p>`).join("");
}

function resetGame() {
  window.location.reload();
}

function clearLeaderboard() {
  localStorage.removeItem("leaderboard");
  renderLeaderboard();
}
