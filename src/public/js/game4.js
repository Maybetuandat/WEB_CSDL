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

console.log(data);
let adjustedTime = data.time;

questionCounter = 0;
availableQuesions = [...questions];
ansUser = myArray;

let subject = document.getElementById("subject");
subject.textContent = data.test.TenBaiThi;

let cauhoi = document.getElementById("cauhoi");
const symbols = [
  { symbol: "β", label: "β" },
  { symbol: "α", label: "α" },
  { symbol: "θ", label: "θ" },
  { symbol: "λ", label: "λ" },
  { symbol: "Δ", label: "Δ" },
  { symbol: "Ω", label: "Ω" },
  { symbol: "φ", label: "φ" },
  { symbol: "ψ", label: "ψ" },
  { symbol: "Γ", label: "Γ" },
  { symbol: "∞", label: "∞" },
  { symbol: "±", label: "±" },
  { symbol: "⊆", label: "⊆" },
  { symbol: "⊈", label: "⊈" },
  { symbol: "∈", label: "∈" },
  { symbol: "∉", label: "∉" },
  { symbol: "π", label: "π (Chiếu)" },
  { symbol: "σ", label: "σ (Chọn)" },
  { symbol: "ρ", label: "ρ (Đổi tên)" },
  { symbol: "∪", label: "∪ (Hợp)" },
  { symbol: "∩", label: "∩ (Giao)" },
  { symbol: "∅", label: "∅ (Tập rỗng)" },
  { symbol: "\\backslash", label: "\\ (Hiệu)" },
  { symbol: "⋈", label: "⋈ (Kết nối)" },
  { symbol: "×", label: "× (Sản Descartes)" },
  { symbol: "\\sum", label: "Σ (Tổng)" },
  { symbol: "\\prod", label: "∏ (Tích)" },
  { symbol: "\\frac{dy}{dx}", label: "dy/dx (Đạo hàm)" },
  { symbol: "\\sqrt{x}", label: "√ (Căn)" },
  { symbol: "∫", label: "∫ (Tích phân)" },
  { symbol: "_{sub}", label: "Subscript" },
  { symbol: "^{sup}", label: "Superscript" },
];

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

  if (data.questions[i].HinhAnh != null) {
    let image_cauhoi = document.createElement("img");
    let baseURL = window.location.origin + "/images/";
    image_cauhoi.src = baseURL + data.questions[i].HinhAnh;
    image_cauhoi.alt = "Hình ảnh câu hỏi";
    image_cauhoi.style.maxWidth = "100%";
    // image_cauhoi.height = 150;
    image_cauhoi.className = "image-class";
    image_cauhoi.loading = "lazy";
    container_hoitrl.appendChild(image_cauhoi);
  }

  let outputTraLoi = document.createElement("div"); // Sử dụng <textarea> cho input nhiều dòng
  outputTraLoi.classList.add("math-output");
  outputTraLoi.classList.add("input-traloi");
  outputTraLoi.id = "mathOutput" + i;
  outputTraLoi.style.display = "block";

  let inputTraLoi = document.createElement("textarea"); // Sử dụng <textarea> cho input nhiều dòng
  inputTraLoi.classList.add("input-traloi");
  inputTraLoi.id = "mathInput" + i;
  inputTraLoi.placeholder = "Nhập câu trả lời của bạn";
  inputTraLoi.style.display = "block";
  inputTraLoi.style.fontSize = "16px";
  inputTraLoi.addEventListener("input", () => {
    let input = inputTraLoi.value;
    let formattedInput = input.replace(/ /g, "\\ "); // Thay thế dấu cách thành \
    formattedInput = formattedInput.replace(/\n/g, "\\\\"); // Thay dấu xuống dòng thành \\ trong LaTeX
    let mathFormula = `\\begin{gather} ${formattedInput} \\end{gather}`;
    outputTraLoi.innerHTML = `\\[ ${mathFormula} \\]`;

    // Sử dụng MathJax để hiển thị công thức
    MathJax.typesetPromise([outputTraLoi]).then(() => {
      // Đảm bảo rằng các phần tử MathJax được căn lề trái
      const mjxContainer = document.querySelectorAll(
        'mjx-container[jax="CHTML"][display="true"]'
      );
      mjxContainer.forEach(function (container) {
        container.style.textAlign = "left";
      });

      const mjxMtd = document.querySelectorAll("mjx-mtd");
      mjxMtd.forEach(function (mtd) {
        mtd.style.textAlign = "left";
      });
    });
  });

  let toolBar = document.createElement("div");
  toolBar.classList.add("toolbar");
  symbols.forEach(({ symbol, label }) => {
    let button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", () => {
      let cursorPos = inputTraLoi.selectionStart;
      let textBefore = inputTraLoi.value.substring(0, cursorPos);
      let textAfter = inputTraLoi.value.substring(inputTraLoi.selectionEnd);
      inputTraLoi.value = `${textBefore}${symbol}${textAfter}`;

      // Đặt lại con trỏ sau công thức đã chèn
      inputTraLoi.selectionStart = inputTraLoi.selectionEnd =
        cursorPos + symbol.length;
      inputTraLoi.focus();

      let input = inputTraLoi.value;
      let formattedInput = input.replace(/ /g, "\\ "); // Thay thế dấu cách thành \
      formattedInput = formattedInput.replace(/\n/g, "\\\\"); // Thay dấu xuống dòng thành \\ trong LaTeX
      let mathFormula = `\\begin{gather} ${formattedInput} \\end{gather}`;
      outputTraLoi.innerHTML = `\\[ ${mathFormula} \\]`;

      // Sử dụng MathJax để hiển thị công thức
      MathJax.typesetPromise([outputTraLoi]).then(() => {
        // Đảm bảo rằng các phần tử MathJax được căn lề trái
        const mjxContainer = document.querySelectorAll(
          'mjx-container[jax="CHTML"][display="true"]'
        );
        mjxContainer.forEach(function (container) {
          container.style.textAlign = "left";
        });

        const mjxMtd = document.querySelectorAll("mjx-mtd");
        mjxMtd.forEach(function (mtd) {
          mtd.style.textAlign = "left";
        });
      });
    });
    toolBar.appendChild(button);
  });

  const matchedResult = data.result.find((result) => result.Cau === i + 1); // Tìm kết quả dựa trên số câu
  if (matchedResult) {
    inputTraLoi.innerText = matchedResult.ChiTiet;
  }

  let buttonNopBai = document.createElement("button");
  buttonNopBai.classList.add("button-nopbai");
  buttonNopBai.textContent = "Nộp bài"; // Nội dung của nút
  buttonNopBai.style.display = "none"; // Ẩn nút nộp bài ban đầu
  buttonNopBai.style.display = "block";

  // Tạo phần hiển thị thông báo
  let notification = document.createElement("div");
  notification.classList.add("notification");

  container_hoitrl.appendChild(toolBar);
  container_hoitrl.appendChild(inputTraLoi);
  container_hoitrl.appendChild(outputTraLoi);
  container_hoitrl.appendChild(notification);
  container_hoitrl.appendChild(buttonNopBai);

  buttonNopBai.addEventListener("click", async () => {
    buttonNopBai.disabled = true; // Disable the button
    buttonNopBai.textContent = "Đang nộp..."; // Update button text

    try {
      const result = await process(inputTraLoi.value, i, "/thi/submitsql"); // Call the process function
      notification.textContent = "";
      if (result.success) {
        notification.textContent = "Nộp thành công"; // Failure notification
        notification.style.color = "green"; // Set notification text color to red
      } else {
        notification.textContent = "Nộp thất bại"; // Failure notification
        notification.style.color = "red"; // Set notification text color to red
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      notification.textContent = "Nộp thất bại"; // Failure notification if there's an error
      notification.style.color = "red"; // Set notification text color to red
    }

    buttonNopBai.disabled = false; // Re-enable the button
    buttonNopBai.textContent = "Nộp bài"; // Update button text back to original
  });

  // Thêm container cho câu hỏi vào DOM
  cauhoi.appendChild(container_hoitrl);
}

let trangthai = document.getElementById("trangthai");

const process = async (value, i, apiUrl) => {
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
      // fetch('/thi/submitsql', {
      fetch("/thi/submittuluan", {
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
    const responseData = await response.json();
    console.log("Response data:", responseData);
    // Return success if no error
    return {
      success: true,
    };
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return { success: false }; // Return failure
  }
};

var timer = setInterval(async () => {
  currentTime = new Date();
  adjustedTime = new Date(currentTime.getTime() + offsetHours * 60 * 60 * 1000);
  var distance = data.time - adjustedTime.getTime();

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
  question.innerHTML = `<p class='sent' id='question-dialog'>${content}</p>`;
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
