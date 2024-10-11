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

questionCounter = 0;
availableQuesions = [...questions];
ansUser = myArray;

let subject = document.getElementById("subject");
subject.textContent = data.test.TenBaiThi;

let cauhoi = document.getElementById("cauhoi");

for (let i = 0; i < data.questions.length; i++) {
  let container_hoitrl = document.createElement("div");
  container_hoitrl.classList.add("container-hoitrl");
  container_hoitrl.classList.add(i);
  container_hoitrl.id = i;

  // Tạo phần hiển thị số thứ tự câu hỏi
  let stt = document.createElement("div");
  stt.classList.add("stt");
  stt.textContent = "Câu " + (i + 1);
  container_hoitrl.appendChild(stt);

  // Tạo phần nội dung câu hỏi
  let container_cauhoi = document.createElement("div");
  container_cauhoi.textContent = data.questions[i].DeBai;
  container_cauhoi.classList.add("container-cauhoi");
  container_hoitrl.appendChild(container_cauhoi);

  // Tạo ô nhập liệu cho câu trả lời
  let inputTraLoi = document.createElement("textarea"); // Sử dụng <textarea> cho input nhiều dòng
  inputTraLoi.classList.add("input-traloi");
  inputTraLoi.placeholder = "Nhập câu trả lời của bạn";
  inputTraLoi.style.width = "100%"; // Để fit width với phần tử cha
  inputTraLoi.style.height = "100px"; // Chiều cao cố định
  inputTraLoi.style.resize = "vertical"; // Cho phép kéo chiều cao theo chiều dọc
  inputTraLoi.style.boxSizing = "border-box"; // Để đảm bảo padding không làm thay đổi kích thước
  inputTraLoi.style.padding = "5px";
  container_hoitrl.appendChild(inputTraLoi);

  // Tạo nút nộp bài
  let buttonNopBai = document.createElement("button");
  buttonNopBai.classList.add("button-nopbai");
  buttonNopBai.textContent = "Nộp bài"; // Nội dung của nút
  container_hoitrl.appendChild(buttonNopBai);

  // Tạo phần hiển thị thông báo
  let notification = document.createElement("div");
  notification.classList.add("notification");
  container_hoitrl.appendChild(notification);

  const matchedResult = data.result.find((result) => result.Cau === i + 1); // Tìm kết quả dựa trên số câu

  if (matchedResult) {
    inputTraLoi.value = matchedResult.ChiTiet;
    notification.textContent = "Đã nộp thành công";
    notification.style.color = "green"; // Màu thông báo thành công là màu xanh
  }

  // Thêm sự kiện khi nhấn nút nộp bài
  buttonNopBai.addEventListener("click", async () => {
    buttonNopBai.disabled = true; // Disable the button
    buttonNopBai.textContent = "Đang nộp..."; // Update button text

    try {
      const result = await process(inputTraLoi.value, i); // Call the process function
      if (result.success) {
        notification.textContent = "Nộp thành công"; // Success notification
        notification.style.color = "green"; // Set notification text color to green
      } else {
        notification.textContent = "Nộp thất bại"; // Failure notification
        notification.style.color = "red"; // Set notification text color to red
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      notification.textContent = "Nộp thất bại"; // Failure notification if there's an error
      notification.style.color = "red"; // Set notification text color to red
    }
    buttonNopBai.disabled = false; // Re-enable the button after 3 seconds
    buttonNopBai.textContent = "Nộp bài"; // Update button text back to original
  });

  // Thêm container cho câu hỏi vào DOM
  cauhoi.appendChild(container_hoitrl);
}

let trangthai = document.getElementById("trangthai");

const process = async (value, i) => {
  const offsetHours = 7; // Adjust for timezone
  const currentTime = new Date();
  const adjustedTime = new Date(
    currentTime.getTime() + offsetHours * 60 * 60 * 1000
  );

  // Format the timestamp
  const ThoiGianNopBai = adjustedTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Construct metadata
  const metadata = {
    finish: ThoiGianNopBai,
    mabaithi: data.test.MaBaiThi,
    macauhoi: i + 1, // Adjust for 1-based index
    chitiet: value,
  };

  // Create a timeout promise
  const timeout = new Promise(
    (_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 15000) // 15 seconds timeout
  );

  // Send request and race it against the timeout
  try {
    const response = await Promise.race([
      fetch("/thi/submitsql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      }),
      timeout, // Add timeout to the race
    ]);

    // Check response
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Return success if no error
    return { success: true };
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return { success: false }; // Return failure
  }
};

var timer = setInterval(async () => {
  data.time -= 1000;
  var distance = data.time;
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  distance -= 1000;
  document.getElementById("countdown").innerHTML = minutes + ":" + seconds;

  if (distance < -1000) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "Hết thời gian!";
    let btnClose = document.getElementById("btn-close");
    btnClose.style.display = "none";
    window.location.assign(`../thi`);
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
