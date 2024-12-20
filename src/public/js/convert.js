document.addEventListener("DOMContentLoaded", () => {
  // Lấy tất cả các thẻ <p> có id là "useranswer"
  const userAnswers = document.querySelectorAll("p#useranswer");

  // Thêm cú pháp MathJax cho từng thẻ
  userAnswers.forEach((p) => {
    let input = p.textContent.trim(); // Loại bỏ khoảng trắng dư thừa
    let formattedInput = input.replace(/ /g, "\\ "); // Thay thế dấu cách thành \ trong LaTeX
    formattedInput = formattedInput.replace(/\n/g, "\\\\"); // Thay dấu xuống dòng thành \\ trong LaTeX
    let mathFormula = `\\begin{gather} ${formattedInput} \\end{gather}`;
    p.innerHTML = `\\[ ${mathFormula} \\]`; // Bao nội dung trong \\[ ... \\] để MathJax nhận diện
  });

  // Làm mới MathJax để render
  if (window.MathJax) {
    MathJax.typesetPromise().then(() => {
      // Đảm bảo rằng các phần tử MathJax được căn lề trái
      const mjxContainers = document.querySelectorAll(
        'mjx-container[jax="CHTML"][display="true"]'
      );
      mjxContainers.forEach((container) => {
        container.style.textAlign = "left";
      });

      const mjxMtds = document.querySelectorAll("mjx-mtd");
      mjxMtds.forEach((mtd) => {
        mtd.style.textAlign = "left";
      });
    });
  }
});
