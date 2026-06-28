// 1. Mobile Menu Toggle
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.querySelector('i').classList.toggle('fa-bars');
    menuIcon.querySelector('i').classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.querySelector('i').classList.add('fa-bars');
        menuIcon.querySelector('i').classList.remove('fa-times');
    });
});

// 2. Skill Bar Animation on Scroll
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percent = entry.target.getAttribute('data-percent');
            entry.target.style.width = percent;
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

skillFills.forEach(fill => skillObserver.observe(fill));

// 3. Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.style.color = '#a855f7';
                }
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

// 4. Contact form handler
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
    setTimeout(() => {
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        btn.style.borderColor = '';
        e.target.reset();
    }, 3000);
}