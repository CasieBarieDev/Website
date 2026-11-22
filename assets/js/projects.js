const portfolio = document.querySelector('.portfolio');
const filters = portfolio.querySelector('.portfolio-filters');
const buttons = filters.querySelectorAll('[data-filter]');
const projects = portfolio.querySelectorAll('.project[data-category]');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.filter;

        buttons.forEach(option => {
            option.setAttribute('aria-pressed', String(option === button));
        });

        projects.forEach(project => {
            project.hidden = category !== 'all' && project.dataset.category !== category;
        });
    });
});

filters.hidden = false;
