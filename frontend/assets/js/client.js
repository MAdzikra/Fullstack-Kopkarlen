// Register data dummy ke window object agar bisa diakses di semua modul
window.dummyApplicants = window.dummyApplicants || {
  "Fullstack Developer": [
    {
      id: 101,
      name: "John Doe",
      email: "john.doe@email.com",
      hp: "08123456789",
      instansi: "Universitas Negeri",
      jurusan: "Teknik Informatika",
      lulus: "2020",
      ipk: "3.75",
      stage: "Diproses",
      docStatus: "Menunggu",
      score: 75,
    },
    {
      id: 102,
      name: "Jane Doe",
      email: "jane.doe@email.com",
      hp: "08987654321",
      instansi: "Universitas Bina Karya",
      jurusan: "Sistem Informasi",
      lulus: "2021",
      ipk: "3.85",
      stage: "Wawancara",
      docStatus: "Sesuai",
      score: 90,
    },
    {
      id: 103,
      name: "Alex Smith",
      email: "alex.smith@email.com",
      hp: "08561234888",
      instansi: "Institut Teknologi",
      jurusan: "Teknik Komputer",
      lulus: "2019",
      ipk: "3.10",
      stage: "Ditolak",
      docStatus: "Tidak Sesuai",
      score: 45,
    },
    {
      id: 104,
      name: "James Morgan",
      email: "james.m@email.com",
      hp: "087711223344",
      instansi: "Universitas Indonesia",
      jurusan: "Ilmu Komputer",
      lulus: "2018",
      ipk: "3.90",
      stage: "Offering",
      docStatus: "Sesuai",
      score: 95,
    },
  ],
  "DevOps Engineer": [
    {
      id: 201,
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      hp: "082199887766",
      instansi: "Universitas Gadjah Mada",
      jurusan: "Teknologi Informasi",
      lulus: "2021",
      ipk: "3.65",
      stage: "Diproses",
      docStatus: "Menunggu",
      score: 80,
    },
  ],
};

document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  const username = localStorage.getItem("username") || "User";

  // 1. Guard Sesi Login
  if (!isLoggedIn) {
    window.location.href = "login.html";
    return;
  }

  // 2. PERBAIKI AVATAR & DROPDOWN MAPPING SESUAI ROLE
  const userContainer = document.getElementById("nav-user-container");
  if (userContainer) {
    const initial = username.charAt(0).toUpperCase();
    let dashboardText = "Dashboard Admin";

    if (role === "client0") dashboardText = "Dashboard Client 0";
    else if (role === "client1") dashboardText = "Dashboard Client 1";

    userContainer.innerHTML = `
      <div class="profile-dropdown-container">
          <button class="profile-avatar-btn" id="avatarBtn" title="${username}">${initial}</button>
          <div class="dropdown-menu" id="profileDropdown">
              <a href="admin_dashboard.html">${dashboardText}</a>
              <button id="btnLogout" class="logout-btn">Logout</button>
          </div>
      </div>
    `;

    // Re-bind Dropdown & Logout Event
    const avatarBtn = document.getElementById("avatarBtn");
    const profileDropdown = document.getElementById("profileDropdown");
    if (avatarBtn && profileDropdown) {
      avatarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle("show-dropdown");
      });
      document.addEventListener("click", (e) => {
        if (!avatarBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
          profileDropdown.classList.remove("show-dropdown");
        }
      });
    }

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        localStorage.clear();
        alert("Anda telah berhasil logout.");
        window.location.href = "index.html";
      });
    }
  }

  // 3. RESTRIKSI FITUR KHUSUS CLIENT (client0 / client1)
  if (role === "client0" || role === "client1") {
    // Sembunyikan Tab "Kelola Karyawan" & Tombol Tambah Lowongan
    const tabs = document.querySelector(".tabs");
    const btnTambah = document.getElementById("btnTambahLowongan");
    if (tabs) tabs.style.display = "none";
    if (btnTambah) btnTambah.style.display = "none";

    // Sembunyikan Tombol Edit & Non-aktifkan
    document.querySelectorAll(".btn-edit").forEach((btn) => (btn.style.display = "none"));
    document.querySelectorAll(".btn-toggle-status").forEach((btn) => (btn.style.display = "none"));

    // EVENT INTERCEPTOR: CEGAT KLIK "Lihat Data Pelamar"
    document.addEventListener("click", function (e) {
      const btnPelamar = e.target.closest(".btn-pelamar");
      if (btnPelamar) {
        e.preventDefault();
        e.stopPropagation(); // Mencegah pemanggilan modal Admin

        const jobCard = btnPelamar.closest(".job-card");
        if (jobCard) {
          const jobTitle = jobCard.querySelector(".job-title-text").innerText;
          window.currentJobTitle = jobTitle; // Simpan ke global scope

          // Set Judul Modal Pelamar
          const modalTitle = document.getElementById("applicantJobTitle");
          if (modalTitle) modalTitle.innerText = jobTitle;

          // Populate Data Pelamar khusus Client
          renderClientApplicantList(jobTitle);

          // Buka Modal Pelamar
          const modalApplicants = document.getElementById("modalApplicants");
          if (modalApplicants) modalApplicants.classList.add("open");
        }
      }
    });
  }
});

// Render List Pelamar Khusus Tampilan Client
function renderClientApplicantList(jobTitle) {
  const container = document.getElementById("applicantListContainer");
  if (!container) return;

  container.innerHTML = "";
  // Ambil data dummy/global
  const list = (window.dummyApplicants && window.dummyApplicants[jobTitle]) || [];

  if (list.length === 0) {
    container.innerHTML =
      '<p style="text-align:center; padding: 20px; color:#888;">Belum ada pelamar untuk lowongan ini.</p>';
    return;
  }

  list.forEach((item) => {
    let stageClass = "stage-diproses";
    if (item.stage === "Psikotes") stageClass = "stage-psikotes";
    if (item.stage === "Wawancara") stageClass = "stage-wawancara";
    if (item.stage === "Offering") stageClass = "stage-offering";
    if (item.stage === "Ditolak") stageClass = "stage-ditolak";
    if (item.stage === "Diterima Kerja") stageClass = "stage-diterima";

    const saranScore = item.score !== undefined ? item.score : "-";
    const clientScore = item.userScore !== undefined ? item.userScore : "Belum Dinilai";

    let actionHtml = "";
    if (item.stage === "Wawancara") {
      actionHtml = `
        <button class="action-btn action-btn-primary" onclick="openModalPenilaianClient(${item.id})">✏️ Beri Nilai Interview</button>
      `;
    } else {
      actionHtml = `<span class="action-text-muted">Status: ${item.stage}</span>`;
    }

    const row = document.createElement("div");
    row.className = "applicant-row";
    row.innerHTML = `
        <span class="applicant-name">${item.name}</span>
        <span class="stage-badge ${stageClass}">${item.stage}</span>
        <span class="score-badge" title="Saran Admin Karir">Saran HC: ${saranScore}</span>
        <span class="score-badge" style="background:#e0f2f1; color:#00695c;">User: ${clientScore}</span>
        <div class="action-group">${actionHtml}</div>
    `;
    container.appendChild(row);
  });
}

// Buka Modal Penilaian Client
window.openModalPenilaianClient = function (applicantId) {
  const list = (window.dummyApplicants && window.dummyApplicants[window.currentJobTitle]) || [];
  window.selectedPelamar = list.find((a) => a.id === applicantId);
  if (!window.selectedPelamar) return;

  document.getElementById("clientPelamarNama").innerText = window.selectedPelamar.name;
  document.getElementById("clientPelamarPosisi").innerText = window.currentJobTitle;
  document.getElementById("clientSaranAdmin").innerText = `Skor HC: ${window.selectedPelamar.score || 0}`;

  document.getElementById("clientScoreInput").value = window.selectedPelamar.userScore || "";
  document.getElementById("clientCatatan").value = window.selectedPelamar.userNotes || "";

  const modal = document.getElementById("modalPenilaianClient");
  if (modal) modal.classList.add("open");
};

// Fungsi Tutup Modal Helper
window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("open");
};

// Simpan Evaluasi dari Client
window.simpanPenilaianClient = function () {
  if (!window.selectedPelamar) return;

  const score = parseInt(document.getElementById("clientScoreInput").value, 10) || 0;
  const catatan = document.getElementById("clientCatatan").value;
  const keputusan = document.getElementById("clientKeputusan").value;

  window.selectedPelamar.userScore = score;
  window.selectedPelamar.userNotes = catatan;

  if (keputusan === "Lolos Wawancara") {
    window.selectedPelamar.stage = "Offering";
    alert(`Penilaian disimpan. ${window.selectedPelamar.name} direkomendasikan ke tahap Offering.`);
  } else {
    window.selectedPelamar.stage = "Ditolak";
    alert(`Penilaian disimpan. Status ${window.selectedPelamar.name} diubah menjadi Ditolak.`);
  }

  closeModal("modalPenilaianClient");
  renderClientApplicantList(window.currentJobTitle);
};