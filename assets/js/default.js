let scrollTop, scrollEnabled = true;
const body = document.body;
const menuToggle = document.getElementById('menu-active');
const siteNav = document.querySelector('nav.site-nav');
const scrollPadding = 12;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const projectTransitionName = 'project-image';
const projectTransitionStyleId = 'project-transition-style';
const samePageReloadToTopKey = 'same-page-reload-to-top';

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

function reloadFromTop() {
    try {
        sessionStorage.setItem(samePageReloadToTopKey, '1');
    } catch(err) {}
    window.location.reload();
}

function isPrimaryNavigationClick(event, link) {
    if(
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target.length > 0 ||
        link.hasAttribute('download')
    ) {return false;}

    return true;
}

function normalizedPath(url) {return url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';}
function escapeAttribute(value) {return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');}
function getPathDepth(path) {return path.split('/').filter(Boolean).length;}
function getProjectCardImageForPath(path) {
    const trimmedPath = path === '/' ? path : path.replace(/\/$/, '');
    return document.querySelector([
        `.project[href="${escapeAttribute(trimmedPath)}"] .image img`,
        `.project[href="${escapeAttribute(`${trimmedPath}/`)}"] .image img`,
        `.project[href="${escapeAttribute(`${trimmedPath}.html`)}"] .image img`
    ].join(', '));
}
function getProjectHeroImage() {return document.querySelector('.row.top .left > img');}
function clearPageTransitionDirection() {document.documentElement.removeAttribute('data-transition-direction');}
function clearSamePageTransition() {document.documentElement.classList.remove('same-page-transition');}

function getParentPath(path) {
    const segments = path.split('/').filter(Boolean);
    if(segments.length <= 1) {return '/';}
    return `/${segments.slice(0, -1).join('/')}`;
}

function isProjectPairPath(fromPath, toPath) {
    const fromDepth = getPathDepth(fromPath);
    const toDepth = getPathDepth(toPath);
    return (toDepth >= 2 && getParentPath(toPath) === fromPath) || (fromDepth >= 2 && getParentPath(fromPath) === toPath);
}

function clearProjectTransitionNames() {
    document.getElementById(projectTransitionStyleId)?.remove();
    document.documentElement.classList.remove('project-transition');
    document.querySelectorAll('.row.top .left img, .project .image img').forEach(element => {element.style.viewTransitionName = '';});
}

window.addEventListener('pageswap', async event => {
    if(reducedMotion.matches || event.viewTransition === null || event.activation === null || event.activation.from === null) {return;}

    clearSamePageTransition();
    clearProjectTransitionNames();
    clearPageTransitionDirection();

    const currentPath = normalizedPath(new URL(event.activation.from.url));
    const targetPath = normalizedPath(new URL(event.activation.entry.url));
    if(!isProjectPairPath(currentPath, targetPath)) {return;}

    const outgoingProjectImage = getProjectCardImageForPath(targetPath);
    const heroImage = getProjectHeroImage();
    const transitionImage = outgoingProjectImage ?? (heroImage !== null && getParentPath(currentPath) === targetPath ? heroImage : null);
    if(transitionImage === null) {return;}

    document.documentElement.classList.add('project-transition');
    transitionImage.style.viewTransitionName = projectTransitionName;

    try {await event.viewTransition.finished;
    } finally {clearProjectTransitionNames();}
});

document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if(link === null || !isPrimaryNavigationClick(event, link)) {return;}

    const targetUrl = new URL(link.href, window.location.href);
    const currentUrl = new URL(window.location.href);
    if(targetUrl.origin !== currentUrl.origin) {return;}

    const samePath = normalizedPath(targetUrl) === normalizedPath(currentUrl);
    const sameSearch = targetUrl.search === currentUrl.search;
    const sameHash = targetUrl.hash === currentUrl.hash;
    if(samePath && sameSearch && sameHash) {
        event.preventDefault();
        reloadFromTop();
    }
}, true);

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
window.addEventListener('hashchange', () => {scrollToHashTarget();});
updateHeaderState();
syncMenuStateForViewport();

if(window.location.hash.length > 1) {window.requestAnimationFrame(() => scrollToHashTarget());}

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
