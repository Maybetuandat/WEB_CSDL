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
      if (document.getElementById("examDescription").value === "") {
        showAlert("Vui lòng chọn loại bài thi !!!");
      } else {
        if (
          document.getElementById("examDescription").value === "trắc nghiệm"
        ) {
          workerData(questionsContainer, excelData);
        } else {
          workerData2(questionsContainer, excelData);
        }
      }
    };
    reader.readAsArrayBuffer(file); //đọc xong mới xử lý onload()
  });

function workerData(questionsContainer, excelData) {
  excelData.forEach(function (row, index) {
    var questionContent = document.createElement("div");
    questionContent.className = "question-content";
    questionContent.id = parseInt(index + 1);

    var questionDiv = document.createElement("div");
    questionDiv.className = "question-container";

    var questionTitle = document.createElement("div");
    questionTitle.className = "question-title";

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
  createImageButton();
  document.getElementById("numQuestions").value = excelData.length;
}

function workerData2(questionsContainer, excelData) {
  excelData.forEach(function (row, index) {
    var questionContent = document.createElement("div");
    questionContent.className = "question-content";
    questionContent.id = parseInt(index + 1);

    var questionDiv = document.createElement("div");
    questionDiv.className = "question-container";

    var questionTitle = document.createElement("div");
    questionTitle.className = "question-title";

    //old
    var questionLabel = document.createElement("label");
    questionLabel.textContent = "Câu hỏi " + ":";

    var questionInput = document.createElement("textarea");
    questionInput.cols = 140;
    questionInput.rows = 5;
    questionInput.value = row.question;
    questionInput.id = "question" + parseInt(index + 1);

    var questionType = document.createElement("div");
    questionType.id = "question" + parseInt(index + 1) + "type";
    questionType.textContent = row["type"];

    var labelDiv = document.createElement("div");
    labelDiv.appendChild(questionLabel);
    labelDiv.appendChild(questionType);
    labelDiv.style.display = "flex";
    labelDiv.style.cssText = `
  display: flex;
  gap: 10px;
`;

    questionLabel.style.cssText = `
  font-size: 16px;
`;

    questionType.style.cssText = `
  font-size: 16px;
  color: #007bff;
`;

    // questionTitle.appendChild(questionLabel);
    // questionTitle.appendChild(questionType);
    questionTitle.appendChild(labelDiv);
    questionTitle.appendChild(questionInput);
    questionTitle.style.display = "flex";
    questionTitle.style.flexDirection = "column";

    questionDiv.appendChild(questionTitle);
    questionContent.appendChild(questionDiv);
    // Tạo 4 ô input cho 4 đáp án và checkbox cho đáp án đúng

    var answerDiv = document.createElement("div");
    answerDiv.className = "answer-container";

    var answerInput = document.createElement("textarea");
    answerInput.cols = "140";
    answerInput.rows = "3";
    answerInput.value = row["answer"];
    answerInput.id = "question" + parseInt(index + 1) + "answer";
    answerInput.name = "question" + parseInt(index + 1) + "answer";

    var answerCheckbox = document.createElement("div");
    // answerCheckbox.className = "checkbox";
    answerCheckbox.innerText = "Đáp án đúng";

    if (
      questionType.textContent == "delete" ||
      questionType.textContent == "create" ||
      questionType.textContent == "update"
    ) {
      var tableDestination = document.createElement("textarea");
      tableDestination.id = "question" + parseInt(index + 1) + "table";
      tableDestination.cols = "140";
      tableDestination.rows = "1";
      tableDestination.innerText = row["table"];

      var answerCheckbox2 = document.createElement("div");
      answerCheckbox2.innerText = "Bảng mục tiêu";

      answerDiv.appendChild(answerCheckbox2);
      answerDiv.appendChild(tableDestination);
    }
    answerDiv.appendChild(answerCheckbox);
    answerDiv.appendChild(answerInput);
    answerDiv.style.flexDirection = "column";
    questionContent.appendChild(answerDiv);
    questionsContainer.appendChild(questionContent);
  });
  createImageButton();
  document.getElementById("numQuestions").value = excelData.length;
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

  if (document.getElementById("examID").value == "") {
    showAlert("Vui lòng tạo bài thi trước khi tạo câu hỏi !!!");
    return;
  }

  if (questionNum == 0) {
    showAlert("Số câu hỏi đang là 0");
    return;
  }

  showLoading();

  for (var i = 1; i <= questionNum; i++) {
    let question =
      document.getElementById("examDescription").value == "trắc nghiệm"
        ? await getQuestion(i)
        : await getQuestion2(i);

    if (!question) {
      hideLoading();
      return;
    }

    // Gửi câu hỏi lên server trước
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mbt, question }),
    };

    let createQuestionSuccess = false;
    let retry = 3;
    while (retry-- && !createQuestionSuccess) {
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

        const data = await response.json();
        // Lưu ID câu hỏi hoặc thông tin cần thiết từ response
        const questionId = data.questionId; // Giả sử backend trả về questionId
        createQuestionSuccess = true;
      } catch (error) {
        console.error("Đã xảy ra lỗi khi gửi dữ liệu đến backend:", error);
      }
    }

    if (!createQuestionSuccess) {
      createTestSuccess = false;
      hideLoading();
      showAlert("Đã xảy ra lỗi khi lưu câu hỏi, hãy thử lại !!!");
      break;
    }
  }

  if (createTestSuccess) {
    hideLoading();
    // showAlert("Đã lưu danh sách câu hỏi thành công !!!", "#cce5ff");
    window.location.href = "/admin/test";
  }
}

const getQuestion = async (i) => {
  var answer = [];
  var check = "";
  var questionContent = document.getElementById("question" + i).value;
  if (questionContent === "") {
    showAlert("Vui lòng nhập đề bài cho câu hỏi " + i);
    return;
  }
  var urlQuestion = null;
  let imageId = "image_" + i;
  if (document.getElementById(imageId)) {
    var imageSrc = document.getElementById(imageId)?.src;
    if (imageSrc) {
      var cleanId = imageId.split("_").slice(1).join("_"); // Lấy phần sau của "image_"
      var imageFile = dataURLtoFile(imageSrc, `${cleanId}.webp`);
      urlQuestion = await uploadImage(imageFile); // Upload ảnh
    }
  }
  if (urlQuestion == false) {
    showAlert("Lỗi tải ảnh cho câu " + i);
    return;
  }
  for (var j = 1; j <= 4; j++) {
    if (
      document.getElementById(i + "checkbox" + j).classList.contains("checked")
    ) {
      check = j;
    }
    var ans = {
      content: document.getElementById("question" + i + "answer" + j).value,
      url: null,
    };
    if (ans.content === "") {
      showAlert("Bạn chưa nhập đáp án cho câu hỏi " + i);
      return;
    }
    var urlOption = null;
    var imageId2 = "image_" + i + "_" + j;
    if (document.getElementById(imageId2)) {
      var imageSrc = document.getElementById(imageId2)?.src;
      if (imageSrc) {
        var cleanId = imageId2.split("_").slice(1).join("_"); // Lấy phần sau của "image_"
        var imageFile = dataURLtoFile(imageSrc, `${cleanId}.webp`);
        urlOption = await uploadImage(imageFile); // Upload ảnh
      }
    }
    if (urlOption) ans.url = urlOption;
    if (urlOption == false) {
      showAlert("Lỗi tải ảnh cho câu " + i + ", đáp án thứ " + j);
      return;
    }
    answer.push(ans);
  }
  if (check === "") {
    showAlert("Bạn chưa chọn đáp án đúng cho câu hỏi " + i);
    return;
  }
  let question = {
    urlQuestion: urlQuestion == false ? null : urlQuestion,
    questionContent: questionContent,
    answer1: answer[0],
    answer2: answer[1],
    answer3: answer[2],
    answer4: answer[3],
    check: check,
  };
  console.log(question);
  return question;
};

const getQuestion2 = async (i) => {
  var questionContent = document.getElementById("question" + i).value;
  if (questionContent === "") {
    showAlert("Vui lòng nhập đề bài cho câu hỏi " + i);
    return;
  }
  var ans = document.getElementById("question" + i + "answer").value;
  var type = document.getElementById("question" + i + "type").textContent;
  var table = document.getElementById("question" + i + "table")
    ? document.getElementById("question" + i + "table").value
    : null;
  if (
    (ans === "" || type == "") &&
    document.getElementById("examDescription").value === "sql"
  ) {
    if (ans == "") showAlert("Chưa có đáp án cho câu hỏi " + i);
    if (type == "") showAlert("Chưa có loại cho câu hỏi " + i);
    return;
  }

  var urlQuestion = null;
  let imageId = "image_" + i;
  if (document.getElementById(imageId)) {
    var imageSrc = document.getElementById(imageId)?.src;
    if (imageSrc) {
      var cleanId = imageId.split("_").slice(1).join("_"); // Lấy phần sau của "image_"
      var imageFile = dataURLtoFile(imageSrc, `${cleanId}.webp`);
      urlQuestion = await uploadImage(imageFile); // Upload ảnh
    }
  }
  if (urlQuestion == false) {
    showAlert("Lỗi tải ảnh cho câu " + i);
    return;
  }

  let question = {
    urlQuestion: urlQuestion == false ? null : urlQuestion,
    questionContent: questionContent,
    answer: ans,
    type: type,
    table: table,
  };
  return question;
};

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

  if (
    document.getElementById("examDescription").value == "sql" &&
    (!document.getElementById("schemaRun").value ||
      !document.getElementById("schemaTestcase").value)
  ) {
    showAlert("Vui lòng nhập đủ thông tin cho bài thi sql !!!");
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
    schemaRun: document.getElementById("schemaRun").value,
    schemaTestcase: document.getElementById("schemaTestcase").value,
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

function createImageButton() {
  const questionContainers = Array.from(
    document.getElementsByClassName("question-content")
  );

  questionContainers.forEach((container, i) => {
    const questionTitle = container.querySelector(".question-title");
    const answerContainers = Array.from(
      container.getElementsByClassName("answer-container")
    );

    // Thêm upload input cho question-title
    if (questionTitle) {
      createUploadInput(questionTitle, i + 1);
    }

    // Thêm upload input cho mỗi answer-container
    answerContainers.forEach((answerContainer, index) => {
      createUploadInput(answerContainer, i + 1, index + 1);
    });
  });

  function createUploadInput(element, i = null, index = null) {
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.accept = "image/*";
    uploadInput.textContent = "Upload ảnh";

    const displayImage = document.createElement("button");
    displayImage.textContent = "Xem ảnh";
    displayImage.onclick = function () {
      const image = document.getElementById(
        `image_${i}${index ? "_" + index : ""}`
      );
      if (image.style.display === "none") {
        this.textContent = "Ẩn ảnh";
        image.style.display = "block";
      } else {
        this.textContent = "Xem ảnh";
        image.style.display = "none";
      }
    };

    uploadInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const webpDataURL = await convertToWebP(e.target.result);
          const webpImage = document.createElement("img");
          webpImage.src = webpDataURL;
          webpImage.alt = "WebP Image";
          webpImage.style.maxWidth = "100%";
          webpImage.style.display = "none";
          webpImage.id = `image_${i}${index ? "_" + index : ""}`;
          webpImage.classList.add = "image_i";

          let imageContainer = document.getElementById(
            `imageContainer_${i}${index ? "_" + index : ""}`
          );
          if (!imageContainer) {
            imageContainer = document.createElement("div");
            imageContainer.id = `imageContainer_${i}${
              index ? "_" + index : ""
            }`;
            imageContainer.style.width = "100%";
          }
          imageContainer.innerHTML = "";
          imageContainer.appendChild(webpImage);
          element.appendChild(imageContainer);
        };
        reader.readAsDataURL(file);
      }
    });

    element.appendChild(uploadInput);
    element.appendChild(displayImage);
  }
}

function toggleFields() {
  const examDescription = document.getElementById("examDescription").value;
  const schemaRunField = document.getElementById("schemaRunField");
  const schemaTestcaseField = document.getElementById("schemaTestcaseField");

  // Nếu chưa chọn gì (giá trị là chuỗi rỗng), ẩn cả hai ô nhập liệu
  if (examDescription === "" || examDescription === "trắc nghiệm") {
    schemaRunField.style.display = "none";
    schemaTestcaseField.style.display = "none";
  } else if (examDescription === "sql") {
    // Hiển thị ô "Schema testcase" cho sql
    schemaRunField.style.display = "block";
    schemaTestcaseField.style.display = "block";
  }
}

const convertToWebP = async (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Chuyển đổi sang định dạng WebP (chất lượng 0.8)
      const webpDataURL = canvas.toDataURL("image/webp", 0.8);
      resolve(webpDataURL);
    };
  });
};

async function uploadImage(file) {
  // Hàm để tách 'mch' thành i và j, và thêm trường 'mlc' nếu có

  const formData = new FormData();
  formData.append("file", file); // Gửi ảnh lên Cloudinary
  formData.append("upload_preset", "free_upload"); // Đảm bảo bạn đã tạo upload preset trên Cloudinary
  formData.append("cloud_name", "dditosqku"); // Điền tên cloud của bạn ở đây

  const maxRetries = 3; // Số lần thử lại tối đa
  const retryDelay = 2000; // Thời gian delay giữa các lần thử lại (2 giây)
  const timeoutDuration = 60000; // Thời gian timeout (60 giây)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController(); // Tạo một AbortController để xử lý timeout
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration); // Đặt timeout

    try {
      // Gửi ảnh lên Cloudinary
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dditosqku/upload",
        {
          method: "POST",
          body: formData,
          signal: controller.signal, // Gửi tín hiệu abort vào fetch
        }
      );

      clearTimeout(timeoutId); // Hủy timeout khi fetch thành công

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Lấy URL của ảnh từ phản hồi của Cloudinary
      const data = await response.json();
      const imageUrl = data.secure_url; // Lấy URL ảnh từ Cloudinary
      console.log(imageUrl);

      console.log("Ảnh đã được tải lên và URL đã được gửi thành công.");
      return imageUrl; // Nếu thành công, trả về true
    } catch (error) {
      clearTimeout(timeoutId); // Hủy timeout nếu có lỗi

      // Kiểm tra nếu là lỗi timeout
      if (error.name === "AbortError") {
        console.error("Yêu cầu đã bị timeout.");
      } else {
        console.error(`Lần thử thứ ${attempt} thất bại: ${error.message}`);
      }

      // Nếu là lần thử cuối cùng, không retry nữa
      if (attempt === maxRetries) {
        console.error("Đã đạt tối đa số lần thử, không thể tải ảnh lên.");
        return false; // Nếu hết số lần thử, trả về false
      }

      // Đợi một khoảng thời gian trước khi thử lại
      console.log(`Đang đợi ${retryDelay / 1000} giây trước khi thử lại...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

function dataURLtoFile(dataURL, filename) {
  const [metadata, base64Data] = dataURL.split(",");
  const mimeType = metadata.match(/:(.*?);/)[1];
  const byteCharacters = atob(base64Data); // Chuyển từ base64 thành chuỗi byte
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const file = new Blob(byteArrays, { type: mimeType });
  return new File([file], filename, { type: mimeType });
}
