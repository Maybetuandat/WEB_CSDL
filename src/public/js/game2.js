const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
// const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
let currentQuestion = {};
let acceptingAnswers = false;
// let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let myArray = new Array(100).fill(0);
let ansUser = [];
let questions = [];
let jsonQuestions =
  "../cauhoi/" + localStorage.getItem("currentSubject") + ".json";

var data = JSON.parse(
  document.querySelector("script").getAttribute("data-data")
);

let offsetHours = 7;
let currentTime = new Date();

let adjustedTime = data.time;

let ThoiGianLamBai = adjustedTime.slice(0, 19).replace("T", " ");

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

questionCounter = 0;
availableQuesions = [...questions];
ansUser = myArray;

document.addEventListener("DOMContentLoaded", function () {
  let subject = document.getElementById("subject");
  subject.textContent = data.test.TenBaiThi;
});

let cauhoi = document.getElementById("cauhoi");

for (let i = 0; i < data.questions.length; i++) {
  let container_hoitrl = document.createElement("div");
  container_hoitrl.classList.add("container-hoitrl");
  container_hoitrl.classList.add(i);
  container_hoitrl.id = i;

  let stt = document.createElement("div");
  stt.classList.add("stt");
  stt.textContent = "Câu " + (i + 1);
  container_hoitrl.appendChild(stt);

  let container_cauhoi = document.createElement("div");
  container_cauhoi.textContent = data.questions[i].DeBai;
  container_cauhoi.classList.add("container-cauhoi");
  container_hoitrl.appendChild(container_cauhoi);

  if (data.questions[i].HinhAnh != null) {
    let image_cauhoi = document.createElement("img");
    // let baseURL = window.location.origin + "/images/";
    // image_cauhoi.src = baseURL + data.questions[i].HinhAnh;
    image_cauhoi.src = data.questions[i].HinhAnh;
    image_cauhoi.alt = "Hình ảnh câu hỏi";
    image_cauhoi.style.maxWidth = "100%";
    // image_cauhoi.height = 150;
    image_cauhoi.className = "image-class";
    image_cauhoi.loading = "lazy";
    container_hoitrl.appendChild(image_cauhoi);
  }

  for (let j = 0; j < data.questions[i].LuaChon.length; j++) {
    let container_choice = document.createElement("div");
    container_choice.classList.add("choice");
    container_choice.classList.add(j + 1);
    container_choice.textContent = data.questions[i].LuaChon[j].NoiDung;
    container_hoitrl.appendChild(container_choice);
    if (data.questions[i].LuaChon[j].HinhAnh != null) {
      let image_luachon = document.createElement("img");
      // let baseURL = window.location.origin + "/images/";
      // image_luachon.src = baseURL + data.questions[i].LuaChon[j].HinhAnh;
      image_luachon.src = data.questions[i].LuaChon[j].HinhAnh;
      image_luachon.alt = "Hình ảnh lựa chọn";
      image_luachon.style.maxWidth = "100%";
      // image_cauhoi.height = 150;
      image_luachon.className = "image-class";
      image_luachon.loading = "lazy";
      container_choice.appendChild(image_luachon);
    }
  }
  cauhoi.appendChild(container_hoitrl);
}
let trangthai = document.getElementById("trangthai");

let blockDiv = document.createElement("div");
blockDiv.id = "blockDiv";
for (let i = 0; i < data.questions.length; i++) {
  let block = document.createElement("span");
  block.classList.add("block");
  block.id = "block" + (i + 1);
  block.textContent = i + 1;
  blockDiv.appendChild(block);
}
trangthai.appendChild(blockDiv);

let choice = Array.from(document.getElementsByClassName("choice"));
let anstmp = null;
if (localStorage.getItem("answerofUser") != null) {
  anstmp = JSON.parse(localStorage.getItem("answerofUser"));
}
for (let i = 0; i < choice.length; i++) {
  let x = choice[i];
  x.addEventListener("click", (e) => {
    let selectedChoice = e.target;
    let cauhoiId = parseInt(selectedChoice.parentElement.id);
    let cauhoiStt = parseInt(selectedChoice.parentElement.classList[1]);
    let block = document.getElementById("block" + (cauhoiStt + 1));
    if (selectedChoice.classList.contains("pick")) {
      selectedChoice.classList.remove("pick");
      block.style.background = "white";
      ansUser[parseInt(cauhoiId)] = 0;
      localStorage.setItem("answerofUser", JSON.stringify(ansUser));
      return;
    }
    block.style.background = "#578fde";
    let selectedAnswer = parseInt(selectedChoice.classList[1]);
    ansUser[parseInt(cauhoiId)] = selectedAnswer;
    localStorage.setItem("answerofUser", JSON.stringify(ansUser));
    selectedChoice.classList.add("pick");
    choice.forEach((x) => {
      if (
        x != selectedChoice &&
        x.classList.contains("pick") &&
        x.parentElement.id == selectedChoice.parentElement.id
      )
        x.classList.remove("pick");
    });
  });

  if (anstmp != null) {
    if (
      anstmp[parseInt(i / 4)] != 0 &&
      parseInt(i / 4) * 4 + anstmp[parseInt(i / 4)] - 1 == i
    ) {
      choice[i].classList.add("pick");
      let cauhoiStt = parseInt(choice[i].parentElement.classList[1]);
      let block = document.getElementById("block" + (cauhoiStt + 1));
      block.style.background = "#578fde";
      ansUser[parseInt(i / 4)] = anstmp[parseInt(i / 4)];
    }
  }
}

let arrBlocks = Array.from(document.getElementsByClassName("block"));
arrBlocks.forEach((block, index) => {
  block.addEventListener("click", () => {
    let target = document.getElementsByClassName("container-hoitrl")[index];
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

const process = async () => {
  try {
    localStorage.setItem("answerofUser", JSON.stringify(ansUser));

    const offsetHours = 7;
    const currentTime = new Date();
    const adjustedTime = new Date(
      currentTime.getTime() + offsetHours * 60 * 60 * 1000
    );
    const ThoiGianNopBai = adjustedTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const metadata = [
      {
        start: ThoiGianLamBai,
        finish: ThoiGianNopBai,
        mabaithi: data.test.MaBaiThi,
      },
    ];

    const numToCharMap = {
      0: "E",
      1: "A",
      2: "B",
      3: "C",
      4: "D",
    };
    const convertToChar = (num) => numToCharMap[num];
    const ansString = ansUser.map(convertToChar).join("");
    const option = ansString.slice(0, data.questions.length);

    const databody = JSON.stringify({ metadata, option });

    const btnNopBai = document.getElementById("btn-nopbai");
    btnNopBai.textContent = "Đang gửi bài...";

    let retries = 3; // Số lần thử tối đa
    while (retries > 0) {
      try {
        const response = await fetch("/thi/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: databody,
        });

        if (!response.ok) {
          btnNopBai.textContent = "Nộp bài";
          console.error("Có lỗi xảy ra:", error);
          alert("Không thể nộp bài. Hãy thử lại!!");
          throw new Error("Network response was not ok");
        }

        // Thành công
        localStorage.removeItem("answerofUser");
        window.location.assign(`../thi`);
        return;
      } catch (error) {
        retries -= 1;
        if (retries == 0) {
          btnNopBai.textContent = "Nộp bài";
          console.error("Có lỗi xảy ra:", error);
          alert("Không thể nộp bài. Hãy thử lại!!");
          throw error;
        }
      }
    }
  } catch (error) {
    const btnNopBai = document.getElementById("btn-nopbai");
    btnNopBai.textContent = "Nộp bài";
    console.error("Có lỗi xảy ra:", error);
    alert("Không thể nộp bài. Vui lòng thử lại sau.");
  }
};

// }
const nopbai = async () => {
  try {
    openDialog(
      "Nộp bài",
      "Thời gian làm bài thi chưa hết, bạn có chắc chắn muốn nộp bài?",
      await process()
    );
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

// Cập nhật thời gian mỗi 1 giây
var timer = setInterval(async () => {
  currentTime = new Date();
  adjustedTime = new Date(currentTime.getTime() + offsetHours * 60 * 60 * 1000);
  let startTime = Date.parse(data.time);
  var distance =
    1000 * data.test.ThoiGianThi * 60 - (adjustedTime.getTime() - startTime);

  var hours = Math.floor(distance / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  distance -= 1000;
  document.getElementById("countdown").innerHTML =
    hours + ":" + minutes + ":" + seconds;

  if (distance < -1000) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "Hết thời gian!";
    let btnClose = document.getElementById("btn-close");
    btnClose.style.display = "none";
    try {
      await process();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }
}, 1000);
//}

document.addEventListener("scroll", function () {
  var rightDiv = document.getElementById("action");
  var scrollTop = window.scrollY || document.documentElement.scrollTop;
  var leftDiv = document.getElementById("cauhoi");
  var leftDivBottom = leftDiv.getBoundingClientRect().bottom;
  var rightDivBottom = rightDiv.getBoundingClientRect().bottom;

  if (leftDivBottom > rightDivBottom) {
    rightDiv.style.top = scrollTop + "px";
  }
});

function openDialog(tittle, content, func) {
  var dialogOverlay = document.getElementById("dialogOverlay");
  var dialogContent = document.getElementById("dialogContent");
  var content1 = document.getElementById("content-dialog");
  var question = document.getElementById("question-dialog");
  var btnContinue = document.getElementById("btn-continue");
  question.innerHTML = `<p class="sent" id="question-dialog">${content}</p>`;
  content1.textContent = tittle;
  btnContinue.onclick = func;
  dialogOverlay.style.display = "block";
  dialogContent.style.display = "block";
}

// Hàm đóng dialog
function closeDialog() {
  var dialogOverlay = document.getElementById("dialogOverlay");
  var dialogContent = document.getElementById("dialogContent");
  dialogOverlay.style.display = "none";
  dialogContent.style.display = "none";
}
