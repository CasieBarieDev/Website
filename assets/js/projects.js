const portfolio = document.querySelector('.portfolio');
const filters = portfolio.querySelector('.portfolio-filters');
const categoryButtons = [...filters.querySelectorAll('[data-filter]')];
const statusSelect = filters.querySelector('.portfolio-status-filter');
const statusIcons = filters.querySelectorAll('.portfolio-status-picker > .project-card-icon');
const projects = portfolio.querySelectorAll('.project[data-category]');
const emptyMessage = portfolio.querySelector('.portfolio-empty');

function applyFilters(category, status) {
    categoryButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    });
    if(statusSelect !== null) {statusSelect.value = status;}
    statusIcons.forEach(icon => {icon.hidden = !icon.classList.contains(status);});

    let hasMatches = false;
    projects.forEach(project => {
        const matchesCategory = category === 'all' || project.dataset.category === category;
        const matchesStatus = status === 'all' || project.dataset.status === status;
        project.hidden = !(matchesCategory && matchesStatus);
        hasMatches ||= !project.hidden;
    });
    emptyMessage.hidden = hasMatches;
}

function restoreFilters() {
    const {projectCategory, projectStatus} = history.state ?? {};
    const category = categoryButtons.find(button => button.dataset.filter === projectCategory)?.dataset.filter;
    const status = statusSelect !== null && [...statusSelect.options].some(option => option.value === projectStatus)
        ? projectStatus : 'all';
    applyFilters(category ?? 'all', status ?? 'all');
}

filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if(button === null) {return;}
    history.replaceState({...history.state, projectCategory: button.dataset.filter}, '');
    restoreFilters();
});

statusSelect?.addEventListener('change', () => {
    history.replaceState({...history.state, projectStatus: statusSelect.value}, '');
    restoreFilters();
});

window.addEventListener('popstate', restoreFilters);
restoreFilters();
filters.hidden = false;
