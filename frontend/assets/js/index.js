document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  const username = localStorage.getItem("username") || "User";

  const karirLink = document.getElementById("nav-karir");
  const userContainer = document.getElementById("nav-user-container");

  // 1. Logika Pencegatan Karir
  if (karirLink) {
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
  }

  // 2. Render Avatar & Dropdown jika login
  if (isLoggedIn && userContainer) {
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

  // --- FUNGSI GLOBAL UPLOAD GAMBAR INLINE ---
  window.triggerImageUpload = function(imgElement) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
          const file = e.target.files[0];
          if(file) {
              const reader = new FileReader();
              reader.onload = (ev) => imgElement.src = ev.target.result;
              reader.readAsDataURL(file);
          }
      };
      input.click();
  };

  // --- LOGIKA CMS LOAD DATA (Teks & Gambar) ---
  const cmsElements = [
      'aboutText', 'aboutImg', 'visionText', 'missionText',
      'boardImg_0', 'boardName_0', 'boardRole_0',
      'boardImg_1', 'boardName_1', 'boardRole_1',
      'boardImg_2', 'boardName_2', 'boardRole_2',
      'boardImg_3', 'boardName_3', 'boardRole_3',
      'boardImg_4', 'boardName_4', 'boardRole_4',
      'boardImg_5', 'boardName_5', 'boardRole_5',
      'contactEmail', 'contactAddress'
  ];

  cmsElements.forEach(id => {
      const savedData = localStorage.getItem(`cms_${id}`);
      const el = document.getElementById(id);
      if (savedData !== null && el) {
          if (el.tagName === 'IMG') el.src = savedData;
          else el.innerHTML = savedData;
      }
  });

  // --- RENDER GALLERY DARI JS + LOCAL STORAGE ---
  const defaultGalleryImages = [
    "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044759-889.jpg",
    "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044734-745.jpg",
    "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044693-539.jpg",
    "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044510-159.jpg",
    "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044471-594.jpg",
    "https://www.kopkarlen.coop.id/assets/images/Galeri-1790044288-830.jpg"
  ];
  const defaultGalleryTitles = ["Kegiatan Koperasi", "Kebersamaan Pengurus", "Agenda Perusahaan", "Kegiatan Internal", "Pelatihan & Pengembangan", "Aktivitas Unit"];
  const galleryGrid = document.getElementById("galleryGrid");
  
  if (galleryGrid) {
      galleryGrid.innerHTML = '';
      for (let i = 0; i < 6; i++) {
          const src = localStorage.getItem(`cms_galleryImg_${i}`) || defaultGalleryImages[i];
          const title = localStorage.getItem(`cms_galleryCaption_${i}`) || defaultGalleryTitles[i];
          
          const card = document.createElement("div");
          card.className = "gallery-card";
          card.innerHTML = `
             <img id="galleryImg_${i}" src="${src}" alt="${title}">
             <div id="galleryCaption_${i}" class="gallery-caption">${title}</div>
          `;
          
          // PENANGANAN KLIK PADA KARTU GALERI
          card.addEventListener("click", (e) => {
              // 1. Kalau lagi ngetik (edit teks), blokir fungsi klik lainnya
              if (e.target.isContentEditable) return; 
              
              const imgEl = document.getElementById(`galleryImg_${i}`);
              
              // 2. Kalau lagi Mode Edit, panggil fungsi upload gambar file explorer
              if (imgEl && imgEl.classList.contains('img-editable')) {
                  window.triggerImageUpload(imgEl);
                  return;
              }
              
              // 3. Mode Normal (Bukan Edit): Buka Lightbox (Zoom gambar)
              const lightbox = document.getElementById("lightbox");
              if(lightbox) {
                  document.getElementById("lightboxImg").src = imgEl.src;
                  lightbox.classList.add("open");
              }
          });
          galleryGrid.appendChild(card);
      }
  }

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

  // --- LOGIKA CMS SLIDER HERO (MODAL) ---
  const defaultSlides = [
    "https://kopkarlen.coop.id/assets/images/Slider-Home-1790214218-163.jpg",
    "https://www.kopkarlen.coop.id/assets/images/Recipes-1789456214-537.jpg"
  ];
  let heroSlides = JSON.parse(localStorage.getItem('cms_hero_slides')) || defaultSlides;
  let currentSlideIndex = 0;
  const sliderImg = document.getElementById('sliderImage');

  function renderSlider() {
      if (!sliderImg) return;
      if (heroSlides.length === 0) { sliderImg.src = ""; return; }
      if (currentSlideIndex >= heroSlides.length) currentSlideIndex = 0;
      sliderImg.style.opacity = 0.5;
      setTimeout(() => { sliderImg.src = heroSlides[currentSlideIndex]; sliderImg.style.opacity = 1; }, 200);
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
  setInterval(window.nextSlide, 5000);

  // --- LOGIKA CMS (HANYA ADMIN) ---
  if (role === 'admin') {
      // 1. Munculkan semua tombol Edit
      document.querySelectorAll('.admin-edit-btn').forEach(btn => btn.style.display = 'block');

      // 2. Setup Modal Slider Hero
      const btnManage = document.getElementById('btnManageSlider');
      const modalCMS = document.getElementById('modalSliderCMS');
      const slotsContainer = document.getElementById('sliderSlotsContainer');
      
      if(btnManage && modalCMS) {
          btnManage.addEventListener('click', () => { renderSlotsInModal(); modalCMS.style.display = 'flex'; });
          document.getElementById('btnCloseSliderCMS').addEventListener('click', () => modalCMS.style.display = 'none');
          document.getElementById('btnSaveSliderCMS').addEventListener('click', () => {
              localStorage.setItem('cms_hero_slides', JSON.stringify(heroSlides));
              modalCMS.style.display = 'none';
              currentSlideIndex = 0;
              renderSlider();
          });
      }

      function renderSlotsInModal() {
          slotsContainer.innerHTML = '';
          for (let i = 0; i < 3; i++) {
              const imgData = heroSlides[i];
              const slotDiv = document.createElement('div');
              slotDiv.className = 'slot-box';
              if (imgData) {
                  slotDiv.innerHTML = `<img src="${imgData}" alt="Slot ${i+1}">
                      <div class="slot-actions"><label class="btn-upload-lbl">Ganti<input type="file" accept="image/*" style="display:none;" onchange="handleUpload(event, ${i})"></label>
                      <button onclick="removeSlide(${i})">Hapus</button></div>`;
              } else {
                  slotDiv.innerHTML = `<label class="slot-empty-text"><div style="text-align:center;"><span style="font-size:24px; font-weight:bold;">+</span><br>Upload Gambar</div>
                      <input type="file" accept="image/*" style="display:none;" onchange="handleUpload(event, ${i})"></label>`;
              }
              slotsContainer.appendChild(slotDiv);
          }
      }

      window.handleUpload = function(event, index) {
          const file = event.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = (e) => { heroSlides[index] = e.target.result; heroSlides = heroSlides.filter(Boolean); renderSlotsInModal(); }
              reader.readAsDataURL(file);
          }
      }
      window.removeSlide = function(index) { heroSlides.splice(index, 1); renderSlotsInModal(); }

      // 3. Binding Fitur Inline Edit ke Tombol
      function setupInlineEdit(btnId, textIds, imgIds) {
          const btn = document.getElementById(btnId);
          if (!btn) return;
          let isEditing = false;
          
          btn.addEventListener('click', () => {
              if (!isEditing) {
                  // Mode Edit AKTIF
                  btn.innerHTML = '💾 Simpan Perubahan';
                  btn.classList.add('btn-saving');
                  
                  textIds.forEach(id => {
                      const el = document.getElementById(id);
                      if(el) { el.contentEditable = true; el.classList.add('editable-active'); }
                  });
                  imgIds.forEach(id => {
                      const el = document.getElementById(id);
                      if(el) { el.classList.add('img-editable'); el.onclick = () => window.triggerImageUpload(el); }
                  });
                  isEditing = true;
              } else {
                  // Mode Edit DISIMPAN
                  btn.innerHTML = '✏️ Edit Section';
                  btn.classList.remove('btn-saving');
                  
                  textIds.forEach(id => {
                      const el = document.getElementById(id);
                      if(el) { 
                          el.contentEditable = false; 
                          el.classList.remove('editable-active'); 
                          localStorage.setItem(`cms_${id}`, el.innerHTML);
                      }
                  });
                  imgIds.forEach(id => {
                      const el = document.getElementById(id);
                      if(el) { 
                          el.classList.remove('img-editable'); 
                          el.onclick = null; 
                          localStorage.setItem(`cms_${id}`, el.src);
                      }
                  });
                  isEditing = false;
              }
          });
      }

      // Aktifkan Fitur Inline Edit ke Semua Section
      setupInlineEdit('btnEditAbout', ['aboutText'], ['aboutImg']);
      setupInlineEdit('btnEditVision', ['visionText', 'missionText'], []);
      
      const galleryTexts = [0,1,2,3,4,5].map(i => `galleryCaption_${i}`);
      const galleryImgs = [0,1,2,3,4,5].map(i => `galleryImg_${i}`);
      setupInlineEdit('btnEditGallery', galleryTexts, galleryImgs);

      const boardTexts = [];
      const boardImgs = [];
      for(let i=0; i<6; i++) {
          boardTexts.push(`boardName_${i}`, `boardRole_${i}`);
          boardImgs.push(`boardImg_${i}`);
      }
      setupInlineEdit('btnEditBoard', boardTexts, boardImgs);

      setupInlineEdit('btnEditContact', ['contactEmail', 'contactAddress'], []);
  }
});