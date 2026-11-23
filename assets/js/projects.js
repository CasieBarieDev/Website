const portfolio = document.querySelector('.portfolio');
const filters = portfolio.querySelector('.portfolio-filters');
const buttons = [...filters.querySelectorAll('[data-filter]')];
const projects = portfolio.querySelectorAll('.project[data-category]');

function applyFilter(category) {
    buttons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    });

    projects.forEach(project => {
        project.hidden = category !== 'all' && project.dataset.category !== category;
    });
}

function restoreFilter() {
    const category = history.state?.projectCategory;
    applyFilter(buttons.some(button => button.dataset.filter === category) ? category : 'all');
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.filter;
        history.replaceState({...history.state, projectCategory: category}, '');
        applyFilter(category);
    });
});

window.addEventListener('popstate', restoreFilter);
restoreFilter();
filters.hidden = false;
