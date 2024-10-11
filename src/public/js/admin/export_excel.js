var studentList = JSON.parse(
  document.querySelectorAll("input")[1].getAttribute("data_to_excel_student")
);
var resultList = JSON.parse(
  document.querySelectorAll("input")[2].getAttribute("data_to_excel_result")
);
var nameTest = document.querySelectorAll("input")[3].getAttribute("name_excel");
function roundToDecimalPlace(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

document.getElementById("exportButton").addEventListener("click", async () => {
  // Tạo workbook và worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Định nghĩa các cột với định dạng căn giữa
  worksheet.columns = [
    {
      header: "STT",
      key: "STT",
      width: 5,
      alignment: { vertical: "middle", horizontal: "center" },
    },
    {
      header: "MSV",
      key: "MSV",
      width: 20,
      alignment: { vertical: "middle", horizontal: "center" },
    },
    {
      header: "Tên",
      key: "Tên",
      width: 30,
      alignment: { vertical: "middle", horizontal: "center" },
    },
    {
      header: "Điểm",
      key: "Điểm",
      width: 10,
      alignment: { vertical: "middle", horizontal: "center" },
    },
  ];

  worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
  // Thêm dữ liệu vào worksheet
  for (var i = 0; i < studentList.length; i++) {
    worksheet
      .addRow({
        STT: i + 1, // Thêm số thứ tự
        MSV: studentList[i].TaiKhoan,
        Tên: studentList[i].Ten,
        Điểm: roundToDecimalPlace(resultList[i].Diem, 2),
      })
      .eachCell({ includeEmpty: true }, function (cell) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
  }

  // Xuất workbook ra file Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nameTest.substring(1, nameTest.length - 1) + ".xlsx";
  a.click();
  URL.revokeObjectURL(url);
});
