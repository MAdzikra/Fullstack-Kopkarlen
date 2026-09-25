// --- DUMMY DATA KARYAWAN BARU (12 Data untuk Menguji Pagination) ---
const employeesData = [
  {
    id: 1,
    name: "Ahmad Subagja",
    division: "IT & Tech",
    position: "Fullstack Developer",
    joinDate: "2026-01-15",
  },
  {
    id: 2,
    name: "Rina Wijaya",
    division: "HR & Legal",
    position: "HR Specialist",
    joinDate: "2026-01-20",
  },
  {
    id: 3,
    name: "Deni Kurniawan",
    division: "IT & Tech",
    position: "DevOps Engineer",
    joinDate: "2026-02-01",
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    division: "Finance",
    position: "Finance Officer",
    joinDate: "2026-02-10",
  },
  {
    id: 5,
    name: "Budi Pratama",
    division: "IT & Tech",
    position: "Fullstack Developer",
    joinDate: "2026-02-15",
  },
  {
    id: 6,
    name: "Dewi Lestari",
    division: "Marketing",
    position: "Content Strategist",
    joinDate: "2026-02-18",
  },
  {
    id: 7,
    name: "Fajar Ramadan",
    division: "IT & Tech",
    position: "DevOps Engineer",
    joinDate: "2026-03-01",
  },
  {
    id: 8,
    name: "Gita Gutawa",
    division: "HR & Legal",
    position: "HR Specialist",
    joinDate: "2026-03-05",
  },
  {
    id: 9,
    name: "Hendra Setiawan",
    division: "Finance",
    position: "Finance Officer",
    joinDate: "2026-03-10",
  },
  {
    id: 10,
    name: "Indah Permata",
    division: "IT & Tech",
    position: "Fullstack Developer",
    joinDate: "2026-03-12",
  },
  {
    id: 11,
    name: "Joko Widodo",
    division: "Marketing",
    position: "SEO Specialist",
    joinDate: "2026-03-15",
  },
  {
    id: 12,
    name: "Kiki Amalia",
    division: "IT & Tech",
    position: "DevOps Engineer",
    joinDate: "2026-03-20",
  },
];

let currentPage = 1;
const rowsPerPage = 10;
let filteredEmployees = [...employeesData];

// --- TAB SWITCHER LOGIC ---
const tabBtns = document.querySelectorAll(".tabs .tab-btn");
const tabLowongan = document.getElementById("jobListContainer"); // elemen container lowongan
const tabKaryawan = document.getElementById("tabKaryawanContent");

tabBtns[0].addEventListener("click", function () {
  tabBtns[0].classList.add("active");
  tabBtns[1].classList.remove("active");
  tabLowongan.style.display = "block";
  document.getElementById("btnTambahLowongan").style.display = "inline-block";
  tabKaryawan.style.display = "none";
});

tabBtns[1].addEventListener("click", function () {
  tabBtns[1].classList.add("active");
  tabBtns[0].classList.remove("active");
  tabLowongan.style.display = "none";
  document.getElementById("btnTambahLowongan").style.display = "none";
  tabKaryawan.style.display = "block";
  applyEmployeeFilters(); // Render data saat tab dibuka
});

// --- FILTER & PAGINATION LOGIC ---
function applyEmployeeFilters() {
  const searchVal = document
    .getElementById("searchKaryawan")
    .value.toLowerCase();
  const divisiVal = document.getElementById("filterDivisi").value;
  const posisiVal = document.getElementById("filterPosisi").value;

  filteredEmployees = employeesData.filter((emp) => {
    const matchName = emp.name.toLowerCase().includes(searchVal);
    const matchDivisi = divisiVal === "" || emp.division === divisiVal;
    const matchPosisi = posisiVal === "" || emp.position === posisiVal;
    return matchName && matchDivisi && matchPosisi;
  });

  currentPage = 1;
  renderEmployeeTable();
}

document
  .getElementById("searchKaryawan")
  .addEventListener("input", applyEmployeeFilters);
document
  .getElementById("filterDivisi")
  .addEventListener("change", applyEmployeeFilters);
document
  .getElementById("filterPosisi")
  .addEventListener("change", applyEmployeeFilters);

function renderEmployeeTable() {
  const tbody = document.getElementById("employeeTableBody");
  tbody.innerHTML = "";

  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedData = filteredEmployees.slice(startIdx, endIdx);

  if (paginatedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888; padding: 20px;">Data karyawan tidak ditemukan.</td></tr>`;
  } else {
    paginatedData.forEach((emp, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${startIdx + index + 1}</td>
                <td style="font-weight: 600;">${emp.name}</td>
                <td>${emp.division}</td>
                <td>${emp.position}</td>
                <td>${emp.joinDate}</td>
            `;
      tbody.appendChild(row);
    });
  }

  // Update Info & Tombol Pagination
  const totalData = filteredEmployees.length;
  const totalPages = Math.ceil(totalData / rowsPerPage) || 1;

  document.getElementById("paginationInfo").textContent =
    `Menampilkan ${totalData === 0 ? 0 : startIdx + 1}-${Math.min(endIdx, totalData)} dari ${totalData} data`;

  const btnContainer = document.getElementById("paginationButtons");
  btnContainer.innerHTML = "";

  // Prev Button
  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderEmployeeTable();
  };
  btnContainer.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.onclick = () => {
      currentPage = i;
      renderEmployeeTable();
    };
    btnContainer.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderEmployeeTable();
  };
  btnContainer.appendChild(nextBtn);
}

// --- MODAL BUAT LAPORAN ---
const modalLaporan = document.getElementById("modalLaporan");

document.getElementById("btnBuatLaporan").addEventListener("click", () => {
  modalLaporan.classList.add("show");
});

document.getElementById("btnCloseLaporan").onclick = () =>
  modalLaporan.classList.remove("show");
document.getElementById("btnCancelLaporan").onclick = () =>
  modalLaporan.classList.remove("show");

// Cetak Laporan Berdasarkan Filter Modal
document.getElementById("formLaporan").addEventListener("submit", function (e) {
  e.preventDefault();
  const tglMulai = document.getElementById("lapTglMulai").value;
  const tglSelesai = document.getElementById("lapTglSelesai").value;
  const divisi = document.getElementById("lapDivisi").value;
  const posisi = document.getElementById("lapPosisi").value;

  // Filter data untuk laporan
  const reportData = employeesData.filter((emp) => {
    const empDate = emp.joinDate;
    const matchDate = empDate >= tglMulai && empDate <= tglSelesai;
    const matchDivisi = divisi === "" || emp.division === divisi;
    const matchPosisi = posisi === "" || emp.position === posisi;
    return matchDate && matchDivisi && matchPosisi;
  });

  if (reportData.length === 0) {
    alert("Tidak ada data karyawan pada rentang filter ini.");
    return;
  }

  // Buka jendela baru khusus cetak/export
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <html>
        <head>
            <title>Laporan Karyawan Baru - Kopkarlen</title>
            <style>
                body { font-family: 'Poppins', sans-serif; padding: 20px; }
                h2, h4 { margin: 5px 0; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #333; padding: 8px 12px; text-align: left; font-size: 13px; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>LAPORAN KARYAWAN BARU KOPKARLEN</h2>
            <h4>Periode: ${tglMulai} s/d ${tglSelesai}</h4>
            <p><strong>Divisi:</strong> ${divisi || "Semua"} | <strong>Posisi:</strong> ${posisi || "Semua"}</p>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Karyawan</th>
                        <th>Divisi</th>
                        <th>Posisi</th>
                        <th>Tanggal Masuk</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData
                      .map(
                        (emp, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${emp.name}</td>
                            <td>${emp.division}</td>
                            <td>${emp.position}</td>
                            <td>${emp.joinDate}</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </body>
        </html>
    `);
  printWindow.document.close();
  printWindow.print();

  modalLaporan.classList.remove("show");
});
