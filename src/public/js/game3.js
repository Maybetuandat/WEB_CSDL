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

  // Tạo ô nhập liệu cho câu trả lời
  // let inputTraLoi = document.createElement("textarea"); // Sử dụng <textarea> cho input nhiều dòng
  // inputTraLoi.classList.add("input-traloi");
  // inputTraLoi.placeholder = "Nhập câu trả lời của bạn";

  let inputTraLoi = document.createElement("div");
  inputTraLoi.contentEditable = true; // Cho phép chỉnh sửa nội dung
  inputTraLoi.classList.add("mysql-editor");
  inputTraLoi.placeholder = "Nhập câu trả lời của bạn";
  inputTraLoi.style.display = "none";
  container_hoitrl.appendChild(inputTraLoi);

  // Thêm sự kiện xử lý cú pháp SQL
  inputTraLoi.addEventListener("input", () => {
    const keywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "INSERT",
      "UPDATE",
      "DELETE",
      "CREATE",
      "DROP",
      "TABLE",
      "JOIN",
      "LEFT",
      "RIGHT",
      "INNER",
      "OUTER",
      "ORDER",
      "BY",
      "GROUP",
      "HAVING",
      "LIMIT",
      "OFFSET",
      "DISTINCT",
    ];

    let content = inputTraLoi.innerText; // Lấy nội dung
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      content = content.replace(
        regex,
        (match) => `<span class="keyword">${match}</span>`
      );
    });

    inputTraLoi.innerHTML = content; // Cập nhật nội dung đã tô màu
    placeCaretAtEnd(inputTraLoi); // Đặt con trỏ về cuối
  });

  let outputTraLoi = document.createElement("div"); // Sử dụng <textarea> cho input nhiều dòng
  outputTraLoi.classList.add("output-traloi");
  outputTraLoi.id = "output-traloi" + i;

  // Tạo nút hiển thị nhập liệu và kết quả
  let buttonBar = document.createElement("div");
  buttonBar.classList.add("button-bar");
  let showAnswerButton = document.createElement("button");
  showAnswerButton.textContent = "Hiện Editor & Output";
  showAnswerButton.classList.add("button-nopbai");

  // Thêm nút nộp bài
  let buttonRun = document.createElement("button");
  buttonRun.classList.add("button-nopbai");
  buttonRun.textContent = "Run"; // Nội dung của nút
  buttonRun.style.display = "none"; // Ẩn nút nộp bài ban đầu
  // container_hoitrl.appendChild(buttonRun);
  let buttonNopBai = document.createElement("button");
  buttonNopBai.classList.add("button-nopbai");
  buttonNopBai.textContent = "Nộp bài"; // Nội dung của nút
  buttonNopBai.style.display = "none"; // Ẩn nút nộp bài ban đầu

  buttonBar.appendChild(showAnswerButton);
  buttonBar.appendChild(buttonRun);
  buttonBar.appendChild(buttonNopBai);

  // Tạo phần hiển thị thông báo
  let notification = document.createElement("div");
  notification.classList.add("notification");

  let notification2 = document.createElement("div");
  notification2.classList.add("notification");

  container_hoitrl.appendChild(buttonBar);
  container_hoitrl.appendChild(inputTraLoi);
  container_hoitrl.appendChild(outputTraLoi);
  buttonBar.appendChild(notification);
  outputTraLoi.appendChild(notification2);

  // Thêm sự kiện khi nhấn nút "Hiển thị câu trả lời và kết quả"
  let isVisible = false;
  showAnswerButton.addEventListener("click", async () => {
    isVisible = !isVisible; // Đảo trạng thái
    if (isVisible) {
      inputTraLoi.style.display = "block";
      outputTraLoi.style.display = "block";
      buttonRun.style.display = "block";
      buttonNopBai.style.display = "block";
    } else {
      inputTraLoi.style.display = "none";
      outputTraLoi.style.display = "none";
      buttonRun.style.display = "none";
      buttonNopBai.style.display = "none";
    }
  });

  const matchedResult = data.result.find((result) => result.Cau === i + 1); // Tìm kết quả dựa trên số câu
  if (matchedResult) {
    inputTraLoi.innerText = matchedResult.ChiTiet;
    if (matchedResult.Dung == 0) {
      notification.textContent = "Sai";
      notification.style.color = "red";
    } else {
      notification.textContent = "Đúng";
      notification.style.color = "green";
    }
  }

  buttonNopBai.addEventListener("click", async () => {
    buttonNopBai.disabled = true; // Disable the button
    buttonNopBai.textContent = "Đang nộp..."; // Update button text

    try {
      const result = await process(inputTraLoi.innerText, i, "/thi/submitsql"); // Call the process function
      notification.textContent = "";
      if (result.success) {
        if (result.status) {
          notification.textContent = "Đúng"; // Success notification
          notification.style.color = "green"; // Set notification text color to green
        } else {
          notification.textContent = "Sai"; // Success notification
          notification.style.color = "red"; // Set notification text color to green
        }
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

  // Thêm sự kiện khi nhấn nút nộp bài
  buttonRun.addEventListener("click", async () => {
    buttonRun.disabled = true; // Disable the button
    buttonRun.textContent = "Running..."; // Update button text

    try {
      const result = await process(inputTraLoi.innerText, i, "/thi/runsql"); // Call the process function
      notification2.textContent = "";

      // Xóa bảng cũ nếu đã tồn tại
      let existingTable = document.getElementById("dataTable" + i);
      if (existingTable) {
        existingTable.remove();
      }

      if (result.success) {
        if (result.data.length == 0)
          notification2.textContent = "Không có bản ghi nào";

        // Tạo bảng mới
        const dataTable = document.createElement("table");
        dataTable.id = "dataTable" + i;
        dataTable.style.borderCollapse = "collapse"; // Collapse borders
        dataTable.style.width = "100%"; // Set table width to 100%

        // Tạo tiêu đề bảng
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        // Lấy các trường từ đối tượng đầu tiên trong dữ liệu để tạo tiêu đề
        const headers =
          result.data && result.data.length > 0
            ? Object.keys(result.data[0])
            : [];

        // Tạo các tiêu đề
        headers.forEach((headerText) => {
          const th = document.createElement("th");
          th.textContent = headerText; // Tiêu đề từ các trường trong dữ liệu
          th.style.border = "1px solid #ccc"; // Thêm border cho tiêu đề
          th.style.padding = "8px"; // Thêm padding
          th.style.textAlign = "left"; // Căn trái cho tiêu đề
          th.style.color = "white";
          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        dataTable.appendChild(thead);

        // Tạo phần thân bảng
        const tbody = document.createElement("tbody");

        // Duyệt qua từng đối tượng trong dữ liệu để tạo hàng
        result.data.forEach((item) => {
          const row = document.createElement("tr");

          // Duyệt qua từng trường của đối tượng và tạo ô
          headers.forEach((header) => {
            const cell = document.createElement("td");
            cell.textContent = item[header]; // Lấy giá trị từ trường tương ứng
            cell.style.border = "1px solid #ccc"; // Thêm border cho ô
            cell.style.padding = "8px"; // Thêm padding
            cell.style.color = "white";
            row.appendChild(cell);
          });

          // Thêm hàng vào phần thân bảng
          tbody.appendChild(row);
        });

        dataTable.appendChild(tbody);
        outputTraLoi.appendChild(dataTable);
      } else {
        notification2.textContent = "Run thất bại"; // Failure notification
        notification2.style.color = "red"; // Set notification text color to red
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      notification2.textContent = "Run thất bại"; // Failure notification if there's an error
      notification2.style.color = "red"; // Set notification text color to red
    }

    buttonRun.disabled = false; // Re-enable the button
    buttonRun.textContent = "Run"; // Update button text back to original
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
      // fetch("/thi/submitsql", {
      fetch(apiUrl, {
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
      data: apiUrl == "/thi/runsql" ? responseData.result : null,
      status: responseData.status,
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

// Hàm đặt con trỏ về cuối
function placeCaretAtEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}
