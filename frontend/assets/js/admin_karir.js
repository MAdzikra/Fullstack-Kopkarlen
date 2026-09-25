document.addEventListener("DOMContentLoaded", function () {
  // 1. Data Dummy Pelamar Lengkap (Sudah Ditambahkan Field Email, HP, Pendidikan)
  const dummyApplicants = {
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

  let currentJobTitle = "";
  let currentCardEditing = null;
  let selectedPelamar = null; // Menyimpan data pelamar yang sedang di-aksi

  // --- Toggle User Dropdown & Logout ---
  const avatarBtn = document.getElementById("avatarBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (avatarBtn) {
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show-dropdown");
    });
    document.addEventListener("click", () =>
      profileDropdown?.classList.remove("show-dropdown"),
    );
  }

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }

  // --- Modal Helpers ---
  const modalJobForm = document.getElementById("modalJobForm");
  const modalApplicants = document.getElementById("modalApplicants");

  window.openModal = function (modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) targetModal.classList.add("show");
  };

  window.closeModal = function (modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) targetModal.classList.remove("show");
  };

  // Close Event Listeners untuk Modal Lowongan & Pelamar
  const btnCloseJobForm = document.getElementById("btnCloseJobForm");
  if (btnCloseJobForm)
    btnCloseJobForm.onclick = () => closeModal("modalJobForm");

  const btnCancelJobForm = document.getElementById("btnCancelJobForm");
  if (btnCancelJobForm)
    btnCancelJobForm.onclick = () => closeModal("modalJobForm");

  const btnCloseApplicants = document.getElementById("btnCloseApplicants");
  if (btnCloseApplicants)
    btnCloseApplicants.onclick = () => closeModal("modalApplicants");

  const btnCloseApplicantsFooter = document.getElementById(
    "btnCloseApplicantsFooter",
  );
  if (btnCloseApplicantsFooter)
    btnCloseApplicantsFooter.onclick = () => closeModal("modalApplicants");

  // --- Modal Tambah Lowongan ---
  const btnTambahLowongan = document.getElementById("btnTambahLowongan");
  if (btnTambahLowongan) {
    btnTambahLowongan.addEventListener("click", function () {
      currentCardEditing = null;
      document.getElementById("modalJobTitle").textContent =
        "Tambah Lowongan Baru";
      document.getElementById("jobTitle").value = "";
      document.getElementById("jobStatus").value = "active";
      document.getElementById("jobDescription").value = "";
      document.getElementById("jobRequirement").value = "";
      openModal("modalJobForm");
    });
  }

  // --- Submit Form Lowongan ---
  const formJob = document.getElementById("formJob");
  if (formJob) {
    formJob.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("jobTitle").value;
      const status = document.getElementById("jobStatus").value;
      const desc = document.getElementById("jobDescription").value;
      const reqRaw = document.getElementById("jobRequirement").value;

      const reqItems = reqRaw
        .split("\n")
        .filter((i) => i.trim() !== "")
        .map((i) => `<li>${i.replace(/^[-*]\s*/, "")}</li>`)
        .join("");

      if (currentCardEditing) {
        currentCardEditing.querySelector(".job-title-text").textContent = title;
        currentCardEditing.querySelector(".job-desc-text").textContent = desc;
        currentCardEditing.querySelector(".job-req-text").innerHTML = reqItems;
        updateCardStatusUI(currentCardEditing, status === "active");
      } else {
        const newCard = document.createElement("div");
        newCard.className = `job-card ${status === "inactive" ? "is-inactive" : ""}`;
        newCard.innerHTML = `
            <div class="job-header">
                <h2>
                    <span class="job-title-text">${title}</span>
                    <span class="badge ${status === "active" ? "badge-active" : "badge-inactive"}">${status === "active" ? "Aktif" : "Non-Aktif"}</span>
                </h2>
                <div class="action-buttons">
                    <button class="btn-secondary btn-pelamar">Lihat Data Pelamar</button>
                    <button class="btn-secondary btn-edit">Edit</button>
                    <button class="${status === "active" ? "btn-danger" : "btn-success"} btn-toggle-status">${status === "active" ? "Non-aktifkan" : "Aktifkan"}</button>
                </div>
            </div>
            <h3>Deskripsi</h3>
            <p class="job-desc-text">${desc}</p>
            <h3>Requirement</h3>
            <ul class="job-req-text">${reqItems}</ul>
        `;
        document.getElementById("jobListContainer").prepend(newCard);
      }
      closeModal("modalJobForm");
    });
  }

  // --- Listener Action Card Lowongan ---
  const jobListContainer = document.getElementById("jobListContainer");
  if (jobListContainer) {
    jobListContainer.addEventListener("click", function (e) {
      const card = e.target.closest(".job-card");
      if (!card) return;

      // Edit Lowongan
      if (e.target.classList.contains("btn-edit")) {
        currentCardEditing = card;
        const title = card.querySelector(".job-title-text").textContent;
        const desc = card.querySelector(".job-desc-text").textContent;
        const isInactive = card.classList.contains("is-inactive");
        const reqs = Array.from(card.querySelectorAll(".job-req-text li"))
          .map((li) => "- " + li.textContent)
          .join("\n");

        document.getElementById("modalJobTitle").textContent = "Edit Lowongan";
        document.getElementById("jobTitle").value = title;
        document.getElementById("jobStatus").value = isInactive
          ? "inactive"
          : "active";
        document.getElementById("jobDescription").value = desc;
        document.getElementById("jobRequirement").value = reqs;
        openModal("modalJobForm");
      }

      // Non-aktifkan / Aktifkan Card
      if (e.target.classList.contains("btn-toggle-status")) {
        const isCurrentlyInactive = card.classList.contains("is-inactive");
        updateCardStatusUI(card, isCurrentlyInactive);
      }

      // Lihat Data Pelamar
      if (e.target.classList.contains("btn-pelamar")) {
        currentJobTitle = card.querySelector(".job-title-text").textContent;
        document.getElementById("applicantJobTitle").textContent =
          currentJobTitle;
        renderApplicantList(currentJobTitle);
        openModal("modalApplicants");
      }
    });
  }

  // Helper Card Status
  function updateCardStatusUI(card, makeActive) {
    const badge = card.querySelector(".badge");
    const toggleBtn = card.querySelector(".btn-toggle-status");
    if (makeActive) {
      card.classList.remove("is-inactive");
      badge.className = "badge badge-active";
      badge.textContent = "Aktif";
      toggleBtn.className = "btn-danger btn-toggle-status";
      toggleBtn.textContent = "Non-aktifkan";
    } else {
      card.classList.add("is-inactive");
      badge.className = "badge badge-inactive";
      badge.textContent = "Non-Aktif";
      toggleBtn.className = "btn-success btn-toggle-status";
      toggleBtn.textContent = "Aktifkan";
    }
  }

  // --- Render Daftar Pelamar ---
  // 1. Render List Pelamar dengan Indikator Nilai dan Status Berkas
  // --- Render Daftar Pelamar ---
  function renderApplicantList(jobTitle) {
    const container = document.getElementById("applicantListContainer");
    if (!container) return;

    container.innerHTML = "";
    const list = dummyApplicants[jobTitle] || [];

    if (list.length === 0) {
      container.innerHTML =
        '<p style="text-align:center; color:#888; padding:20px;">Belum ada pelamar untuk posisi ini.</p>';
      return;
    }

    list.forEach((item) => {
      // Stage Class
      let stageClass = "stage-diproses";
      if (item.stage === "Psikotes") stageClass = "stage-psikotes";
      if (item.stage === "Wawancara") stageClass = "stage-wawancara";
      if (item.stage === "Offering") stageClass = "stage-offering";
      if (item.stage === "Ditolak") stageClass = "stage-ditolak";
      if (item.stage === "Diterima Kerja") stageClass = "stage-diterima";

      // Berkas Badge
      let docHtml = `<span class="doc-status doc-menunggu">⏳ Menunggu</span>`;
      if (item.docStatus === "Sesuai")
        docHtml = `<span class="doc-status doc-sesuai">✅ Sesuai</span>`;
      if (item.docStatus === "Tidak Sesuai")
        docHtml = `<span class="doc-status doc-tidak">❌ Tidak Sesuai</span>`;

      // Skor
      const scoreVal = item.score !== undefined ? item.score : 0;

      // Group Tombol Aksi Dinamis
      let actionButtonsHtml = "";

      if (item.stage === "Diproses") {
        actionButtonsHtml = `
        <button class="action-btn action-btn-primary" onclick="triggerActionPelamar(${item.id})">Detail / Evaluasi</button>
      `;
      } else if (item.stage === "Ditolak" || item.stage === "Diterima Kerja") {
        actionButtonsHtml = `<span class="action-text-muted">Selesai</span>`;
      } else {
        actionButtonsHtml = `
        <button class="action-btn action-btn-primary" onclick="openModalKirimInfo(${item.id})">Kirim Undangan</button>
        <button class="action-btn action-btn-secondary" onclick="openModalUbahStatus(${item.id})">Ubah Status</button>
      `;
      }

      // Render Row
      const row = document.createElement("div");
      row.className = "applicant-row";
      row.innerHTML = `
        <span class="applicant-name" title="${item.name}">${item.name}</span>
        <span class="stage-badge ${stageClass}">${item.stage}</span>
        ${docHtml}
        <span class="score-badge">Skor: ${scoreVal}</span>
        <div class="action-group">${actionButtonsHtml}</div>
    `;
      container.appendChild(row);
    });
  }

  // --- Trigger Aksi Saat Tombol Diklik ---
  window.triggerActionPelamar = function (applicantId) {
    // Cari data pelamar berdasarkan ID di posisi pekerjaan saat ini
    const list = dummyApplicants[currentJobTitle] || [];
    selectedPelamar = list.find((a) => a.id === applicantId);

    if (selectedPelamar) {
      closeModal("modalApplicants"); // Tutup modal daftar pelamar dulu
      handleActionPelamar(selectedPelamar); // Buka modal detail/evaluasi
    } else {
      console.error("Data pelamar tidak ditemukan untuk ID:", applicantId);
    }
  };

  // --- Handler Pemilih Modal Berdasarkan Status Pelamar ---
  function handleActionPelamar(pelamar) {
    if (pelamar.stage === "Diproses") {
      // Fill Data Diri
      document.getElementById("dtNama").innerText = pelamar.name || "-";
      document.getElementById("dtEmail").innerText = pelamar.email || "-";
      document.getElementById("dtHP").innerText = pelamar.hp || "-";
      document.getElementById("dtInstansi").innerText = pelamar.instansi || "-";
      document.getElementById("dtJurusan").innerText = pelamar.jurusan || "-";
      document.getElementById("dtIPK").innerText = pelamar.ipk || "-";

      // Fill Status Berkas
      const dtDocStatus = document.getElementById("dtDocStatus");
      const status = pelamar.docStatus || "Menunggu";
      dtDocStatus.innerText = status;
      dtDocStatus.className = `doc-status ${
        status === "Sesuai"
          ? "doc-sesuai"
          : status === "Tidak Sesuai"
            ? "doc-tidak"
            : "doc-menunggu"
      }`;

      // Fill Skor Nilai
      document.getElementById("inputScore").value =
        pelamar.score !== undefined ? pelamar.score : "";

      openModal("modalCekKesesuaian");
    } else {
      setupRekrutmenForm(pelamar.stage);
      openModal("modalFormRekrutmen");
    }
  }

  // 2. Handler Mengubah Nilai / Skor Angka
  window.updateApplicantScore = function (val) {
    if (!selectedPelamar) return;
    let scoreNum = parseInt(val, 10);
    if (isNaN(scoreNum)) scoreNum = 0;

    selectedPelamar.score = scoreNum;
    renderApplicantList(currentJobTitle); // Auto-update tampilan tabel
  };

  // 3. Handler Mengubah Status Berkas
  window.setDocStatus = function (status) {
    if (!selectedPelamar) return;

    selectedPelamar.docStatus = status;

    const dtDocStatus = document.getElementById("dtDocStatus");
    dtDocStatus.innerText = status;
    dtDocStatus.className = `doc-status ${status === "Sesuai" ? "doc-sesuai" : "doc-tidak"}`;

    renderApplicantList(currentJobTitle); // Auto-update tampilan tabel
  };

  // 4. Handler Tombol Keputusan Status Lamaran (Terima/Tolak)
  window.prosesLanjut = function (keputusan) {
    closeModal("modalCekKesesuaian");

    if (keputusan === "Terima") {
      selectedPelamar.stage = "Psikotes";
      renderApplicantList(currentJobTitle);
      setupRekrutmenForm("Psikotes");
      openModal("modalFormRekrutmen");
    } else {
      selectedPelamar.stage = "Ditolak";
      renderApplicantList(currentJobTitle);
      alert(`Status pelamar ${selectedPelamar.name} diubah menjadi Ditolak.`);
    }
  };

  // 1. Fungsi Aksi Utama (Keputusan Terima / Tolak dari Modal Cek Kesesuaian)
  // --- Trigger Aksi Saat Tombol Diklik ---
  window.triggerActionPelamar = function (applicantId) {
    const list = dummyApplicants[currentJobTitle] || [];
    selectedPelamar = list.find((a) => a.id === applicantId);

    if (!selectedPelamar) return;

    // Jika status Ditolak, HENTIKAN eksekusi (modal tidak akan terbuka)
    if (selectedPelamar.stage === "Ditolak") {
      return; // Langsung keluar tanpa membuka modal apapun
    }

    // Jika bukan Ditolak, baru tutup modal daftar pelamar & proses modal berikutnya
    closeModal("modalApplicants");
    handleActionPelamar(selectedPelamar);
  };

  // --- Handler Pemilih Modal Berdasarkan Status Pelamar ---
  function handleActionPelamar(pelamar) {
    if (pelamar.stage === "Diproses") {
      // Fill Data Diri
      document.getElementById("dtNama").innerText = pelamar.name || "-";
      document.getElementById("dtEmail").innerText = pelamar.email || "-";
      document.getElementById("dtHP").innerText = pelamar.hp || "-";
      document.getElementById("dtInstansi").innerText = pelamar.instansi || "-";
      document.getElementById("dtJurusan").innerText = pelamar.jurusan || "-";
      document.getElementById("dtIPK").innerText = pelamar.ipk || "-";

      // Fill Status Berkas
      const dtDocStatus = document.getElementById("dtDocStatus");
      const status = pelamar.docStatus || "Menunggu";
      dtDocStatus.innerText = status;
      dtDocStatus.className = `doc-status ${
        status === "Sesuai"
          ? "doc-sesuai"
          : status === "Tidak Sesuai"
            ? "doc-tidak"
            : "doc-menunggu"
      }`;

      // Fill Skor Nilai
      document.getElementById("inputScore").value =
        pelamar.score !== undefined ? pelamar.score : "";

      openModal("modalCekKesesuaian");
    } else if (
      pelamar.stage === "Psikotes" ||
      pelamar.stage === "Wawancara" ||
      pelamar.stage === "Offering"
    ) {
      setupRekrutmenForm(pelamar.stage);
      openModal("modalFormRekrutmen");
    }
  }

  // 2. Fungsi Pengaturan Input Dinamis Form Rekrutmen
  // Render Daftar Pelamar dengan 2 Tombol Aksi Terpisah
  function renderApplicantList(jobTitle) {
    const container = document.getElementById("applicantListContainer");
    if (!container) return;

    container.innerHTML = "";
    const list = dummyApplicants[jobTitle] || [];

    if (list.length === 0) {
      container.innerHTML =
        '<p style="text-align:center; color:#888;">Belum ada pelamar.</p>';
      return;
    }

    list.forEach((item) => {
      let stageClass = "stage-diproses";
      if (item.stage === "Psikotes") stageClass = "stage-psikotes";
      if (item.stage === "Wawancara") stageClass = "stage-wawancara";
      if (item.stage === "Ditolak") stageClass = "stage-ditolak";
      if (item.stage === "Offering") stageClass = "stage-offering";
      if (item.stage === "Diterima") stageClass = "stage-diterima";

      let docHtml = `<span class="doc-status doc-menunggu">Menunggu</span>`;
      if (item.docStatus === "Sesuai")
        docHtml = `<span class="doc-status doc-sesuai">Sesuai</span>`;
      if (item.docStatus === "Tidak Sesuai")
        docHtml = `<span class="doc-status doc-tidak">Tidak Sesuai</span>`;

      const scoreVal = item.score !== undefined ? item.score : 0;

      // Tampilkan tombol aksi sesuai status
      let actionButtonsHtml = "";

      if (item.stage === "Diproses") {
        actionButtonsHtml = `<button class="action-link" onclick="triggerActionPelamar(${item.id})">Detail / Evaluasi</button>`;
      } else if (item.stage === "Ditolak" || item.stage === "Diterima Kerja") {
        actionButtonsHtml = `<span style="color:#888; font-size:12px;">Selesai</span>`;
      } else {
        // Untuk Psikotes, Wawancara, Offering: Ada 2 tombol terpisah
        actionButtonsHtml = `
        <button class="action-link" onclick="openModalKirimInfo(${item.id})">Kirim Undangan</button>
        <button class="action-link" style="color: #2c3892;" onclick="openModalUbahStatus(${item.id})">Ubah Status</button>
      `;
      }

      const row = document.createElement("div");
      row.className = "applicant-row";
      row.innerHTML = `
        <span class="applicant-name">${item.name}</span>
        <span class="stage-badge ${stageClass}">${item.stage}</span>
        ${docHtml}
        <span class="score-badge">Skor: ${scoreVal}</span>
        <div class="action-group">${actionButtonsHtml}</div>
    `;
      container.appendChild(row);
    });
  }

  // 3. Handler Kirim Informasi Rekrutmen (Submit Event)
  window.handleSendRekrutmen = function (event) {
    event.preventDefault();

    if (!selectedPelamar) return;

    alert(
      `Informasi ${selectedPelamar.stage} berhasil dikirimkan ke ${selectedPelamar.name} (${selectedPelamar.email})!`,
    );

    // Tutup Modal Form Rekrutmen setelah berhasil dikirim
    closeModal("modalFormRekrutmen");
  };

  // --- Modal Kirim Undangan/Informasi ---
  // --- Modal Kirim Undangan / Informasi ---
  window.openModalKirimInfo = function (applicantId) {
    // 1. Jika currentJobTitle belum ada, cari ke seluruh data pelamar
    let foundPelamar = null;

    if (currentJobTitle && dummyApplicants[currentJobTitle]) {
      foundPelamar = dummyApplicants[currentJobTitle].find(
        (a) => a.id === applicantId,
      );
    }

    // Fallback: Jika tidak ketemu via currentJobTitle, cari di semua posisi
    if (!foundPelamar) {
      Object.values(dummyApplicants).forEach((list) => {
        const match = list.find((a) => a.id === applicantId);
        if (match) foundPelamar = match;
      });
    }

    if (!foundPelamar) {
      console.error("Data pelamar tidak ditemukan untuk ID:", applicantId);
      return;
    }

    selectedPelamar = foundPelamar;

    // 2. Persiapkan Form & Buka Modal
    setupRekrutmenForm(selectedPelamar.stage);
    openModal("modalFormRekrutmen");
  };

  // --- Modal Buka Ubah Status ---
  window.openModalUbahStatus = function (applicantId) {
    const list = dummyApplicants[currentJobTitle] || [];
    selectedPelamar = list.find((a) => a.id === applicantId);
    if (!selectedPelamar) return;

    document.getElementById("lblNamaPelamar").innerText = selectedPelamar.name;
    document.getElementById("lblStatusSaatIni").innerText =
      selectedPelamar.stage;

    const select = document.getElementById("selectStatusBaru");
    select.innerHTML = "";

    // Opsi Pilihan Tergantung Status Saat Ini
    if (selectedPelamar.stage === "Psikotes") {
      select.innerHTML = `
      <option value="Wawancara">Lolos Psikotes dan Lanjut Wawancara</option>
      <option value="Ditolak">Gugur / Ditolak</option>
    `;
    } else if (selectedPelamar.stage === "Wawancara") {
      select.innerHTML = `
      <option value="Offering">Lolos Wawancara dan Lanjut Offering Letter</option>
      <option value="Ditolak">Gugur / Ditolak</option>
    `;
    } else if (selectedPelamar.stage === "Offering") {
      select.innerHTML = `
      <option value="Diterima Kerja">Diterima Kerja (Selesai)</option>
      <option value="Ditolak">Batal / Ditolak</option>
    `;
    }

    openModal("modalUbahStatus");
  };

  // --- Eksekusi Simpan Perubahan Status Baru ---
  window.simpanPerubahanStatus = function () {
    if (!selectedPelamar) return;

    const statusBaru = document.getElementById("selectStatusBaru").value;
    selectedPelamar.stage = statusBaru;

    renderApplicantList(currentJobTitle);
    closeModal("modalUbahStatus");

    alert(
      `Status pelamar ${selectedPelamar.name} berhasil diperbarui menjadi: ${statusBaru}`,
    );
  };
  function setupRekrutmenForm(stage) {
    if (!selectedPelamar) return;

    // Safe Set Value untuk Input Readonly
    const recNama = document.getElementById("recNama");
    const recEmail = document.getElementById("recEmail");
    const recWaktu = document.getElementById("recWaktu");
    const recTempat = document.getElementById("recTempat");
    const recKode = document.getElementById("recKodePsikotes");
    const recTitle = document.getElementById("recTitle");

    if (recNama) recNama.value = selectedPelamar.name || "";
    if (recEmail) recEmail.value = selectedPelamar.email || "";
    if (recWaktu) recWaktu.value = "";
    if (recTempat) recTempat.value = "";
    if (recKode) recKode.value = "";

    const titleHeader = document.getElementById("rekrutmenTitle");
    const groupTempat = document.getElementById("groupTempat");
    const groupKodePsikotes = document.getElementById("groupKodePsikotes");
    const groupOfferingLetter = document.getElementById("groupOfferingLetter");

    // Reset Display
    if (groupTempat) groupTempat.style.display = "block";
    if (groupKodePsikotes) groupKodePsikotes.style.display = "none";
    if (groupOfferingLetter) groupOfferingLetter.style.display = "none";

    // Penyesuaian Berdasarkan Stage
    if (stage === "Psikotes") {
      if (titleHeader)
        titleHeader.innerText = "Proses Rekrutmen - Tahap Psikotes";
      if (recTitle) recTitle.value = "Undangan Pelaksanaan Psikotes";
      if (groupKodePsikotes) groupKodePsikotes.style.display = "block";
    } else if (stage === "Wawancara") {
      if (titleHeader)
        titleHeader.innerText = "Proses Rekrutmen - Tahap Wawancara";
      if (recTitle) recTitle.value = "Undangan Sesi Wawancara";
    } else if (stage === "Offering") {
      if (titleHeader)
        titleHeader.innerText = "Proses Rekrutmen - Tahap Offering";
      if (recTitle) recTitle.value = "Penawaran Kerja (Offering Letter)";
      if (groupTempat) groupTempat.style.display = "none";
      if (groupOfferingLetter) groupOfferingLetter.style.display = "block";
    }
  }
});
