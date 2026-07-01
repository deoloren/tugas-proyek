// ==========================================
// 1. NAVIGATION & UI LAYER (Bawaan Galih Coffee)
// ==========================================
let navbar = document.querySelector('.navbar');
let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.cart-items-container');

if (document.querySelector('#menu-btn')) {
    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
        cartItem.classList.remove('active');
    }
}
if (document.querySelector('#search-btn')) {
    document.querySelector('#search-btn').onclick = () => {
        searchForm.classList.toggle('active');
        navbar.classList.remove('active');
        cartItem.classList.remove('active');
    }
}
if (document.querySelector('#cart-btn')) {
    document.querySelector('#cart-btn').onclick = () => {
        cartItem.classList.toggle('active');
        navbar.classList.remove('active');
        searchForm.classList.remove('active');
    }
}
window.onscroll = () => {
    if (navbar) navbar.classList.remove('active');
    if (searchForm) searchForm.classList.remove('active');
    if (cartItem) cartItem.classList.remove('active');
}

// ==========================================
// 2. DATA LAYER (localStorage Terpisah)
// ==========================================
function getContacts() {
    const raw = localStorage.getItem('galihCoffeeContacts');
    return raw ? JSON.parse(raw) : [];
}
function saveContacts(data) {
    localStorage.setItem('galihCoffeeContacts', JSON.stringify(data));
}

function getMenuOrders() {
    const raw = localStorage.getItem('galihCoffeeMenuOrders');
    return raw ? JSON.parse(raw) : [];
}
function saveMenuOrders(data) {
    localStorage.setItem('galihCoffeeMenuOrders', JSON.stringify(data));
}

// ==========================================
// 3. HELPERS (Format Tanggal)
// ==========================================
function formatTanggal(dateStr) {
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; 
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

function getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// ==========================================
// 4. FORM HANDLING - TABEL CONTACT (review.html)
// ==========================================
function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('inputName').value.trim();
        const email = document.getElementById('inputEmail').value.trim();
        const phone = document.getElementById('inputPhone').value.trim();

        if (!name || !email || !phone) {
            alert('Semua field wajib diisi!');
            return;
        }

        const contacts = getContacts();
        contacts.push({
            id: Date.now(), 
            name: name,
            email: email,
            phone: phone,
            coffee: "-",
            tanggal: getTodayDateString()
        });

        saveContacts(contacts);
        form.reset();
        alert('Data Kontak berhasil disimpan!');
        window.location.href = 'riwayat.html';
    });
}

// ==========================================
// 5. CLICK MENU HANDLING - TABEL PRODUK (menu.html)
// ==========================================
function initMenuOrder() {
    const menuButtons = document.querySelectorAll('.menu .box .btn, .menu .box-container .box .btn, [class*="menu"] .btn');
    if (menuButtons.length === 0) return;

    menuButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const cardBox = this.parentElement;
            const coffeeTitleEl = cardBox.querySelector('h3');
            if (!coffeeTitleEl) return;
            
            const coffeeName = coffeeTitleEl.textContent.trim();
            const orders = getMenuOrders();

            orders.push({
                id: Date.now(),
                coffee: coffeeName,
                tanggal: getTodayDateString()
            });

            saveMenuOrders(orders);
            alert(`Sukses memesan ${coffeeName}! Cek di halaman Riwayat.`);
        });
    });
}

// ==========================================
// 6. RENDER DUA TABEL TERPISAH (riwayat.html)
// ==========================================
function initRiwayat() {
    const contactBody = document.getElementById('contactTableBody');
    const menuBody = document.getElementById('menuTableBody');
    if (!contactBody && !menuBody) return; 

    renderContactTable();
    renderMenuTable();

    // Event Hapus Semua Kontak
    document.getElementById('clearContactBtn').addEventListener('click', function() {
        if(confirm('Hapus semua data kontak?')) { saveContacts([]); renderContactTable(); }
    });

    // Event Hapus Semua Pesanan Menu
    document.getElementById('clearMenuBtn').addEventListener('click', function() {
        if(confirm('Hapus semua riwayat pesanan menu?')) { saveMenuOrders([]); renderMenuTable(); }
    });

    // --- RENDER TABEL 1 (KONTAK) ---
    function renderContactTable() {
        const contacts = getContacts();
        document.getElementById('contactCount').textContent = contacts.length + ' data';
        contactBody.innerHTML = '';

        if (contacts.length === 0) {
            document.getElementById('contactTableContainer').style.display = 'none';
            document.getElementById('contactEmptyState').style.display = 'block';
            document.getElementById('clearContactBtn').style.display = 'none';
            return;
        }

        document.getElementById('contactTableContainer').style.display = 'block';
        document.getElementById('contactEmptyState').style.display = 'none';
        document.getElementById('clearContactBtn').style.display = 'inline-block';

        contacts.forEach((item, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>
                    <button class="btn-edit-contact" data-index="${i}" style="background:#d3ad7f; color:#fff; padding:.5rem 1rem; border:none; border-radius:.3rem; cursor:pointer; font-size:1.2rem; margin-right:.5rem;"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-del-contact" data-index="${i}" style="background:#ff4d4d; color:#fff; padding:.5rem 1rem; border:none; border-radius:.3rem; cursor:pointer; font-size:1.2rem;"><i class="fas fa-trash"></i> Hapus</button>
                </td>
            `;
            contactBody.appendChild(tr);
        });

        // ============================================================
        // PERBAIKAN UTAMA: EDIT BANYAK DATA (NAMA, EMAIL, NO HP) BERURUTAN VIA PROMPT
        // ============================================================
        document.querySelectorAll('.btn-edit-contact').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                let localContacts = getContacts();
                let item = localContacts[idx];

                if (item) {
                    // Prompt 1: Ubah Nama
                    let namaBaru = prompt("Ubah Nama Pelanggan:", item.name);
                    if (namaBaru === null) return; // Batalkan proses jika klik 'Cancel'
                    
                    // Prompt 2: Ubah Email
                    let emailBaru = prompt("Ubah Email Pelanggan:", item.email);
                    if (emailBaru === null) return;
                    
                    // Prompt 3: Ubah Nomor Telepon
                    let phoneBaru = prompt("Ubah Nomor Telepon / HP:", item.phone);
                    if (phoneBaru === null) return;

                    // Masukkan semua data baru ke local storage (Gunakan data lama jika input kosong kosong)
                    item.name = namaBaru.trim() !== "" ? namaBaru.trim() : item.name;
                    item.email = emailBaru.trim() !== "" ? emailBaru.trim() : item.email;
                    item.phone = phoneBaru.trim() !== "" ? phoneBaru.trim() : item.phone;

                    saveContacts(localContacts);
                    renderContactTable();
                    alert("Data Registrasi Kontak berhasil diperbarui!");
                }
            });
        });

        // Klik aksi hapus tabel kontak
        document.querySelectorAll('.btn-del-contact').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                if (confirm('Hapus kontak ini?')) {
                    let localContacts = getContacts();
                    localContacts.splice(idx, 1);
                    saveContacts(localContacts);
                    renderContactTable();
                }
            });
        });
    }

    // --- RENDER TABEL 2 (PESANAN MENU) ---
    function renderMenuTable() {
        const orders = getMenuOrders();
        document.getElementById('menuCount').textContent = orders.length + ' pesanan';
        menuBody.innerHTML = '';

        if (orders.length === 0) {
            document.getElementById('menuTableContainer').style.display = 'none';
            document.getElementById('menuEmptyState').style.display = 'block';
            document.getElementById('clearMenuBtn').style.display = 'none';
            return;
        }

        document.getElementById('menuTableContainer').style.display = 'block';
        document.getElementById('menuEmptyState').style.display = 'none';
        document.getElementById('clearMenuBtn').style.display = 'inline-block';

        orders.forEach((item, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td style="color: #b8956c; font-weight:bold;"><i class="fas fa-coffee"></i> ${item.coffee}</td>
                <td>${formatTanggal(item.tanggal)}</td>
                <td>
                    <button class="btn-edit-menu" data-index="${i}" style="background:#d3ad7f; color:#fff; padding:.5rem 1rem; border:none; border-radius:.3rem; cursor:pointer; font-size:1.2rem; margin-right:.5rem;"><i class="fas fa-edit"></i> Ubah</button>
                    <button class="btn-del-menu" data-index="${i}" style="background:#ff4d4d; color:#fff; padding:.5rem 1rem; border:none; border-radius:.3rem; cursor:pointer; font-size:1.2rem;"><i class="fas fa-trash"></i> Hapus</button>
                </td>
            `;
            menuBody.appendChild(tr);
        });

        // Klik aksi edit nama kopi tabel menu via Dialog Prompt
        document.querySelectorAll('.btn-edit-menu').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                let localOrders = getMenuOrders();
                let item = localOrders[idx];
                
                if (item) {
                    let namaBaru = prompt("Ubah nama produk kopi pilihanmu:", item.coffee);
                    if (namaBaru && namaBaru.trim() !== "") {
                        item.coffee = namaBaru.trim();
                        saveMenuOrders(localOrders);
                        renderMenuTable();
                    }
                }
            });
        });

        // Klik aksi hapus tabel menu
        document.querySelectorAll('.btn-del-menu').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                if (confirm('Hapus pesanan ini?')) {
                    let localOrders = getMenuOrders();
                    localOrders.splice(idx, 1);
                    saveMenuOrders(localOrders);
                    renderMenuTable();
                }
            });
        });
    }
}

// ==========================================
// 7. INITIALIZATION BLOCK
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    initForm();
    initMenuOrder();
    initRiwayat();
});