let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

let lastScrollTop = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", function() {
    // Mengambil posisi scroll saat ini
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 1. Logika muncul/sembunyi berdasarkan arah scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll ke bawah & sudah melewati header -> Sembunyikan
        header.classList.add("hide");
    } else {
        // Scroll ke atas -> Munculkan
        header.classList.remove("hide");
    }

    // 2. Logika Paksa Muncul (Kunci): 
    // Jika scroll sudah kembali ke paling atas, header WAJIB muncul
    if (scrollTop <= 5) {
        header.classList.remove("hide");
    }

    // Update posisi scroll terakhir
    lastScrollTop = scrollTop;
});