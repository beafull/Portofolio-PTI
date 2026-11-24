// ===== Footer: tahun otomatis =====
document.getElementById('tahun').textContent = new Date().getFullYear();

// ===== Dark / Light mode =====
const html = document.documentElement;
const btnTema = document.getElementById('btnTema');
const iconTema = document.getElementById('iconTema');
const teksTema = document.getElementById('teksTema');

function setTema(tema) {
    html.setAttribute('data-bs-theme', tema);
    const gelap = tema === 'dark';
    iconTema.className = gelap ? 'bi bi-sun-fill me-1' : 'bi bi-moon-fill me-1';
    teksTema.textContent = gelap ? 'Light Mode' : 'Dark Mode';
    try { localStorage.setItem('tema', tema); } catch (e) {}
}
let temaAwal = 'light';
try { temaAwal = localStorage.getItem('tema') || 'light'; } catch (e) {}
setTema(temaAwal);
btnTema.addEventListener('click', () => {
    setTema(html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
});

// ===== Efek mengetik di Hero =====
const kata = [' Web Developer', ' UI/UX Enthusiast', ' Mahasiswa Teknologi Informasi'];
const el = document.getElementById('typing');
let k = 0, h = 0, hapus = false;
function ketik() {
    const teks = kata[k];
    el.textContent = teks.substring(0, h);
    if (!hapus && h < teks.length) { h++; setTimeout(ketik, 90); }
    else if (!hapus) { hapus = true; setTimeout(ketik, 1400); }
    else if (h > 0) { h--; setTimeout(ketik, 45); }
    else { hapus = false; k = (k + 1) % kata.length; setTimeout(ketik, 300); }
}
ketik();

// ===== Bintang berkelip di Hero =====
const sparkleBox = document.getElementById('sparkles');
if (sparkleBox) {
    for (let i = 0; i < 28; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.setProperty('--s', (Math.random() * 5 + 3) + 'px');
        s.style.setProperty('--t', (Math.random() * 3 + 2.5) + 's');
        s.style.setProperty('--dl', (Math.random() * 4) + 's');
        sparkleBox.appendChild(s);
    }
}

// ===== Scroll reveal =====
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in-view');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(n => revealObs.observe(n));

// ===== Progress bar keahlian + hitung persen =====
const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const bar = card.querySelector('.progress-bar');
        const pct = card.querySelector('.skill-pct');
        const target = parseInt(bar.dataset.level, 10);
        bar.style.width = target + '%';

        let now = 0;
        const step = () => {
            now += Math.max(1, Math.round(target / 40));
            if (now > target) now = target;
            pct.textContent = now + '%';
            if (now < target) requestAnimationFrame(step);
        };
        step();
        skillObs.unobserve(card);
    });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));

// ===== Fakta acak =====
const btnFakta = document.getElementById('btnFakta');
const teksFakta = document.getElementById('teksFakta');

const daftarFakta = [
    'Aku suka sama Lohen dan Mitya.',
    'Orang bilang ketawaku lucu karna kaya org lagi sarkas.',
    'Sering ngebadut, padahal phobia badut.',
    'Suka kucing, pernah punya 9 kucing.',
    'Suka gambar walau ga jago gambar.',
    'Kepengen jadi ikan, cause i love ikan soooo much.'
];

let faktaTerakhir = -1;
teksFakta.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

if (btnFakta && teksFakta) {
    btnFakta.addEventListener('click', () => {
        let indeks;
        do {
            indeks = Math.floor(Math.random() * daftarFakta.length);
        } while (indeks === faktaTerakhir && daftarFakta.length > 1);
        faktaTerakhir = indeks;

        teksFakta.style.opacity = '0';
        teksFakta.style.transform = 'translateY(8px)';
        setTimeout(() => {
            teksFakta.textContent = daftarFakta[indeks];
            teksFakta.style.opacity = '1';
            teksFakta.style.transform = 'translateY(0)';
        }, 300);
    });
}

// ===== Form kontak: validasi & notifikasi =====
const formKontak = document.getElementById('formKontak');
const alertKontak = document.getElementById('alertKontak');
const alertError = document.getElementById('alertError');

formKontak.addEventListener('submit', async (e) => {
    e.preventDefault();

    alertKontak.classList.add('d-none');
    alertError.classList.add('d-none');

    if (!formKontak.checkValidity()) {
        formKontak.classList.add('was-validated');
        return;
    }

    const tombol = formKontak.querySelector('button[type="submit"]');
    tombol.disabled = true;
    tombol.textContent = 'Mengirim...';

    try {
        const respon = await fetch(formKontak.action, {
            method: 'POST',
            body: new FormData(formKontak),
            headers: { 'Accept': 'application/json' }
        });

        if (respon.ok) {
            alertKontak.classList.remove('d-none');
            formKontak.reset();
            formKontak.classList.remove('was-validated');
        } else {
            alertError.classList.remove('d-none');
        }
    } catch (err) {
        alertError.classList.remove('d-none');
    }

    tombol.disabled = false;
    tombol.textContent = 'Kirim Pesan';
});

// ===== Scroll: progress bar, navbar, tombol ke atas, menu aktif =====
const progress = document.getElementById('scrollProgress');
const navbar = document.querySelector('.glass-nav');
const toTop = document.getElementById('toTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function onScroll() {
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
    navbar.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 500);

    let aktif = null;
    sections.forEach(sec => { if (sec.getBoundingClientRect().top <= 120) aktif = sec.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + aktif));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Cahaya mengikuti kursor (hanya perangkat dengan mouse) =====
const glow = document.getElementById('cursorGlow');
const punyaMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (glow && punyaMouse) {
    window.addEventListener('mousemove', (e) => {
        glow.style.opacity = '1';
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ===== Efek tilt 3D pada kartu =====
if (punyaMouse) {
    document.querySelectorAll('.tilt').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform =
                `perspective(800px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}