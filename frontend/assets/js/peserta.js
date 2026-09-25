document.addEventListener("DOMContentLoaded", function () {
  // Default Profile State dengan Array/Multiple Items
  const defaultData = {
    username: "John Doe",
    bio: "Saya seorang Software Engineer dengan pengalaman dalam merancang dan mengembangkan aplikasi web.",
    photo: "",
    pendidikan: [
      {
        instansi: "Universitas Tangerang",
        tingkat: "S1",
        jurusan: "Teknik Informatika",
        ipk: "3.95",
        tglMasuk: "2022-08-01",
        tglLulus: "2026-07-31",
        buktiName: "",
        buktiData: "",
      },
    ],
    pekerjaan: [
      {
        instansi: "PT. Surya Cahaya Kami",
        posisi: "Project Management Officer Intern",
        tglMasuk: "2025-06-12",
        tglKeluar: "2025-12-12",
        buktiName: "",
        buktiData: "",
      },
    ],
    pelatihan: [
      {
        nama: "Fullstack Web Development Intensive",
        tempat: "Digital Talent Academy",
        deskripsi:
          "Mengikuti program sertifikasi intensif pemrograman MERN Stack.",
        tglMulai: "2025-01-10",
        tglSelesai: "2025-04-10",
        buktiName: "",
        buktiData: "",
      },
    ],
    sertifikasi: [
      {
        nama: "CCNP - Cisco Certified Network Professional",
        lembaga: "Cisco Networking Academy",
        deskripsi:
          "Sertifikasi keahlian pengelolaan jaringan skala enterprise.",
        tglMulai: "2025-08-01",
        tglSelesai: "2028-08-01",
        buktiName: "",
        buktiData: "",
      },
    ],
  };

  // Safely Load / Save Data
  let userProfile;
  try {
    const stored = localStorage.getItem("userProfile");
    userProfile = stored ? JSON.parse(stored) : defaultData;
  } catch (e) {
    userProfile = defaultData;
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      return true;
    } catch (e) {
      alert(
        "Gagal menyimpan data! Ukuran file/bukti terlalu besar untuk LocalStorage. Gunakan file berukuran di bawah 500 KB.",
      );
      return false;
    }
  }

  // Elements
  const avatarBtn = document.getElementById("avatarBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const displayUserName = document.getElementById("displayUserName");
  const displayUserBio = document.getElementById("displayUserBio");
  const profileImage = document.getElementById("profileImage");
  const profileAvatarText = document.getElementById("profileAvatarText");

  const containerPendidikan = document.getElementById("containerPendidikan");
  const containerPekerjaan = document.getElementById("containerPekerjaan");
  const containerPelatihan = document.getElementById("containerPelatihan");
  const containerSertifikasi = document.getElementById("containerSertifikasi");

  // Render Function
  function renderProfile() {
    displayUserName.textContent = userProfile.username || "User";
    displayUserBio.textContent = userProfile.bio || "";

    // Avatar
    if (userProfile.photo) {
      profileImage.src = userProfile.photo;
      profileImage.style.display = "block";
      profileAvatarText.style.display = "none";
      avatarBtn.style.backgroundImage = `url(${userProfile.photo})`;
      avatarBtn.style.backgroundSize = "cover";
      avatarBtn.style.backgroundPosition = "center";
      avatarBtn.textContent = "";
    } else {
      profileImage.style.display = "none";
      profileAvatarText.style.display = "flex";
      const firstChar = (userProfile.username || "U").charAt(0).toUpperCase();
      profileAvatarText.textContent = firstChar;
      avatarBtn.style.backgroundImage = "none";
      avatarBtn.textContent = firstChar;
    }

    // Render List Pendidikan
    if (!userProfile.pendidikan || userProfile.pendidikan.length === 0) {
      containerPendidikan.innerHTML = `<p class="empty-text">Belum ada riwayat pendidikan.</p>`;
    } else {
      containerPendidikan.innerHTML = userProfile.pendidikan
        .map(
          (edu, idx) => `
                        <div class="section-item">
                            <h4>${edu.instansi || "-"}</h4>
                            <p><strong>${edu.tingkat || ""} ${edu.jurusan ? "- " + edu.jurusan : ""}</strong> (Nilai/IPK: ${edu.ipk || "-"})</p>
                            <p>${edu.tglMasuk || "-"} s.d ${edu.tglLulus || "-"}</p>
                            ${edu.buktiData ? `<a href="${edu.buktiData}" download="${edu.buktiName || "ijazah"}" class="proof-link">📄 Lihat Bukti (${edu.buktiName || "Ijazah"})</a>` : ""}
                            <div class="item-actions">
                                <button class="btn-action-small btn-edit-item" onclick="openFormModal('pendidikan', ${idx})">Edit</button>
                                <button class="btn-action-small btn-delete-item" onclick="deleteItem('pendidikan', ${idx})">Hapus</button>
                            </div>
                        </div>
                    `,
        )
        .join("");
    }

    // Render List Pekerjaan
    if (!userProfile.pekerjaan || userProfile.pekerjaan.length === 0) {
      containerPekerjaan.innerHTML = `<p class="empty-text">Belum ada riwayat pekerjaan.</p>`;
    } else {
      containerPekerjaan.innerHTML = userProfile.pekerjaan
        .map(
          (job, idx) => `
                        <div class="section-item">
                            <h4>${job.posisi || "-"}</h4>
                            <p><strong>${job.instansi || "-"}</strong> (${job.tglMasuk || "-"} s.d ${job.tglKeluar || "-"})</p>
                            ${job.buktiData ? `<a href="${job.buktiData}" download="${job.buktiName || "bukti-kerja"}" class="proof-link">📄 Lihat Bukti (${job.buktiName || "Bukti"})</a>` : ""}
                            <div class="item-actions">
                                <button class="btn-action-small btn-edit-item" onclick="openFormModal('pekerjaan', ${idx})">Edit</button>
                                <button class="btn-action-small btn-delete-item" onclick="deleteItem('pekerjaan', ${idx})">Hapus</button>
                            </div>
                        </div>
                    `,
        )
        .join("");
    }

    // Render List Pelatihan
    if (!userProfile.pelatihan || userProfile.pelatihan.length === 0) {
      containerPelatihan.innerHTML = `<p class="empty-text">Belum ada riwayat pelatihan.</p>`;
    } else {
      containerPelatihan.innerHTML = userProfile.pelatihan
        .map(
          (train, idx) => `
                        <div class="section-item">
                            <h4>${train.nama || "-"}</h4>
                            <p><strong>${train.tempat || "-"}</strong> (${train.tglMulai || "-"} s.d ${train.tglSelesai || "-"})</p>
                            <p>${train.deskripsi || ""}</p> ${train.buktiData ? `<a href="${train.buktiData}" download="${train.buktiName || "sertifikat"}" class="proof-link">📄 Lihat Bukti (${train.buktiName || "Sertifikat"})</a>` : ""}
                            <div class="item-actions">
                                <button class="btn-action-small btn-edit-item" onclick="openFormModal('pelatihan', ${idx})">Edit</button>
                                <button class="btn-action-small btn-delete-item" onclick="deleteItem('pelatihan', ${idx})">Hapus</button>
                            </div>
                        </div>
                    `,
        )
        .join("");
    }

    // Render List Sertifikasi
    if (!userProfile.sertifikasi || userProfile.sertifikasi.length === 0) {
      containerSertifikasi.innerHTML = `<p class="empty-text">Belum ada sertifikasi.</p>`;
    } else {
      containerSertifikasi.innerHTML = userProfile.sertifikasi
        .map(
          (cert, idx) => `
                        <div class="section-item">
                            <h4>${cert.nama || "-"}</h4>
                            <p><strong>Penerbit: ${cert.lembaga || "-"}</strong> (${cert.tglMulai || "-"} s.d ${cert.tglSelesai || "-"})</p>
                            <p>${cert.deskripsi || ""}${cert.buktiData ? `<a href="${cert.buktiData}" download="${cert.buktiName || "certificate"}" class="proof-link">📄 Lihat Bukti (${cert.buktiName || "Certificate"})</a>` : ""}</p>
                            <div class="item-actions">
                                <button class="btn-action-small btn-edit-item" onclick="openFormModal('sertifikasi', ${idx})">Edit</button>
                                <button class="btn-action-small btn-delete-item" onclick="deleteItem('sertifikasi', ${idx})">Hapus</button>
                            </div>
                        </div>
                    `,
        )
        .join("");
    }
  }

  renderProfile();

  // Photo Upload
  document
    .getElementById("uploadPhotoInput")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1024 * 1024) {
          alert(
            "Ukuran foto profil terlalu besar. Gunakan file di bawah 1 MB.",
          );
          return;
        }
        const reader = new FileReader();
        reader.onload = function (evt) {
          userProfile.photo = evt.target.result;
          if (saveToLocalStorage()) renderProfile();
        };
        reader.readAsDataURL(file);
      }
    });

  // Dropdown Menu & Logout
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

  // Modals Setup
  const modalEditProfile = document.getElementById("modalEditProfile");
  const modalEditSection = document.getElementById("modalEditSection");

  function closeModal(modal) {
    modal.style.display = "none";
  }

  document
    .querySelectorAll(".btnCloseModal, .btnCancelModal")
    .forEach((btn) => {
      btn.addEventListener("click", function () {
        closeModal(modalEditProfile);
        closeModal(modalEditSection);
      });
    });

  // Edit Profil & Bio
  document
    .getElementById("btnEditProfile")
    .addEventListener("click", function () {
      document.getElementById("inputName").value = userProfile.username || "";
      document.getElementById("inputBio").value = userProfile.bio || "";
      modalEditProfile.style.display = "flex";
    });

  document
    .getElementById("formEditProfile")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      userProfile.username = document.getElementById("inputName").value.trim();
      userProfile.bio = document.getElementById("inputBio").value.trim();

      if (saveToLocalStorage()) {
        renderProfile();
        closeModal(modalEditProfile);
      }
    });

  // Open Dynamic Form Modal (Global scope agar bisa dipanggil dari inline HTML onClick)
  window.openFormModal = function (sectionType, itemIndex = -1) {
    document.getElementById("inputSectionType").value = sectionType;
    document.getElementById("inputItemIndex").value = itemIndex;
    const dynamicFormFields = document.getElementById("dynamicFormFields");
    dynamicFormFields.innerHTML = "";

    const isEdit = itemIndex >= 0;
    const sectionData = userProfile[sectionType] || [];
    const item = isEdit ? sectionData[itemIndex] : {};

    if (sectionType === "pendidikan") {
      document.getElementById("modalSectionTitle").textContent = isEdit
        ? "Edit Pendidikan"
        : "Tambah Pendidikan";
      dynamicFormFields.innerHTML = `
                        <div class="form-group"><label>Nama Instansi</label><input type="text" id="eduInstansi" value="${item.instansi || ""}" required></div>
                        <div class="form-row">
                            <div class="form-group"><label>Tingkat Pendidikan</label><input type="text" id="eduTingkat" placeholder="S1/D3/SMA" value="${item.tingkat || ""}" required></div>
                            <div class="form-group"><label>Jurusan</label><input type="text" id="eduJurusan" value="${item.jurusan || ""}" required></div>
                        </div>
                        <div class="form-group"><label>Nilai/IPK</label><input type="text" id="eduIpk" value="${item.ipk || ""}" required></div>
                        <div class="form-row">
                            <div class="form-group"><label>Tgl Masuk</label><input type="date" id="eduTglMasuk" value="${item.tglMasuk || ""}" required></div>
                            <div class="form-group"><label>Tgl Lulus</label><input type="date" id="eduTglLulus" value="${item.tglLulus || ""}" required></div>
                        </div>
                        <div class="form-group">
                            <label>Upload Bukti Ijazah (Opsional)</label>
                            <input type="file" id="eduBukti" accept="image/*,application/pdf">
                            <div class="file-info">*Maksimal 1 MB (PNG, JPG, PDF)</div>
                        </div>
                    `;
    } else if (sectionType === "pekerjaan") {
      document.getElementById("modalSectionTitle").textContent = isEdit
        ? "Edit Pekerjaan"
        : "Tambah Pekerjaan";
      dynamicFormFields.innerHTML = `
                        <div class="form-group"><label>Nama Instansi / Perusahaan</label><input type="text" id="jobInstansi" value="${item.instansi || ""}" required></div>
                        <div class="form-group"><label>Posisi / Jabatan</label><input type="text" id="jobPosisi" value="${item.posisi || ""}" required></div>
                        <div class="form-row">
                            <div class="form-group"><label>Tgl Masuk</label><input type="date" id="jobTglMasuk" value="${item.tglMasuk || ""}" required></div>
                            <div class="form-group"><label>Tgl Keluar</label><input type="date" id="jobTglKeluar" value="${item.tglKeluar || ""}" required></div>
                        </div>
                        <div class="form-group">
                            <label>Upload Bukti Pekerjaan (Opsional)</label>
                            <input type="file" id="jobBukti" accept="image/*,application/pdf">
                            <div class="file-info">*Maksimal 1 MB (PNG, JPG, PDF)</div>
                        </div>
                    `;
    } else if (sectionType === "pelatihan") {
      document.getElementById("modalSectionTitle").textContent = isEdit
        ? "Edit Pelatihan"
        : "Tambah Pelatihan";
      dynamicFormFields.innerHTML = `
                        <div class="form-group"><label>Nama Pelatihan</label><input type="text" id="trainNama" value="${item.nama || ""}" required></div>
                        <div class="form-group"><label>Tempat Pelatihan</label><input type="text" id="trainTempat" value="${item.tempat || ""}" required></div>
                        <div class="form-group"><label>Deskripsi</label><textarea id="trainDeskripsi" rows="3">${item.deskripsi || ""}</textarea></div>
                        <div class="form-row">
                            <div class="form-group"><label>Tgl Mulai</label><input type="date" id="trainTglMulai" value="${item.tglMulai || ""}" required></div>
                            <div class="form-group"><label>Tgl Selesai</label><input type="date" id="trainTglSelesai" value="${item.tglSelesai || ""}" required></div>
                        </div>
                        <div class="form-group">
                            <label>Upload Bukti Sertifikat (Opsional)</label>
                            <input type="file" id="trainBukti" accept="image/*,application/pdf">
                            <div class="file-info">*Maksimal 1 MB (PNG, JPG, PDF)</div>
                        </div>
                    `;
    } else if (sectionType === "sertifikasi") {
      document.getElementById("modalSectionTitle").textContent = isEdit
        ? "Edit Sertifikasi"
        : "Tambah Sertifikasi";
      dynamicFormFields.innerHTML = `
                        <div class="form-group"><label>Nama Sertifikasi</label><input type="text" id="certNama" value="${item.nama || ""}" required></div>
                        <div class="form-group"><label>Lembaga Sertifikasi</label><input type="text" id="certLembaga" value="${item.lembaga || ""}" required></div>
                        <div class="form-group"><label>Deskripsi</label><textarea id="certDeskripsi" rows="3">${item.deskripsi || ""}</textarea></div>
                        <div class="form-row">
                            <div class="form-group"><label>Tgl Mulai</label><input type="date" id="certTglMulai" value="${item.tglMulai || ""}" required></div>
                            <div class="form-group"><label>Tgl Selesai / Masa Berlaku</label><input type="date" id="certTglSelesai" value="${item.tglSelesai || ""}" required></div>
                        </div>
                        <div class="form-group">
                            <label>Upload Bukti Sertifikat (Opsional)</label>
                            <input type="file" id="certBukti" accept="image/*,application/pdf">
                            <div class="file-info">*Maksimal 1 MB (PNG, JPG, PDF)</div>
                        </div>  
                    `;
    }

    modalEditSection.style.display = "flex";
  };

  // Global Delete Item Function
  window.deleteItem = function (sectionType, itemIndex) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      userProfile[sectionType].splice(itemIndex, 1);
      if (saveToLocalStorage()) renderProfile();
    }
  };

  // Event listener tombol + Tambah
  document.querySelectorAll(".btn-add-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      const sectionType = this.getAttribute("data-section");
      openFormModal(sectionType, -1);
    });
  });

  // Submit Form Section (Add or Edit)
  document
    .getElementById("formEditSection")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const sectionType = document.getElementById("inputSectionType").value;
      const itemIndex = parseInt(
        document.getElementById("inputItemIndex").value,
      );
      const isEdit = itemIndex >= 0;

      const executeSave = (buktiData = null, buktiName = null) => {
        if (!userProfile[sectionType]) userProfile[sectionType] = [];

        let newItemData = {};
        const oldItem = isEdit ? userProfile[sectionType][itemIndex] : {};

        if (sectionType === "pendidikan") {
          newItemData = {
            instansi: document.getElementById("eduInstansi").value,
            tingkat: document.getElementById("eduTingkat").value,
            jurusan: document.getElementById("eduJurusan").value,
            ipk: document.getElementById("eduIpk").value,
            tglMasuk: document.getElementById("eduTglMasuk").value,
            tglLulus: document.getElementById("eduTglLulus").value,
            buktiData: buktiData !== null ? buktiData : oldItem.buktiData || "",
            buktiName: buktiName !== null ? buktiName : oldItem.buktiName || "",
          };
        } else if (sectionType === "pekerjaan") {
          newItemData = {
            instansi: document.getElementById("jobInstansi").value,
            posisi: document.getElementById("jobPosisi").value,
            tglMasuk: document.getElementById("jobTglMasuk").value,
            tglKeluar: document.getElementById("jobTglKeluar").value,
            buktiData: buktiData !== null ? buktiData : oldItem.buktiData || "",
            buktiName: buktiName !== null ? buktiName : oldItem.buktiName || "",
          };
        } else if (sectionType === "pelatihan") {
          newItemData = {
            nama: document.getElementById("trainNama").value,
            tempat: document.getElementById("trainTempat").value,
            deskripsi: document.getElementById("trainDeskripsi").value,
            tglMulai: document.getElementById("trainTglMulai").value,
            tglSelesai: document.getElementById("trainTglSelesai").value,
          };
        } else if (sectionType === "sertifikasi") {
          newItemData = {
            nama: document.getElementById("certNama").value,
            lembaga: document.getElementById("certLembaga").value,
            deskripsi: document.getElementById("certDeskripsi").value,
            tglMulai: document.getElementById("certTglMulai").value,
            tglSelesai: document.getElementById("certTglSelesai").value,
          };
        }

        if (isEdit) {
          userProfile[sectionType][itemIndex] = newItemData;
        } else {
          userProfile[sectionType].push(newItemData);
        }

        if (saveToLocalStorage()) {
          renderProfile();
          closeModal(modalEditSection);
        }
      };

      // Processing Upload File
      const fileInput =
        document.getElementById("eduBukti") ||
        document.getElementById("jobBukti");
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (file.size > 1024 * 1024) {
          alert("Ukuran bukti file terlalu besar! Gunakan file di bawah 1 MB.");
          return;
        }
        const reader = new FileReader();
        reader.onload = function (evt) {
          executeSave(evt.target.result, file.name);
        };
        reader.readAsDataURL(file);
      } else {
        executeSave();
      }
    });
});
