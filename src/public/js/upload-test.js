var currentNumber = 1;
// document.getElementById('fileOption').addEventListener('change', function () {

//     var fileOption = this.value;
//     var fileUpload = document.getElementById('fileUpload');

//     if (fileOption === 'upload') {
//         fileUpload.style.display = 'block';
//     } else {
//         fileUpload.style.display = 'none';
//     }
// });

function render() {
  var numQuestions = 1;

  var questionsContainer = document.getElementById("questionsContainer");

  // Tạo các ô input cho câu hỏi và đáp án
  for (var i = 1; i <= numQuestions; i++) {
    var questionContent = document.createElement("div");
    questionContent.className = "question-content";
    questionContent.id = i;

    var questionDiv = document.createElement("div");
    questionDiv.className = "question-container";

    var questionTitle = document.createElement("div");
    questionTitle.className = "question-title";

    // new
    var deleteQuestionButton = document.createElement("div");
    deleteQuestionButton.className = "delete-question";

    var iconDelete = document.createElement("i");
    iconDelete.className = "ti-close";
    deleteQuestionButton.appendChild(iconDelete);
    deleteQuestionButton.onclick = function () {
      DeleteQuestion(this.parentNode.parentNode.id);
    };

    questionDiv.appendChild(deleteQuestionButton);

    //old
    var questionLabel = document.createElement("label");
    questionLabel.textContent = "Câu hỏi " + ":";

    var questionInput = document.createElement("textarea");
    questionInput.cols = 140;
    questionInput.rows = 3;
    questionInput.id = "question" + i;

    questionTitle.appendChild(questionLabel);
    questionTitle.appendChild(questionInput);
    questionDiv.appendChild(questionTitle);
    questionContent.appendChild(questionDiv);
    // Tạo 4 ô input cho 4 đáp án và checkbox cho đáp án đúng

    for (var j = 1; j <= 4; j++) {
      var answerDiv = document.createElement("div");
      answerDiv.className = "answer-container";

      var answerCheckbox = document.createElement("div");
      answerCheckbox.className = "checkbox";
      answerCheckbox.id = i + "checkbox" + j;
      answerCheckbox.onclick = function () {
        toggleCheckbox(this.id);
      };
      answerCheckbox.textContent = String.fromCharCode(
        "A".charCodeAt(0) + j - 1
      );

      var answerInput = document.createElement("textarea");
      answerInput.cols = "140";
      answerInput.rows = "1";
      answerInput.name = "question" + i + "answer" + j;
      answerInput.id = "question" + i + "answer" + j;

      answerDiv.appendChild(answerCheckbox);
      answerDiv.appendChild(answerInput);

      questionContent.appendChild(answerDiv);
      questionsContainer.appendChild(questionContent);
    }
  }

  document.getElementById("numQuestions").value =
    parseInt(document.getElementById("numQuestions").value) + 1;
}

function render2(questionsAndAnswers) {
  var questionsContainer = document.getElementById("questionsContainer");

  // Xóa các câu hỏi cũ trước khi tạo mới
  questionsContainer.innerHTML = "";

  // Tạo các ô input cho câu hỏi và đáp án từ mảng questionsAndAnswers
  questionsAndAnswers.forEach((qna, index) => {
    var i = index + 1;

    var questionContent = document.createElement("div");
    questionContent.className = "question-content";
    questionContent.id = "questionContent" + i;

    var questionDiv = document.createElement("div");
    questionDiv.className = "question-container";

    var questionTitle = document.createElement("div");
    questionTitle.className = "question-title";

    // Nút xóa câu hỏi
    var deleteQuestionButton = document.createElement("div");
    deleteQuestionButton.className = "delete-question";

    var iconDelete = document.createElement("i");
    iconDelete.className = "ti-close";
    deleteQuestionButton.appendChild(iconDelete);
    deleteQuestionButton.onclick = function () {
      DeleteQuestion(this.parentNode.parentNode.id);
    };

    questionDiv.appendChild(deleteQuestionButton);

    // Nhãn và ô nhập câu hỏi
    var questionLabel = document.createElement("label");
    questionLabel.textContent = "Câu hỏi " + i + ":";

    var questionInput = document.createElement("textarea");
    questionInput.cols = 140;
    questionInput.rows = 3;
    questionInput.id = "question" + i;
    questionInput.value = qna.question; // Điền câu hỏi vào ô input

    questionTitle.appendChild(questionLabel);
    questionTitle.appendChild(questionInput);
    questionDiv.appendChild(questionTitle);
    questionContent.appendChild(questionDiv);

    // Tạo các ô input cho đáp án và checkbox cho đáp án đúng
    for (var j = 0; j < 4; j++) {
      var answerDiv = document.createElement("div");
      answerDiv.className = "answer-container";

      var answerCheckbox = document.createElement("div");
      answerCheckbox.className = "checkbox";
      answerCheckbox.id = i + "checkbox" + (j + 1);
      answerCheckbox.onclick = function () {
        toggleCheckbox(this.id);
      };
      answerCheckbox.textContent = String.fromCharCode("A".charCodeAt(0) + j);

      var answerInput = document.createElement("textarea");
      answerInput.cols = "140";
      answerInput.rows = "1";
      answerInput.name = "question" + i + "answer" + (j + 1);
      answerInput.id = "question" + i + "answer" + (j + 1);
      answerInput.value = qna.answers[j] || ""; // Điền đáp án vào ô input

      answerDiv.appendChild(answerCheckbox);
      answerDiv.appendChild(answerInput);

      questionContent.appendChild(answerDiv);
    }

    questionsContainer.appendChild(questionContent);
  });
}

document
  .getElementById("excel-file")
  .addEventListener("change", function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var questionsContainer = document.getElementById("questionsContainer");

    // Xóa các câu hỏi cũ trước khi tạo mới
    questionsContainer.innerHTML = "";

    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      var excelData = XLSX.utils.sheet_to_json(firstSheet);

      // questionInput.value = row.question;
      // answerInput.value = row['answer' + j];
      currentNumber = excelData.length + 1;

      // Xử lý dữ liệu từ tệp Excel và tạo các trường input câu hỏi và đáp án
      excelData.forEach(function (row, index) {
        var questionContent = document.createElement("div");
        questionContent.className = "question-content";
        questionContent.id = parseInt(index + 1) + 1;

        var questionDiv = document.createElement("div");
        questionDiv.className = "question-container";

        var questionTitle = document.createElement("div");
        questionTitle.className = "question-title";

        // new
        var deleteQuestionButton = document.createElement("div");
        deleteQuestionButton.className = "delete-question";

        var iconDelete = document.createElement("i");
        iconDelete.className = "ti-close";
        deleteQuestionButton.appendChild(iconDelete);
        deleteQuestionButton.onclick = function () {
          DeleteQuestion(this.parentNode.parentNode.id);
        };

        questionDiv.appendChild(deleteQuestionButton);

        //old
        var questionLabel = document.createElement("label");
        questionLabel.textContent = "Câu hỏi " + ":";

        var questionInput = document.createElement("textarea");
        questionInput.cols = 140;
        questionInput.rows = 3;
        questionInput.value = row.question;
        questionInput.id = "question" + parseInt(index + 1);

        questionTitle.appendChild(questionLabel);
        questionTitle.appendChild(questionInput);
        questionDiv.appendChild(questionTitle);
        questionContent.appendChild(questionDiv);
        // Tạo 4 ô input cho 4 đáp án và checkbox cho đáp án đúng

        for (var j = 1; j <= 4; j++) {
          var answerDiv = document.createElement("div");
          answerDiv.className = "answer-container";

          var answerCheckbox = document.createElement("div");
          answerCheckbox.className = "checkbox";
          answerCheckbox.id = parseInt(index + 1) + "checkbox" + j;
          answerCheckbox.onclick = function () {
            toggleCheckbox(this.id);
          };
          answerCheckbox.textContent = String.fromCharCode(
            "A".charCodeAt(0) + j - 1
          );

          var answerInput = document.createElement("textarea");
          answerInput.cols = "140";
          answerInput.rows = "1";
          answerInput.value = row["answer" + j];
          answerInput.id = "question" + parseInt(index + 1) + "answer" + j;
          answerInput.name = "question" + parseInt(index + 1) + "answer" + j;

          answerDiv.appendChild(answerCheckbox);
          answerDiv.appendChild(answerInput);

          questionContent.appendChild(answerDiv);
          questionsContainer.appendChild(questionContent);
        }
      });

      excelData.forEach(function (row, index) {
        for (var i = 1; i <= 4; i++) {
          if (row["correct"] == i) {
            toggleCheckbox(parseInt(index + 1) + "checkbox" + i);
          }
        }
      });
      document.getElementById("numQuestions").value = excelData.length;
    };
    reader.readAsArrayBuffer(file); //đọc xong mới xử lý onload()
  });

function Add() {
  var questionsContainer = document.getElementById("questionsContainer");

  var questionContent = document.createElement("div");
  questionContent.className = "question-content";
  questionContent.id = currentNumber;

  var questionDiv = document.createElement("div");
  questionDiv.className = "question-container";

  var questionTitle = document.createElement("div");
  questionTitle.className = "question-title";

  // new
  var deleteQuestionButton = document.createElement("div");
  deleteQuestionButton.className = "delete-question";

  var iconDelete = document.createElement("i");
  iconDelete.className = "ti-close";
  deleteQuestionButton.appendChild(iconDelete);
  deleteQuestionButton.onclick = function () {
    DeleteQuestion(this.parentNode.parentNode.id);
  };

  questionDiv.appendChild(deleteQuestionButton);

  var questionLabel = document.createElement("label");
  questionLabel.textContent = "Câu hỏi " + currentNumber + ":";

  var questionInput = document.createElement("textarea");
  questionInput.cols = 70;
  questionInput.rows = 4;

  questionTitle.appendChild(questionLabel);
  questionTitle.appendChild(questionInput);

  questionDiv.appendChild(questionTitle);
  questionContent.appendChild(questionDiv);
  // Tạo 4 ô input cho 4 đáp án và checkbox cho đáp án đúng

  for (var j = 1; j <= 4; j++) {
    var answerDiv = document.createElement("div");
    answerDiv.className = "answer-container";

    var answerCheckbox = document.createElement("div");
    answerCheckbox.className = "checkbox";
    answerCheckbox.id = currentNumber + "checkbox" + j;
    answerCheckbox.onclick = function () {
      toggleCheckbox(this.id);
    };
    answerCheckbox.textContent = String.fromCharCode("A".charCodeAt(0) + j - 1);

    var answerInput = document.createElement("textarea");
    answerInput.cols = "70";
    answerInput.rows = "1";
    answerInput.name = "question" + currentNumber + "answer" + j;

    answerDiv.appendChild(answerCheckbox);
    answerDiv.appendChild(answerInput);

    questionContent.appendChild(answerDiv);
  }

  questionsContainer.appendChild(questionContent);
  currentNumber++;
}

function toggleCheckbox(idElement) {
  var element = document.getElementById(idElement);
  if (!element.classList.contains("checked")) {
    element.classList.add("checked");
  } else {
    element.classList.remove("checked");
  }

  if (element.style.backgroundColor === "green") {
    element.style.backgroundColor = "transparent";
  } else {
    element.style.backgroundColor = "green";
  }
}

function hideAlert() {
  document.getElementById("myAlert").style.display = "none";
}

function showAlert(content, color = "#f8d7da") {
  document.getElementById("alertContent").textContent = content;
  document.getElementById("myAlert").style.display = "block";
  document.getElementById("myAlert").style.backgroundColor = color;
  setTimeout(hideAlert, 5000);
}

async function uploadImageWithRetry(url, options, retries = 3, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      if (i === retries - 1) {
        throw error; // Throw the error if it's the last retry
      }
      console.error(`Upload failed, retrying... (${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
}

function formatDatetime(date) {
  // Chuyển đổi giờ UTC sang giờ Việt Nam (UTC+7)
  const vietnamOffset = 7 * 60; // 7 giờ * 60 phút
  const localDate = new Date(date.getTime() - vietnamOffset * 60 * 1000);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function Save() {
  let createTestSuccess = true;
  const backendURL = "/api/new-question";
  const mbt = document.getElementById("examID").value;
  var questionNum = parseInt(document.getElementById("numQuestions").value);
  if (questionNum == 0) {
    showAlert("Số câu hỏi đang là 0");
    return;
  }
  showLoading();
  for (var i = 1; i <= questionNum; i++) {
    var answer = [];
    var check = "";
    var questionContent = document.getElementById("question" + i).value;
    if (questionContent === "") {
      showAlert("Vui lòng nhập đề bài cho câu hỏi " + i);
      return;
    }
    for (var j = 1; j <= 4; j++) {
      if (
        document
          .getElementById(i + "checkbox" + j)
          .classList.contains("checked")
      ) {
        check = j;
      }
      var ans = document.getElementById("question" + i + "answer" + j).value;
      if (ans === "") {
        showAlert("Bạn chưa nhập đáp án cho câu hỏi " + i);
        return;
      }
      answer.push(ans);
    }
    if (check === "") {
      showAlert("Bạn chưa chọn đáp án đúng cho câu hỏi " + i);
      return;
    }
    let question = {
      questionContent: questionContent,
      answer1: answer[0],
      answer2: answer[1],
      answer3: answer[2],
      answer4: answer[3],
      check: check,
    };
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mbt, question }),
    };

    let retry = 3;
    let createQuestionSuccess = false;
    while (retry--) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(backendURL, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // const data = await response.json();
        // hideLoading();
        // window.location.href = "/test";
        createQuestionSuccess = true;
        break; // Thoát vòng lặp nếu thành công
      } catch (error) {
        console.error("Đã xảy ra lỗi khi gửi dữ liệu đến backend:", error);
      }
    }
    if (createQuestionSuccess == false) {
      createTestSuccess = false;
      hideLoading();
      showAlert("Đã xảy ra lỗi, hãy tạo bài thi mới !!!");
      break;
    }
  }
  if (createTestSuccess == true) {
    hideLoading();
    showAlert("Đã lưu danh sách câu hỏi thành công !!!", "#cce5ff");
    window.location.href = "/admin/test";
  }
}

async function Save2() {
  const buttonCreateExam = document.getElementById("createExamBtn");
  buttonCreateExam.disabled = true;
  setTimeout(() => {
    // Khôi phục lại nút bấm sau 3 giây
    buttonCreateExam.disabled = false;
  }, 2000);

  if (
    !document.getElementById("examName").value ||
    !document.getElementById("examTime").value
  ) {
    showAlert("Vui lòng nhập đủ tên bài thi và thời gian làm bài !!!");
    return;
  }

  var formData = {
    examDateTime: "2024-12-31 23:59:59",
    examName: document.getElementById("examName").value,
    examTime: document.getElementById("examTime").value,
    numQuestions: 0,
    imageUrl:
      "https://res.cloudinary.com/dyc1c2elf/image/upload/v1714894653/hpz5yqojda1ajpnrpkvv.jpg",
    examDescription: document.getElementById("examDescription").value,
    examStatus: document.getElementById("examStatus").value,
  };

  const backendURL = "/api/new-test2";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata: formData }),
  };

  const controller = new AbortController();
  const timeout = 300000; // 5 minutes
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    showLoading();
    const response = await fetch(backendURL, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    hideLoading();
    showAlert("Đã lưu bài thi thành công !!!", "#cce5ff");
    document.getElementById("examID").value = data.mabaithi;
    document.getElementById("examName").disabled = true;
    document.getElementById("examTime").disabled = true;
    document.getElementById("examDescription").disabled = true;
    document.getElementById("examStatus").disabled = true;

    // window.location.href = "/test";
  } catch (error) {
    showAlert("Đã xảy ra lỗi !!!");
    console.error("Đã xảy ra lỗi khi gửi dữ liệu đến backend:", error);
  }
}

function DeleteQuestion(id) {
  var element = document.getElementById(id);
  UpDateIdForQuestion(id);
  element.remove();
}

function UpDateIdForQuestion(id) {
  for (var i = parseInt(id) + 1; i < currentNumber; i++) {
    var element = document.getElementById(i);

    if (element) {
      var oldId = i.toString();
      element.id = i - 1;
      var questionLabels = element.querySelectorAll("label");
      questionLabels[0].textContent = "Câu hỏi " + element.id + ":";
      for (var j = 1; j <= 4; j++) {
        var oldCheckBoxId = oldId + "checkbox" + j;
        var checkbox = document.getElementById(oldCheckBoxId);
        if (checkbox) {
          checkbox.id = element.id + "checkbox" + j;
        }
      }
    }
  }
  currentNumber--;
}

function openDialog(content) {
  // localStorage.setItem('setTime', 0);
  var dialogOverlay = document.getElementById("dialogOverlay");
  var dialogContent = document.getElementById("dialogContent");
  // var content1 = document.getElementById('content-dialog');
  var question = document.getElementById("question-dialog");
  // var btnContinue = document.getElementById('btn-continue');
  question.innerHTML = `<p class="sent" id="question-dialog">${content}</p>`;
  // content1.textContent = tittle;
  // btnContinue.onclick = func;
  dialogOverlay.style.display = "block";
  dialogContent.style.display = "flex";
}

// Hàm đóng dialog
function closeDialog() {
  // localStorage.setItem('setTime', 1);
  var dialogOverlay = document.getElementById("dialogOverlay");
  var dialogContent = document.getElementById("dialogContent");
  dialogOverlay.style.display = "none";
  dialogContent.style.display = "none";
}

// Xử lý sự kiện click vào nút dropdown
document.querySelector(".dropbtn").addEventListener("click", function () {
  const dropdownContent = document.querySelector(".dropdown-content");
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none";
  } else {
    dropdownContent.style.display = "block";
  }
});

// Ẩn dropdown nếu click ra ngoài
window.addEventListener("click", function (event) {
  if (!event.target.matches(".dropbtn")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
});
