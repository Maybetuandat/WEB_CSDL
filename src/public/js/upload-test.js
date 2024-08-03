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
  var num = document.getElementById("numQuestions").value;
  if (num === "") {
    showAlert("Bạn chưa nhập số câu hỏi");
    return;
  }
  var numQuestions = parseInt(num);

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
    questionLabel.textContent = "Câu hỏi " + i + ":";

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
        questionLabel.textContent =
          "Câu hỏi " + (parseInt(index + 1) + parseInt(1)) + ":";

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
            // //console.log(i);
            toggleCheckbox(parseInt(index + 1) + "checkbox" + i);
          }
        }
      });
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

function showAlert(content) {
  document.getElementById("alertContent").textContent = content;
  document.getElementById("myAlert").style.display = "block";
  setTimeout(hideAlert, 3000);
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

async function Save() {
  const currentDatetime = new Date();
  const formattedDatetime = formatDatetime(currentDatetime);

  var formData = {
    examName: document.getElementById("examName").value,
    examDateTime: formattedDatetime,
    examTime: document.getElementById("examTime").value,
    numQuestions: document.getElementById("numQuestions").value,
    imageUrl:
      "https://res.cloudinary.com/dyc1c2elf/image/upload/v1714894653/hpz5yqojda1ajpnrpkvv.jpg",
    examDescription: document.getElementById("examDescription").value,
    examStatus: document.getElementById("examStatus").value,
  };

  if (!formData.numQuestions || !formData.examTime || !formData.examName) {
    showAlert("Vui lòng điền đầy đủ thông tin cho bài thi");
    return;
  }

  var questions = [];

  var questionNum = formData.numQuestions;
  if (questionNum === 0) {
    showAlert("Số câu hỏi đang là 0");
    return;
  }

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
    questions.push({
      questionContent: questionContent,
      answer1: answer[0],
      answer2: answer[1],
      answer3: answer[2],
      answer4: answer[3],
      check: check,
    });
  }

  var newImageUrl =
    "https://res.cloudinary.com/dyc1c2elf/image/upload/v1714894653/hpz5yqojda1ajpnrpkvv.jpg";
  var fileInput = document.getElementById("image-file");
  var file = fileInput.files[0];
  console.log(file);
  if (file) {
    var formImg = new FormData();
    formImg.append("file", file);
    const url = "/test/cloudinary-upload1";
    const options = {
      method: "POST",
      body: formImg,
    };
    try {
      var loading = document.getElementById("loading");
      loading.style.display = "block";
      const data = await uploadImageWithRetry(url, options);
      const newImageUrl = data.img_url;
      console.log(newImageUrl);
      formData.imageUrl = newImageUrl;
    } catch (error) {
      console.error("Error:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
    }
  }
  //console.log(newImageUrl)

  const backendURL = "/api/new-test";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata: formData, data: questions }),
  };

  try {
    showLoading();
    const response = await fetch(backendURL, options);
    if (!response.ok) {
      throw new Error("Có lỗi xảy ra khi gửi yêu cầu: " + response.status);
    }
    const data = await response.json();
    hideLoading();
    console.log("phản hồi: ", data);
    if (data.code == 2) {
      openDialog("Bài thi chứa từ ngữ không hợp lệ, vui lòng kiểm tra lại !!!");
    } else window.location.href = "/admin/test";
    const invalidWordsList = document.getElementById("invalidWordsList");
    invalidWordsList.textContent = null;
    data.data.forEach((word) => {
      const wordElement = document.createElement("p");
      wordElement.textContent = word;
      wordElement.setAttribute("data-word", word);
      invalidWordsList.appendChild(wordElement);
    });
    const contentElements = document.querySelectorAll(
      'textarea, input[type="text"]'
    );
    for (const element of contentElements) {
      element.style.backgroundColor = "";
    }
    // Xử lý sự kiện click vào từ không hợp lệ
    invalidWordsList.addEventListener("click", function (event) {
      console.log(event.target.tagName);
      if (event.target.tagName === "P") {
        const word = event.target.getAttribute("data-word");
        console.log("word:", word);
        const contentElements = document.querySelectorAll(
          'textarea, input[type="text"]'
        );
        let scroll = false;
        for (const element of contentElements) {
          element.style.backgroundColor = "";
          if (
            element.textContent.includes(word) ||
            (element.value && element.value.includes(word))
          ) {
            if (scroll == false) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            element.style.backgroundColor = "yellow"; // Tô màu nền để dễ thấy
            scroll = true;
          }
        }
      }
    });
    // window.location.href = "/test";
  } catch (error) {
    showAlert("Đã xảy ra lỗi !!!");
    console.error("Đã xảy ra lỗi khi gửi dữ liệu đến backend:", error);
  }
}

function DeleteQuestion(id) {
  var element = document.getElementById(id);
  //console.log(element);
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
  //console.log('click');
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
