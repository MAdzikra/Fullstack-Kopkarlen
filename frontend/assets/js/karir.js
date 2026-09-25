document.addEventListener("DOMContentLoaded", function () {
  // 1. Navbar Profile Dropdown Logic
  const username = localStorage.getItem("username") || "User";
  const avatarBtn = document.getElementById("avatarBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  if (avatarBtn) {
    avatarBtn.textContent = username.charAt(0).toUpperCase();
    avatarBtn.title = username;
  }

  avatarBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    profileDropdown.classList.toggle("show-dropdown");
  });

  document.addEventListener("click", function (e) {
    if (!avatarBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove("show-dropdown");
    }
  });

  document.getElementById("btnLogout").addEventListener("click", function () {
    localStorage.clear();
    alert("Anda telah berhasil logout.");
    window.location.href = "index.html";
  });

  // 2. Tab & System Limit Lowongan (Maksimal 1 Lamaran)
  let activeApplication = localStorage.getItem("activeApplication")
    ? JSON.parse(localStorage.getItem("activeApplication"))
    : null;

  const tabLowonganBtn = document.getElementById("tabLowonganBtn");
  const tabHasilBtn = document.getElementById("tabHasilBtn");
  const tabLowonganContent = document.getElementById("tabLowonganContent");
  const tabHasilContent = document.getElementById("tabHasilContent");
  const hasilList = document.getElementById("hasilList");

  // Modal Elements
  const modal = document.getElementById("applicationModal");
  const modalJobTitle = document.getElementById("modalJobTitle");
  const modalUserName = document.getElementById("modalUserName");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const applicationForm = document.getElementById("applicationForm");

  let selectedJobId = null;
  let selectedJobTitle = null;

  // Switch Tab
  tabLowonganBtn.addEventListener("click", function () {
    tabLowonganBtn.classList.add("active");
    tabHasilBtn.classList.remove("active");
    tabLowonganContent.style.display = "block";
    tabHasilContent.style.display = "none";
  });

  tabHasilBtn.addEventListener("click", function () {
    tabHasilBtn.classList.add("active");
    tabLowonganBtn.classList.remove("active");
    tabLowonganContent.style.display = "none";
    tabHasilContent.style.display = "block";
    renderHasilTab();
  });

  // Update UI Tab Lowongan
  function updateJobCardsUI() {
    const jobCards = document.querySelectorAll("#tabLowonganContent .job-card");

    jobCards.forEach((card) => {
      const jobId = card.getAttribute("data-job-id");
      const actionContainer = card.querySelector(".action-container");

      if (activeApplication && activeApplication.jobId === jobId) {
        actionContainer.innerHTML = `
                            <span class="badge-applied">Sudah Dilamar</span>
                            <button class="btn-danger btn-batal" style="margin-left: 10px;">Batal Lamar</button>
                        `;
      } else {
        actionContainer.innerHTML = `
                            <button class="btn-primary btn-lamar">Lamar</button>
                        `;
      }
    });
  }

  // Click Handler: "Lamar" & "Batal Lamar"
  document.addEventListener("click", function (e) {
    // Skenario 1: Klik Lamar -> Buka Modal (Jika belum ada lamaran aktif)
    if (e.target.classList.contains("btn-lamar")) {
      if (activeApplication) {
        alert(
          "Batas Maksimal Ditecapai: Anda hanya dapat melamar 1 lowongan aktif secara bersamaan. Batalkan lamaran sebelumnya jika ingin melamar posisi ini.",
        );
        return;
      }

      const card = e.target.closest(".job-card");
      selectedJobId = card.getAttribute("data-job-id");
      selectedJobTitle = card.getAttribute("data-job-title");

      // Isi data modal
      modalJobTitle.textContent = `Verifikasi Lamaran: ${selectedJobTitle}`;
      modalUserName.textContent = username;
      applicationForm.reset();

      // Tampilkan modal
      modal.style.display = "flex";
    }

    // Skenario 2: Klik Batal Lamar
    if (e.target.classList.contains("btn-batal")) {
      if (
        confirm(
          `Apakah Anda yakin ingin membatalkan lamaran untuk posisi ${activeApplication.jobTitle}?`,
        )
      ) {
        activeApplication = null;
        localStorage.removeItem("activeApplication");
        alert("Lamaran berhasil dibatalkan.");
        updateJobCardsUI();
        renderHasilTab();
      }
    }
  });

  // Modal Handlers
  function closeModal() {
    modal.style.display = "none";
  }

  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Submit Form Lamaran Modal
  applicationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const expectedSalary = document.getElementById("expectedSalary").value;
    const noticePeriod = document.getElementById("noticePeriod").value;

    // Simpan Lamaran Aktif tunggal ke localStorage
    activeApplication = {
      jobId: selectedJobId,
      jobTitle: selectedJobTitle,
      salary: expectedSalary,
      availability: noticePeriod,
      appliedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    localStorage.setItem(
      "activeApplication",
      JSON.stringify(activeApplication),
    );

    alert(`Selamat! Lamaran Anda untuk ${selectedJobTitle} berhasil dikirim.`);
    closeModal();
    updateJobCardsUI();
  });

  // Render Tab Hasil
  function renderHasilTab() {
    hasilList.innerHTML = "";

    if (!activeApplication) {
      hasilList.innerHTML = `
                        <div class="empty-state">
                            <h3>Belum Ada Lamaran Aktif</h3>
                            <p>Anda belum melamar pekerjaan apa pun. Silakan pilih 1 lowongan yang paling sesuai di tab <strong>Lowongan</strong>.</p>
                        </div>
                    `;
      return;
    }

    const originalCard = document.querySelector(
      `.job-card[data-job-id="${activeApplication.jobId}"]`,
    );
    const description = originalCard
      ? originalCard.querySelector("p").innerText
      : "";

    const resultCard = document.createElement("div");
    resultCard.className = "job-card";
    resultCard.innerHTML = `
                    <div class="status-badge">Status: Sedang Diproses</div>
                    <div class="job-header">
                        <h2>${activeApplication.jobTitle}</h2>
                        <button class="btn-danger btn-batal">Batal Lamar</button>
                    </div>
                    <p style="color: #666; font-size: 13px; margin-bottom: 12px;">Dilamar pada: <strong>${activeApplication.appliedAt}</strong></p>
                    <h3>Deskripsi</h3>
                    <p>${description}</p>
                `;
    hasilList.appendChild(resultCard);
  }

  // Inisialisasi awal UI
  updateJobCardsUI();
});
