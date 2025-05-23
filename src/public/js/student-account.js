// const { getHasPermission } = require("../../services/permission.service");
// const bcrypt = require('bcrypt')

function openPopUp(id) {
  var details = document.getElementById(id);
  details.style.display = "block";
}

function closePopUp(id) {
  var details = document.getElementById(id);

  document.getElementById("msv").value = "";
  document.getElementById("name").value = "";
  document.getElementById("class").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";

  document.getElementById("edit-msv").value = "";
  document.getElementById("edit-name").value = "";
  document.getElementById("edit-class").value = "";
  document.getElementById("edit-email").value = "";
  document.getElementById("edit-password").value = "";

  details.style.display = "none";
}

async function submitForm(id) {
  var details = document.getElementById(id);

  var formData = {
    msv: document.getElementById("msv").value,
    name: document.getElementById("name").value,
    class: document.getElementById("class").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  if (
    !formData.msv ||
    !formData.name ||
    !formData.class ||
    !formData.email ||
    !formData.password
  ) {
    showAlert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // const hashedPassword = await bcrypt.hash(newPassword, 10);

  details.style.display = "none";

  await fetch("/api/new-student", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.statusCode === 409) {
        showAlert("Mã sinh viên đã tồn tại!");
      } else if (response.statusCode === 400) {
        showAlert("Mật khẩu tối thiểu 9 ký tự");
      }
      return response.json();
    })
    .then((data) => {
      // Xử lý phản hồi từ backend nếu cần
      window.location.href = "/admin/account";
    })
    .catch((error) => {
      console.error("There was an error with the fetch operation:", error);
      showAlert("Đã xảy ra lỗi khi thêm tài khoản!");
    });

  // Ngăn chặn form submit mặc định
  return false;
}

async function deleteAccount(id) {
  try {
    const response = await fetch("/api/delete-student/${id}", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.status === 200) {
      window.location.href = "/admin/account";
    } else {
      showAlert("Xóa không thành công!");
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu xóa:", error);
    showAlert("Đã xảy ra lỗi khi xóa tài khoản!");
  }
}

function confirmDeleteAccount(itemId) {
  var confirmed = confirm("Bạn có chắc chắn muốn xóa tài khoản này không?");
  if (confirmed) {
    deleteAccount(itemId);
  }
}

async function getStudentData(id, msv, role) {
  var details = document.getElementById(id);
  details.style.display = "block";
  var url = "/api/get-student/" + msv;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      var student = data.data[0];

      // var password = student.MatKhau;

      document.getElementById("edit-msv").value = student.MSV;
      document.getElementById("edit-name").value = student.Ten;
      document.getElementById("edit-class").value = student.Lop;
      document.getElementById("edit-email").value = student.Email;
      document.getElementById("edit-password").value = "";
    })
    .catch((error) => {
      console.error("There was an error with the fetch operation:", error);
    });
}

function finishEdit(id) {
  var details = document.getElementById(id);

  var formData = {
    name: document.getElementById("edit-name").value,
    class: document.getElementById("edit-class").value,
    email: document.getElementById("edit-email").value,
    password: document.getElementById("edit-password").value,
  };

  if (
    !formData.name ||
    !formData.class ||
    !formData.email ||
    !formData.password
  ) {
    showAlert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  var url = "/api/update-student/" + document.getElementById("edit-msv").value;
  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.statusCode === 409) {
        showAlert("Mã sinh viên đã tồn tại!");
      } else if (response.statusCode === 400) {
        showAlert("Mật khẩu tối thiểu 9 ký tự");
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = "/admin/account";
      // Xử lý phản hồi từ backend nếu cần
    })
    .catch((error) => {
      showAlert("Đã xảy ra lỗi khi cập nhật tài khoản!");
      console.error("There was an error with the fetch operation:", error);
    });

  details.style.display = "none";
}

async function handleFile(event) {
  const input = event.target;

  if (input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const reader = new FileReader();

  reader.onload = async function (e) {
    try {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        return;
      }

      // const firstColumnData = jsonData.map(row => row[0]).filter(cell => cell !== undefined);
      const fiveColumnsData = jsonData
        .map((row) => ({
          MSV: row[0],
          Ten: row[2] + " " + row[3],
          Lop: row[4],
          TaiKhoan: row[0],
          MatKhau: row[0],
          // ThoiGian: null,
          // AccessToken: null
        }))
        .filter((row) => row.MSV !== undefined);

      const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
      };

      const chunks = chunkArray(fiveColumnsData, 5);

      for (var i = 0; i < chunks.length; i++) {
        await fetchNewAccApi(chunks[i], i, chunks.length);
      }
      // reloadPage()
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  reader.onerror = function (error) {
    console.error("FileReader error:", error);
  };

  reader.readAsArrayBuffer(file);
}

let jsonData;
async function handleFile2(event) {
  const input = event.target;

  if (input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const reader = new FileReader();

  reader.onload = async function (e) {
    try {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        return;
      }

      const mainContent = document.getElementById("list-acc");

      if (!mainContent) {
        console.error("Element with id 'list-acc' not found.");
        return;
      }

      mainContent.innerHTML = "";

      const table = document.createElement("table");
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";

      jsonData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");

        row.forEach((cell) => {
          const cellElement = document.createElement("td");
          cellElement.textContent = cell !== undefined ? cell : ""; // Hiển thị giá trị hoặc để trống
          cellElement.style.border = "1px solid #ccc";
          cellElement.style.padding = "8px";
          tr.appendChild(cellElement);
        });

        table.appendChild(tr);
      });

      mainContent.appendChild(table);

      document.getElementById("createListAcc").style.display = "inline-block";

      // const firstColumnData = jsonData.map(row => row[0]).filter(cell => cell !== undefined);
      // const fiveColumnsData = jsonData
      //   .map((row) => ({
      //     MSV: row[0],
      //   }))
      //   .filter((row) => row.MSV !== undefined);

      // const chunkArray = (array, chunkSize) => {
      //   const chunks = [];
      //   for (let i = 0; i < array.length; i += chunkSize) {
      //     chunks.push(array.slice(i, i + chunkSize));
      //   }
      //   return chunks;
      // };

      // const chunks = chunkArray(fiveColumnsData, 5);

      // for (var i = 0; i < chunks.length; i++) {
      //   await fetchListAccApi(chunks[i], i, chunks.length, document.getElementById("macathi").value);
      // }
      // reloadPage()
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  reader.onerror = function (error) {
    console.error("FileReader error:", error);
  };

  reader.readAsArrayBuffer(file);
}

async function createListAccc() {
  const firstColumnData = jsonData
    .map((row) => row[0])
    .filter((cell) => cell !== undefined);
  const fiveColumnsData = jsonData
    .map((row) => ({
      MSV: row[0],
    }))
    .filter((row) => row.MSV !== undefined);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const chunks = chunkArray(fiveColumnsData, 5);

  let process = true;
  for (var i = 0; i < chunks.length; i++) {
    process = await fetchListAccApi(
      chunks[i],
      i,
      chunks.length,
      document.getElementById("macathi").value
    );
    if (process == false) break;
  }
  if (process) showAlert("Thêm tài khoản thành công!", "#cce5ff");
  else showAlert("Đã xảy ra lỗi khi thêm tài khoản!");
}

function reloadPage() {
  window.location.href = "/admin/account";
}

async function fetchNewAccApi(accList, step, n) {
  try {
    const response = await fetch("/api/new-student-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accList),
    });

    if (!response.ok) {
      showAlert("Đã xảy ra lỗi khi thêm tài khoản!");
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
    }

    if (step === n - 1) reloadPage();
  } catch (error) {
    showAlert("Đã xảy ra lỗi khi thêm tài khoản!");
    console.error("Error fetching new account API:", error);
  }
}

async function fetchListAccApi(accList, step, n, macathi) {
  try {
    console.log("macathi: " + macathi);
    const response = await fetch("/api/new-student-list-cathi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accList, macathi }),
    });

    if (!response.ok) {
      showAlert("Đã xảy ra lỗi khi thêm tài khoản!");
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
    }
    return true;
    // if (step === n - 1) reloadPage();
  } catch (error) {
    showAlert("Đã xảy ra lỗi khi thêm tài khoản!");
    return false;
    console.error("Error fetching new account API:", error);
  }
}
