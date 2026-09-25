document.addEventListener("DOMContentLoaded", function () {
  // Ambil data sesi dari browser
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  const username = localStorage.getItem("username") || "User";

  const karirLink = document.getElementById("nav-karir");
  const userContainer = document.getElementById("nav-user-container");

  // 1. Logika Pencegatan & Pengarahan Tombol Karir
  karirLink.addEventListener("click", function (e) {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk melihat lowongan Karir.");
      window.location.href = "login.html";
    } else if (role === "admin") {
      // Redirect ke Admin Dashboard jika role-nya admin
      window.location.href = "admin_dashboard.html";
    } else {
      // Redirect ke Portal Karir jika role-nya user biasa/pelamar
      window.location.href = "karir.html";
    }
  });

  // 2. Logika Perubahan Tombol Login -> Profile Avatar + Dropdown
  if (isLoggedIn) {
    const initial = username.charAt(0).toUpperCase();

    let dashboardOrProfileLink = "#";
    let dashboardOrProfileText = "";

    if (role === "admin") {
      dashboardOrProfileLink = "admin_dashboard.html";
      dashboardOrProfileText = "Dashboard Admin";
    } else {
      dashboardOrProfileLink = "peserta_dashboard.html";
      dashboardOrProfileText = "Profil Saya";
    }

    // Render Avatar dan Dropdown Menu
    userContainer.innerHTML = `
                    <div class="profile-dropdown-container">
                        <button class="profile-avatar-btn" id="avatarBtn" title="${username}">
                            ${initial}
                        </button>
                        <div class="dropdown-menu" id="profileDropdown">
                            <a href="${dashboardOrProfileLink}">${dashboardOrProfileText}</a>
                            <button id="btnLogout" class="logout-btn">Logout</button>
                        </div>
                    </div>
                `;

    // Event Listener Toggle Dropdown
    const avatarBtn = document.getElementById("avatarBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    avatarBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      profileDropdown.classList.toggle("show-dropdown");
    });

    document.addEventListener("click", function (e) {
      if (
        !avatarBtn.contains(e.target) &&
        !profileDropdown.contains(e.target)
      ) {
        profileDropdown.classList.remove("show-dropdown");
      }
    });

    // Event Listener Logout
    document.getElementById("btnLogout").addEventListener("click", function () {
      localStorage.clear();
      alert("Anda telah berhasil logout.");
      window.location.href = "index.html";
    });
  }
});

const galleryImages = [
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044759-889.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044734-745.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044693-539.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044510-159.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044471-594.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044288-830.jpg",
];
const galleryTitles = [
  "Kegiatan Koperasi",
  "Kebersamaan Pengurus",
  "Agenda Perusahaan",
  "Kegiatan Internal",
  "Pelatihan & Pengembangan",
  "Aktivitas Unit",
];

const galleryGrid = document.getElementById("galleryGrid");
galleryImages.forEach((src, i) => {
  const card = document.createElement("div");
  card.className = "gallery-card";
  card.innerHTML = `<img src="${src}" alt="${galleryTitles[i]}"><div class="gallery-caption">${galleryTitles[i]}</div>`;
  card.addEventListener("click", () => {
    document.getElementById("lightboxImg").src = src;
    document.getElementById("lightbox").classList.add("open");
  });
  galleryGrid.appendChild(card);
});

document.getElementById("close").onclick = () =>
  document.getElementById("lightbox").classList.remove("open");
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") e.currentTarget.classList.remove("open");
});

const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTop.style.display = window.scrollY > 500 ? "grid" : "none";
});
toTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
