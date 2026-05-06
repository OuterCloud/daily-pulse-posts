/* ── Share ── */
function sharePost() {
  var url = window.location.href;
  var title = typeof POST_TITLE !== "undefined" ? POST_TITLE : document.title;
  if (navigator.share) {
    navigator.share({ title: title, url: url }).catch(function () {});
  } else {
    navigator.clipboard
      .writeText(url)
      .then(function () {
        showToast("链接已复制 ✓");
      })
      .catch(function () {
        prompt("复制链接：", url);
      });
  }
}

/* ── Toast ── */
function showToast(msg) {
  var t = document.createElement("div");
  t.className = "fnt-toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function () {
    t.classList.add("show");
  }, 10);
  setTimeout(function () {
    t.classList.remove("show");
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
    }, 300);
  }, 2500);
}

/* ── Back to Top ── */
(function () {
  var btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.innerHTML = "↑";
  btn.setAttribute("aria-label", "回到顶部");
  btn.setAttribute("title", "回到顶部");
  document.body.appendChild(btn);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ── Smooth anchor scrolling ── */
document.addEventListener("click", function (e) {
  var link = e.target.closest('a[href^="#"]');
  if (!link) return;
  var target = document.querySelector(link.getAttribute("href"));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});
