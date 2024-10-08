document.addEventListener("DOMContentLoaded", function () {
  if (typeof Storage !== "undefined") {
    if (localStorage.getItem("loading") === "true") {
      showLoading();
    } else {
      hideLoading();
    }
  }
});

window.addEventListener("beforeunload", function () {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("loading", "true");
  }
  showLoading();
});

window.addEventListener("pageshow", function () {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("loading", "false");
  }
  hideLoading();
});

function showLoading() {
  var loading = document.getElementById("loading");
  if (loading) {
    //// console.log("mở");
    loading.style.display = "block";
  }
}

function hideLoading() {
  var loading = document.getElementById("loading");
  if (loading) {
    //// console.log("đóng");
    loading.style.display = "none";
  }
}
