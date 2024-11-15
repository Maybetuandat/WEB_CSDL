var currentNumber = 1;
document.getElementById("fileOption").addEventListener("change", function () {
  var fileOption = this.value;
  var fileUpload = document.getElementById("fileUpload");

  if (fileOption === "upload") {
    fileUpload.style.display = "block";
  } else {
    fileUpload.style.display = "none";
  }
});

// Hiển thị trạng thái loading khi bắt đầu yêu cầu
function showLoading() {
  var loading = document.getElementById("loading");
  loading.style.display = "block";
}

// Ẩn trạng thái loading khi kết thúc yêu cầu
function hideLoading() {
  var loading = document.getElementById("loading");
  loading.style.display = "none";
}

function render(questions) {
  var numQuestions = questions.length;
  var questionsContainer = document.getElementById("questionsContainer");

  // Xóa các câu hỏi cũ trước khi tạo mới
  questionsContainer.innerHTML = "";
  currentNumber = numQuestions + 1;

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
    var actionBar = document.createElement("div");
    actionBar.style.display = "flex";
    actionBar.style.flexDirection = "row";
    var deleteQuestionButton = document.createElement("div");
    deleteQuestionButton.className = "delete-question";

    var iconDelete = document.createElement("i");
    iconDelete.textContent = "Xóa";
    deleteQuestionButton.appendChild(iconDelete);

    var openEditQuestionButton = document.createElement("div");
    openEditQuestionButton.className = "open-edit-question";

    var iconOpen = document.createElement("i");
    iconOpen.textContent = "Sửa";
    openEditQuestionButton.appendChild(iconOpen);

    var saveEditQuestionButton = document.createElement("div");
    saveEditQuestionButton.className = "save-edit-question";
    saveEditQuestionButton.id = "save-edit-question";

    var iconSave = document.createElement("i");
    iconSave.textContent = "Lưu";
    saveEditQuestionButton.appendChild(iconSave);

    deleteQuestionButton.onclick = function () {
      DeleteQuestion(this.parentNode.parentNode.id);
    };
    openEditQuestionButton.onclick = function () {
      openEdit(this.parentNode.parentNode.parentNode.id);
    };
    saveEditQuestionButton.onclick = function () {
      SaveEditQuestion(
        document.getElementById("examID").value,
        this.parentNode.parentNode.parentNode.id
      );
    };

    // actionBar.appendChild(deleteQuestionButton);
    actionBar.appendChild(openEditQuestionButton);
    actionBar.appendChild(saveEditQuestionButton);
    questionDiv.appendChild(actionBar);

    //old
    var questionLabel = document.createElement("label");
    questionLabel.textContent = "Câu hỏi " + i + ":";

    var questionInput = document.createElement("textarea");
    questionInput.cols = 140;
    questionInput.rows = 3;
    questionInput.id = "question" + i;
    questionInput.value = questions[i - 1].DeBai;
    questionInput.disabled = true;

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
      answerCheckbox.style.pointerEvents = "none";

      var answerInput = document.createElement("textarea");
      answerInput.disabled = true;
      answerInput.cols = "140";
      answerInput.rows = "1";
      answerInput.name = "question" + i + "answer" + j;
      answerInput.id = "question" + i + "answer" + j;
      answerInput.value = questions[i - 1].LuaChon[j - 1].NoiDung;

      if (questions[i - 1].LuaChon[j - 1].Dung == 1) {
        answerCheckbox.classList.add("checked");
      }

      answerDiv.appendChild(answerCheckbox);
      answerDiv.appendChild(answerInput);

      questionContent.appendChild(answerDiv);
      questionsContainer.appendChild(questionContent);
    }
  }
}

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
  for (let i = 1; i <= 4; i++) {
    let otherElement = document.getElementById(
      idElement.substring(0, idElement.length - 1) + i.toString()
    );
    otherElement.classList.remove("checked");
    otherElement.style.backgroundColor = "transparent";
  }
  element.classList.add("checked");
}

function hideAlert() {
  document.getElementById("myAlert").style.display = "none";
}

function showAlert(content) {
  if (content != null) {
    document.getElementById("alertContent").textContent = content;
    document.getElementById("myAlert").style.display = "block";
    setTimeout(hideAlert, 3000);
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

async function SaveEdit(id) {
  const buttonCreateExam = document.getElementById("editExamBtn");
  buttonCreateExam.disabled = true;
  setTimeout(() => {
    // Khôi phục lại nút bấm sau 3 giây
    buttonCreateExam.disabled = false;
  }, 2000);

  var formData = {
    examName: document.getElementById("examName").value,
    examTime: document.getElementById("examTime").value,
    examDescription: document.getElementById("examDescription").value,
    examStatus: document.getElementById("examStatus").value,
  };

  if (!formData.examName || !formData.examTime) {
    showAlert("Vui lòng điền đầy đủ thông tin cho bài thi");
    return;
  }

  const backendURL = "/api/update-test/" + id;
  const options = {
    method: "PUT",
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
  } catch (error) {
    showAlert("Đã xảy ra lỗi !!!");
    console.error("Đã xảy ra lỗi khi gửi dữ liệu đến backend:", error);
  }
}

async function SaveEditQuestion(testId, questionId) {
  const buttonCreateExam = document.getElementById("save-edit-question");
  buttonCreateExam.disabled = true;
  setTimeout(() => {
    // Khôi phục lại nút bấm sau 3 giây
    buttonCreateExam.disabled = false;
  }, 2000);

  const question = document.getElementById("question" + questionId).value;
  const options = [];
  for (let i = 1; i <= 4; i++) {
    let ans = document.getElementById(
      "question" + questionId + "answer" + i.toString()
    ).value;
    let right = 0;
    if (
      document
        .getElementById(questionId + "checkbox" + i.toString())
        .classList.contains("checked")
    ) {
      right = 1;
    }
    const op = { ans, right };
    options.push(op);
  }

  const backendURL = "/api/update-test/" + testId + "/" + questionId;
  const option = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, options }),
  };

  const controller = new AbortController();
  const timeout = 300000; // 5 minutes
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    showLoading();
    const response = await fetch(backendURL, {
      ...option,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    hideLoading();
    var element = document.getElementById(questionId);
    var questionInputs = element.querySelectorAll("textarea");
    for (var i = 0; i < questionInputs.length; i++) {
      questionInputs[i].disabled = true;
    }
    var checkboxes = element.querySelectorAll(".checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].style.pointerEvents = "none";
    }
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

function openEdit(id) {
  var element = document.getElementById(id);
  var questionInputs = element.querySelectorAll("textarea");
  for (var i = 0; i < questionInputs.length; i++) {
    questionInputs[i].disabled = false;
  }
  var checkboxes = element.querySelectorAll(".checkbox");
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].style.pointerEvents = "auto";
  }
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
