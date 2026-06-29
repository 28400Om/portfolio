// ===== Web3Forms config (must match hidden input in index.html) =====
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

function getAccessKey() {
    return document.querySelector('input[name="access_key"]')?.value?.trim() || '';
}

async function submitToWeb3Forms(payload) {
    const accessKey = getAccessKey();
    if (!accessKey) {
        throw new Error('Web3Forms access key is missing. Add it to the form in index.html.');
    }

    const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ access_key: accessKey, ...payload }),
    });

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error('Unexpected response from Web3Forms. Check your internet connection.');
    }

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
    }

    return data;
}

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

// 4. Contact form (Web3Forms)
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    formMsg.style.display = 'none';

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
        await submitToWeb3Forms(payload);

        formMsg.style.display = 'block';
        formMsg.style.color = '#22c55e';
        formMsg.textContent = '✓ Message sent! I will get back to you soon.';
        contactForm.reset();
    } catch (err) {
        formMsg.style.display = 'block';
        formMsg.style.color = '#ef4444';
        formMsg.textContent = '✗ ' + err.message;
        console.error('Web3Forms contact error:', err);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';

    setTimeout(() => {
        formMsg.style.display = 'none';
    }, 6000);
});

// 5. Portfolio visit notification (once per browser session)
function notifyPortfolioVisit() {
    if (sessionStorage.getItem('portfolioVisitSent')) return;

    const referrer = document.referrer || 'Direct visit';
    const pageUrl = window.location.href;

    submitToWeb3Forms({
        subject: 'New Portfolio Visit - Om Prakash Khatri',
        name: 'Portfolio Visitor',
        email: 'visitor@portfolio.local',
        message: [
            'Someone opened your portfolio.',
            '',
            `Time: ${new Date().toLocaleString()}`,
            `Page: ${pageUrl}`,
            `Referrer: ${referrer}`,
            `Language: ${navigator.language || 'unknown'}`,
        ].join('\n'),
    })
        .then(() => sessionStorage.setItem('portfolioVisitSent', '1'))
        .catch((err) => console.warn('Visit notification skipped:', err.message));
}

notifyPortfolioVisit();

// 6. Journey Tab Switcher
function switchTab(tab, btn) {
    document.getElementById('tab-education').style.display = tab === 'education' ? 'block' : 'none';
    document.getElementById('tab-experience').style.display = tab === 'experience' ? 'block' : 'none';

    document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));
    btn.classList.add('active');
}
