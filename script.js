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

// 3. Web3Forms Contact Form Submission
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formMsg     = document.getElementById('formMsg');

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

    const formData = new FormData(contactForm);
    const object   = Object.fromEntries(formData);
    const json     = JSON.stringify(object);

    try {
        const res  = await fetch('https://api.web3forms.com/submit', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body:    json
        });
        const data = await res.json();

        if (data.success) {
            formMsg.style.display = 'block';
            formMsg.style.color   = '#22c55e';
            formMsg.textContent   = '✓ Message sent! I will get back to you soon.';
            contactForm.reset();
        } else {
            formMsg.style.display = 'block';
            formMsg.style.color   = '#ef4444';
            formMsg.textContent   = '✗ Something went wrong. Please try again.';
        }
    } catch (err) {
        formMsg.style.display = 'block';
        formMsg.style.color   = '#ef4444';
        formMsg.textContent   = '✗ Network error. Please try again.';
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';

    setTimeout(() => { formMsg.style.display = 'none'; }, 5000);
});

// 4. Journey Tab Switcher
function switchTab(tab) {
    document.getElementById('tab-education').style.display  = tab === 'education'  ? 'block' : 'none';
    document.getElementById('tab-experience').style.display = tab === 'experience' ? 'block' : 'none';

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}
