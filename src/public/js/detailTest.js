const commentInput = document.querySelector(".input-comment input");
const sendButton = document.querySelector(".button-send");
const commentBox = document.querySelector(".box-comment"); // Assuming this is the element for displaying comments
const timeTest = document.querySelector(".desc.time-of-test .info");
const numerousOfQuestions = document.querySelector(
  ".desc.numerous-of-question .info"
);
const numerousOfPeople = document.querySelector(
  ".desc.numerous-of-people .info"
);
const nameOfTest = document.querySelector(".title-test");
const subjectTest = document.querySelector(".subject-test");

// console.log(timeTest, " ", numerousOfQuestions, " ", numerousOfPeople);
const currentUrl = window.location.href;
const url = window.location.pathname;

// Sử dụng phương thức split để lấy phần testId
const parts = url.split("/"); // Giả sử URL là dạng "/detail/:testId"
const idTest = parts[parts.length - 1]; // Phần tử cuối cùng của mảng là testId

// console.log("idtest: ", idTest);
var comments = []; // Array to store retrieved comments
var nameStudent = "";
const fetchComments = async () => {
  return fetch(`/api/comment/${idTest}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching comments: ${response.statusText}`);
      }
      return response.json(); // Assuming the API returns JSON
    })
    .then((commentsData) => {
      // Validate the fetched data structure (optional)
      if (!Array.isArray(commentsData)) {
        throw new Error("Invalid comment data format. Expected an array.");
      }

      comments = commentsData.map((comment) => {
        return {
          content: comment.content || "", // Handle missing content property
          MaSinhVien: comment.MaSinhVien || "Anonymous", // Handle missing MaSinhVien property
          thoiGianTao: comment.thoiGianTao || null, // Handle missing createdAt property
        };
      });

      // console.log("Fetched comments:", comments); // Log the fetched comments for debugging
      displayComments(); // Call displayComments to render retrieved comments
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
      alert("An error occurred while fetching comments.");
    });
};

async function fetchTestDetails() {
  return fetch(`/api/get-detail-test/${idTest}`) // Replace with actual URL
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching test details: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // Extract and display test details (assuming structure of the data)
      // console.log(data);
      const nameTest = data[0].TenBaiThi;
      const subject = data[0].TheLoai;
      const testDuration = data[0].ThoiGianThi; // Replace with appropriate property name
      const numberOfQuestions = data[0].SoLuongCau; // Replace with appropriate property name
      // const numberOfParticipants = data.data.soLanThi; // Replace with appropriate property name
      nameOfTest.textContent = nameTest;
      subjectTest.textContent = "#" + subject;
      timeTest.textContent = "Thời gian làm bài: " + testDuration + " phút"; // Assuming testDuration is a timestamp
      numerousOfQuestions.textContent =
        "Số lượng câu hỏi: " + numberOfQuestions + " câu";
      //numerousOfPeople.textContent = numberOfParticipants;

      // (Optional) Handle successful data retrieval using a then block here
    })
    .catch((error) => {
      console.error("Error fetching test details:", error);
      alert("An error occurred while fetching test details.");
    });
}

fetchTestDetails();

function calculateTimeSince(timestamp) {
  // Parse the timestamp string into a Date object
  const date = new Date(timestamp);

  // Check if the date object is valid (parsing might fail for invalid formats)
  if (isNaN(date.getTime())) {
    console.error("Invalid timestamp format. Expected YYYY-MM-DD HH:mm:ss");
    return "Invalid Date"; // Or return any error message you prefer
  }

  // Calculate the time difference in seconds
  const timeDifference = Math.floor((Date.now() - date) / 1000);

  // Define the logic for different time ranges
  if (timeDifference < 60) {
    return "A few seconds ago";
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    return `#{minutes} minute#{minutes > 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.floor(timeDifference / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
}

function getStudentInfo(studentId) {
  return new Promise((resolve, reject) => {
    fetch(`/api/get-student/${studentId}`)
      .then((response) => {
        if (response.ok) {
          return response.json(); // Return a promise that resolves with student data
        } else {
          throw new Error(`Error fetching student info: ${response.status}`); // Throw an error for handling
        }
      })
      .then((studentData) => {
        resolve(studentData); // Resolve the promise with student data
      })
      .catch((error) => {
        console.error("Error fetching student info:", error);
        reject(error); // Reject the promise with the error
      });
  });
}

// Example usage

const displayComments = () => {
  commentBox.innerHTML = ""; // Clear existing comments before displaying new ones

  const commentElements = comments.map((comment) => {
    const nameUserContainer = document.createElement("div");
    nameUserContainer.classList.add("nameUser");
    getStudentInfo(comment.MaSinhVien) // Replace with actual student ID
      .then((studentInfo) => {
        // console.log(studentInfo);
        nameStudent = studentInfo[0].Ten;
        // console.log(nameStudent); // Use the student info
        // Add class for user name styling
        nameUserContainer.textContent = nameStudent || "Anonymous"; // Use MaSinhVien if available, otherwise 'Anonymous'
      })
      .catch((error) => {
        console.error("Error fetching student info:", error);
      });
    // console.log(nameStudent);
    const commentElement = document.createElement("div");
    commentElement.classList.add("item"); // Add the main comment container class
    const profilePic = document.createElement("div");
    profilePic.classList.add("profilePic");

    const image = document.createElement("img");

    // Profile picture (replace with actual logic for profile picture URL)
    // const profilePic = document.createElement('img');
    image.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    image.alt = "Profile picture";
    profilePic?.appendChild(image);
    commentElement?.appendChild(profilePic);
    // User name container
    // const nameUserContainer = document.createElement("div");
    // nameUserContainer.classList.add("nameUser"); // Add class for user name styling
    // nameUserContainer.textContent = nameStudent || "Anonymous"; // Use MaSinhVien if available, otherwise 'Anonymous'
    commentElement?.appendChild(nameUserContainer);

    // Time comment container
    const timeCommentContainer = document.createElement("div");
    timeCommentContainer.classList.add("timeComment");
    const time = new Date(comment.thoiGianTao);
    // Add class for time styling
    timeCommentContainer.innerHTML = time.toISOString().slice(0, 19); // Assuming 'createdAt' is the comment creation timestamp
    commentElement?.appendChild(timeCommentContainer);

    // Comment content container
    const commentContentContainer = document.createElement("div");
    commentContentContainer.classList.add("commentContent"); // Add class for comment content styling
    commentContentContainer.textContent = comment.content;
    commentElement?.appendChild(commentContentContainer);

    return commentElement;
  });

  commentBox.append(...commentElements); // Efficiently append all comment elements at once
};

const addComment = async () => {
  const commentText = commentInput.value.trim();

  if (!commentText) {
    alert("Please enter a comment!");
    return;
  }

  let commentDateRes;

  const commentData = {
    content: commentText,
    MaBaiThi: idTest, // Assuming you have a way to get the exam ID
    // Replace with actual student ID
  };

  return fetch("/api/comment/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Error adding comment: ${response.statusText}`);
      }

      // Handle successful response (optional):
      // const data = await response.json(); // Access response data if needed

      commentInput.value = ""; // Clear the comment input field

      // Update the displayed comments with the new addition (implementation depends on your UI)
      // ... (your logic to update comments)
      return response.json();
    })
    .then((data) => {
      commentDateRes = { ...data.data, thoiGianTao: Date.now() };
      comments.unshift(commentDateRes);
      displayComments();
    })
    .catch((error) => {
      console.error("Error adding comment:", error);
      alert("An error occurred while adding your comment.");
    });
};

// console.log("commentInput", commentInput);
fetchComments(); // Call fetchComments to retrieve comments on page load

sendButton?.addEventListener("click", addComment);

document.addEventListener("DOMContentLoaded", function () {
  const urlParts = window.location.pathname.split("/");
  const testId = urlParts[urlParts.length - 1];
  const startTestLink = document.getElementById("start-test-link");

  startTestLink.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
    const targetUrl = `/result/test/${idTest}`;
    window.location.href = targetUrl; // Điều hướng đến URL mong muốn
  });
});
