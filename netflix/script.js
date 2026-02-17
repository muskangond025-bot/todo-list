document.querySelectorAll('.faq-box').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');
        const plus = item.querySelector('.plus');
        const isOpen = answer.classList.contains('show');
        
        document.querySelectorAll('.faq-answer').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.plus').forEach(el => el.style.transform = 'rotate(0deg)');

        if (!isOpen) {
            answer.classList.add('show');
            plus.style.transform = 'rotate(45deg)';
        }
    });
});
function scrollGrid(direction) {
    const grid = document.querySelector('.movie-grid');
    const scrollAmount = 300;
    grid.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}