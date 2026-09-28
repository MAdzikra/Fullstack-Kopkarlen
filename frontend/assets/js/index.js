document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  const username = localStorage.getItem("username") || "User";

  const karirLink = document.getElementById("nav-karir");
  const userContainer = document.getElementById("nav-user-container");

  // 1. Logika Pencegatan Karir
  karirLink.addEventListener("click", function (e) {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk melihat lowongan Karir.");
      window.location.href = "login.html";
    } else if (role === "admin") {
      window.location.href = "admin_dashboard.html";
    } else {
      window.location.href = "karir.html";
    }
  });

  // 2. Render Avatar & Dropdown jika login
  if (isLoggedIn) {
    const initial = username.charAt(0).toUpperCase();
    let dashboardOrProfileLink = role === "admin" ? "admin_dashboard.html" : "peserta_dashboard.html";
    let dashboardOrProfileText = role === "admin" ? "Dashboard Admin" : "Profil Saya";

    userContainer.innerHTML = `
      <div class="profile-dropdown-container">
          <button class="profile-avatar-btn" id="avatarBtn" title="${username}">${initial}</button>
          <div class="dropdown-menu" id="profileDropdown">
              <a href="${dashboardOrProfileLink}">${dashboardOrProfileText}</a>
              <button id="btnLogout" class="logout-btn">Logout</button>
          </div>
      </div>
    `;

    const avatarBtn = document.getElementById("avatarBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show-dropdown");
    });
    document.addEventListener("click", (e) => {
      if (!avatarBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove("show-dropdown");
      }
    });
    document.getElementById("btnLogout").addEventListener("click", () => {
      localStorage.clear();
      alert("Anda telah berhasil logout.");
      window.location.href = "index.html";
    });
  }

  // --- LOGIKA CMS SLIDER HERO (3 SLOT & BASE64) ---
  const defaultSlides = [
    "https://kopkarlen.coop.id/assets/images/Slider-Home-1790214218-163.jpg",
    "https://www.kopkarlen.coop.id/assets/images/Recipes-1789456214-537.jpg"
  ];
  
  // Ambil data dari LocalStorage, jika kosong pakai gambar bawaan web asli
  let heroSlides = JSON.parse(localStorage.getItem('cms_hero_slides')) || defaultSlides;
  let currentSlideIndex = 0;
  const sliderImg = document.getElementById('sliderImage');
  let autoPlayInterval;

  // Fungsi Play Carousel UI Depan
  function renderSlider() {
      if (!sliderImg) return;
      if (heroSlides.length === 0) {
          sliderImg.src = ""; // Kosong jika admin menghapus semua
          return;
      }
      
      // Jika index kelebihan karena gambar dihapus
      if (currentSlideIndex >= heroSlides.length) currentSlideIndex = 0;
      
      sliderImg.style.opacity = 0.5;
      setTimeout(() => {
          sliderImg.src = heroSlides[currentSlideIndex];
          sliderImg.style.opacity = 1;
      }, 200);
  }

  window.nextSlide = function() {
      if (heroSlides.length <= 1) return;
      currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
      renderSlider();
  };

  window.prevSlide = function() {
      if (heroSlides.length <= 1) return;
      currentSlideIndex = (currentSlideIndex - 1 + heroSlides.length) % heroSlides.length;
      renderSlider();
  };

  renderSlider();
  autoPlayInterval = setInterval(window.nextSlide, 5000);

  // --- LOGIKA CMS MODAL ADMIN ---
  const btnManage = document.getElementById('btnManageSlider');
  const modalCMS = document.getElementById('modalSliderCMS');
  const btnCloseCMS = document.getElementById('btnCloseSliderCMS');
  const btnSaveCMS = document.getElementById('btnSaveSliderCMS');
  const slotsContainer = document.getElementById('sliderSlotsContainer');

  if (role === 'admin' && btnManage) {
      btnManage.style.display = 'block';
      
      // Buka Modal
      btnManage.addEventListener('click', () => {
          renderSlotsInModal();
          modalCMS.style.display = 'flex';
      });

      // Tutup Modal
      btnCloseCMS.addEventListener('click', () => modalCMS.style.display = 'none');
      
      // Simpan & Apply
      btnSaveCMS.addEventListener('click', () => {
          localStorage.setItem('cms_hero_slides', JSON.stringify(heroSlides));
          modalCMS.style.display = 'none';
          currentSlideIndex = 0; // Reset ke gambar pertama
          renderSlider();
      });
  }

  // Render 3 Kotak Slot (Sesuai Konsep Layering)
  function renderSlotsInModal() {
      slotsContainer.innerHTML = '';
      const maxSlots = 3;
      
      for (let i = 0; i < maxSlots; i++) {
          const imgData = heroSlides[i];
          const slotDiv = document.createElement('div');
          slotDiv.className = 'slot-box';
          
          if (imgData) {
              // Jika slot terisi gambar
              slotDiv.innerHTML = `
                  <img src="${imgData}" alt="Slot ${i+1}">
                  <div class="slot-actions">
                      <label class="btn-upload-lbl">
                          Ganti
                          <input type="file" accept="image/*" style="display:none;" onchange="handleUpload(event, ${i})">
                      </label>
                      <button onclick="removeSlide(${i})">Hapus</button>
                  </div>
              `;
          } else {
              // Jika slot kosong
              slotDiv.innerHTML = `
                  <label class="slot-empty-text">
                      <div style="text-align:center;">
                         <span style="font-size:24px; font-weight:bold;">+</span><br>Upload Gambar
                      </div>
                      <input type="file" accept="image/*" style="display:none;" onchange="handleUpload(event, ${i})">
                  </label>
              `;
          }
          slotsContainer.appendChild(slotDiv);
      }
  }

  // Handle Upload Image ke Base64 via File Explorer
  window.handleUpload = function(event, index) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              heroSlides[index] = e.target.result; 
              // Rapihkan array kalau ada bolong di tengah
              heroSlides = heroSlides.filter(Boolean); 
              renderSlotsInModal(); // Render ulang kotaknya
          }
          reader.readAsDataURL(file); // Konversi ke Base64 biar bisa disave di local storage
      }
  }

  // Hapus Gambar dari Layer
  window.removeSlide = function(index) {
      heroSlides.splice(index, 1);
      renderSlotsInModal();
  }
});

// --- SISA SCRIPT (GALLERY & TO TOP BUTTON) ---
const galleryImages = [
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044759-889.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044734-745.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044693-539.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044510-159.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044471-594.jpg",
  "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044288-830.jpg",
];
const galleryTitles = ["Kegiatan Koperasi", "Kebersamaan Pengurus", "Agenda Perusahaan", "Kegiatan Internal", "Pelatihan & Pengembangan", "Aktivitas Unit"];
const galleryGrid = document.getElementById("galleryGrid");
galleryImages.forEach((src, i) => {
  const card = document.createElement("div");
  card.className = "gallery-card";
  card.innerHTML = `<img src="${src}" alt="${galleryTitles[i]}"><div class="gallery-caption">${galleryTitles[i]}</div>`;
  card.addEventListener("click", () => {
    document.getElementById("lightboxImg").src = src;
    document.getElementById("lightbox").classList.add("open");
  });
  if(galleryGrid) galleryGrid.appendChild(card);
});

const closeBtn = document.getElementById("close");
const lightbox = document.getElementById("lightbox");
if (closeBtn) closeBtn.onclick = () => lightbox.classList.remove("open");
if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target.id === "lightbox") e.currentTarget.classList.remove("open");
    });
}
const toTop = document.getElementById("toTop");
if (toTop) {
    window.addEventListener("scroll", () => { toTop.style.display = window.scrollY > 500 ? "grid" : "none"; });
    toTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}