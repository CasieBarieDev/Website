let scrollTop, scrollEnabled = true;
const body = document.body;

function toggle() {
    if(scrollEnabled) {
        scrollTop = window.scrollY;
        body.classList.add('fixed-position');
        body.style.top = `-${scrollTop}px`;
        scrollEnabled = false;
    } else {
        body.classList.remove('fixed-position');
        window.scrollTo(0, scrollTop);
        scrollEnabled = true;
    }
}

const downButton = document.getElementById('down-button');
if(downButton !== null) {
    downButton.addEventListener('click', () => {
       document.querySelector('.scrollto').scrollIntoView({behavior: "smooth"});
    });

    window.addEventListener('scroll', () => {
       if(window.scrollY >= 10) {downButton.style.opacity = '0';
       } else {downButton.style.opacity = '1';}
    });
}

document.querySelectorAll('form, input, select, textarea').forEach(el => {
    el.setAttribute('autocomplete', 'off');
});

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