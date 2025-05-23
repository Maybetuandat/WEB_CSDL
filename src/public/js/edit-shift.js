async function editShiftSubmit() {
  const form = document.getElementById("edit-shift-form");

  event.preventDefault();

  // Lấy dữ liệu từ form
  const formData = new FormData(form);

  const id = formData.get("id");
  const test = formData.get("test");
  const start = formData.get("start");
  const end = formData.get("end");

  const formatDateTimeToISO = (datetime) => {
    if (!datetime) return null;

    const date = new Date(datetime);
    date.setHours(date.getHours() + 7);
    return date.toISOString();
  };

  const startISO = formatDateTimeToISO(start);
  const endISO = formatDateTimeToISO(end);

  const data = {
    MaCaThi: id,
    MaBaiThi: test,
    start: startISO,
    end: endISO,
  };

  await fetch("/admin/shift/api/edit-shift", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status == 200) {
        alert("Cập nhật thành công!");
        window.location.href = "/admin/shift";
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    })
    .catch((error) => {
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    });
}

async function createShiftSubmit() {
  const form = document.getElementById("new-shift-form");

  event.preventDefault();

  const formData = new FormData(form);

  const test = formData.get("test");
  const start = formData.get("start");
  const end = formData.get("end");

  const formatDateTimeToISO = (datetime) => {
    if (!datetime) return null;

    const date = new Date(datetime);
    date.setHours(date.getHours() + 7);
    return date.toISOString();
  };

  const startISO = formatDateTimeToISO(start);
  const endISO = formatDateTimeToISO(end);

  const data = {
    MaBaiThi: test,
    start: startISO,
    end: endISO,
  };

  await fetch("/admin/shift/api/new-shift", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status == 200) {
        alert("Lưu ca thi thành công!");
        document.getElementById("macathi").value = result.data.MaCaThi;
        document.getElementById("uploadButton").style.display = "inline-block";
        document.getElementById("createShift").style.display = "none";
        // window.location.href = "/admin/shift";
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    })
    .catch((error) => {
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    });
}

function shiftCancel() {
  window.location.href = "/admin/shift";
}

async function deleteShift(id) {
  const isConfirmed = confirm("Bạn có muốn xóa không?");
  if (isConfirmed) {
    await fetch("/admin/shift/api/delete-shift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          alert("Xóa thành công!");
          window.location.href = "/admin/shift";
        } else {
          alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
      });
  } else {
    return;
  }
}
