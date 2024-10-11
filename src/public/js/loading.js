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
    loading.style.display = "block";
  }
}

function hideLoading() {
  var loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
  }
}
