const done = document.getElementById("done");
const visited = document.getElementById("visited");
var list = JSON.parse(
  document.querySelector("input").getAttribute("data-view-dashboard")
);
var first_theloai = JSON.parse(
  document.querySelectorAll("input")[1].getAttribute("data-TheLoai-dashboard")
);

// new Chart(done, {
//     type: 'bar',
//     data: {
//         labels: first_theloai.first,
//         datasets: [{
//             label: 'Thể loại bài thi',
//             data: first_theloai.second,
//             backgroundColor: [
//               'rgba(255, 99, 132, 0.2)',
//               'rgba(255, 159, 64, 0.2)',
//               'rgba(255, 205, 86, 0.2)',
//               'rgba(75, 192, 192, 0.2)',
//               'rgba(54, 162, 235, 0.2)',
//               'rgba(153, 102, 255, 0.2)',
//               'rgba(201, 203, 207, 0.2)'
//             ],
//             borderColor: [
//               'rgb(255, 99, 132)',
//               'rgb(255, 159, 64)',
//               'rgb(255, 205, 86)',
//               'rgb(75, 192, 192)',
//               'rgb(54, 162, 235)',
//               'rgb(153, 102, 255)',
//               'rgb(201, 203, 207)'
//             ],
//             borderWidth: 1
//           }]
//     }
// });

new Chart(done, {
  type: "doughnut",
  data: {
    labels: first_theloai.first,
    datasets: [
      {
        label: "Thể loại bài thi",
        data: first_theloai.second,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Thể loại bài thi",
      },
    },
  },
});

new Chart("visited", {
  type: "bar",
  data: {
    labels: list.first,
    datasets: [
      {
        label: "số lượng người dùng tạo mới",
        data: list.second,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
        barThickness: 100,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  },
});

// new Chart('visited', {
//     type: 'doughnut',
//     data: {
//         labels: list.first,
//         datasets: [{
//             label: 'Người dùng tạo mới mỗi tháng',
//             data: list.second,
//             backgroundColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(255, 159, 64, 1)',
//                 'rgba(255, 205, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(201, 203, 207, 1)',
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(255, 159, 64, 1)',
//                 'rgba(255, 205, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(54, 162, 235, 1)'
//             ],
//             borderColor: [
//                 'rgb(255, 99, 132)',
//                 'rgb(255, 159, 64)',
//                 'rgb(255, 205, 86)',
//                 'rgb(75, 192, 192)',
//                 'rgb(54, 162, 235)',
//                 'rgb(153, 102, 255)',
//                 'rgb(201, 203, 207)'
//             ],
//             hoverOffset: 4
//         }]
//     },
//     options: {
//         plugins: {
//             legend: {
//                 display: false,
//             },
//             title: {
//                 display: true,
//                 text: 'Người dùng tạo mới mỗi tháng'
//             }
//         }
//     }
// });
