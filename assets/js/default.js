let scrollTop, scrollEnabled = true;
const body = document.body;
const menuToggle = document.getElementById('menu-active');
const siteNav = document.querySelector('nav.site-nav');
const scrollPadding = 12;

function lockScroll() {
    scrollTop = window.scrollY;
    body.classList.add('fixed-position');
    body.style.top = `-${scrollTop}px`;
    scrollEnabled = false;
}

function unlockScroll() {
    body.classList.remove('fixed-position');
    body.style.top = '';
    window.scrollTo(0, scrollTop || 0);
    scrollEnabled = true;
}

function toggle() {
    if(scrollEnabled) {lockScroll();
    } else {unlockScroll();}
}

function updateHeaderState() {
    if(siteNav !== null) {
        siteNav.classList.toggle('scrolled', window.scrollY > 8);
    }
}

function syncMenuStateForViewport() {
    if(menuToggle === null) {return;}
    if(window.matchMedia('(min-width: 769px)').matches && menuToggle.checked) {
        menuToggle.checked = false;
        if(!scrollEnabled) {unlockScroll();}
    }
}

function scrollToTarget(target, smooth = true) {
    if(target === null) {return;}
    const headerOffset = siteNav !== null ? siteNav.getBoundingClientRect().height : 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset - scrollPadding;
    window.scrollTo({top: Math.max(0, targetY), behavior: smooth ? "smooth" : "auto"});
}

function scrollToHashTarget() {
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    if(hashId.length === 0) {return;}
    const hashTarget = document.getElementById(hashId);
    if(hashTarget === null) {return;}
    scrollToTarget(hashTarget, false);
}

const downButton = document.getElementById('down-button');
if(downButton !== null) {
    downButton.addEventListener('click', () => {
       scrollToTarget(document.querySelector('.scrollto'));
    });

    window.addEventListener('scroll', () => {
       if(window.scrollY >= 10) {downButton.style.opacity = '0';
       } else {downButton.style.opacity = '1';}
    });
}

window.addEventListener('scroll', updateHeaderState);
window.addEventListener('resize', syncMenuStateForViewport);
window.addEventListener('hashchange', () => {
    scrollToHashTarget();
});
updateHeaderState();
syncMenuStateForViewport();

if(window.location.hash.length > 1) {
    window.requestAnimationFrame(() => scrollToHashTarget());
}

document.querySelectorAll('form, input, select, textarea').forEach(el => el.setAttribute('autocomplete', 'off'));

document.querySelectorAll('.modal-image').forEach(image => {
    const modal = image.nextElementSibling;
    const modalImg = modal.querySelector('.modal-content');
    const caption = modal.querySelector('.modal-caption');
    modalImg.src = image.src;
    caption.textContent = image.alt;

    image.addEventListener('click', () => {
        modal.style.display = 'block';
        toggle();
    });

    modal.addEventListener('click', () => {
        modal.style.display = 'none';
        toggle();
    });
});

function copy() {
    document.querySelectorAll('.copy').forEach(copyElement => {
        const text = copyElement.cloneNode(true);
        text.querySelectorAll('*').forEach(child => child.remove());
        const textContent = text.textContent;
        copyElement.setAttribute('title', 'Copy');
        copyElement.style.cursor = 'pointer';
        copyElement.addEventListener('click', () => {
            navigator.clipboard.writeText(textContent)
                .then(() => {copyElement.style.cursor = 'auto';})
                .catch(err => {console.error('Failed to copy text:', err);}
            );
        });

        copyElement.addEventListener('mouseout', () => {copyElement.style.cursor = 'pointer';});
    });
} copy()