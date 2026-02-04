
function enableDragScroll(containerClass) {
    const slider = document.querySelector(containerClass);
    if (!slider) return;

    let isDown = false, startX, scrollLeft;

    slider.addEventListener('mousedown', e => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        slider.scrollLeft = scrollLeft - (x - startX) * 2;
    });
}


document.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.querySelector(btn.dataset.target);
        if (!target) return;
        const distance = 400; // scroll pixels
        const dir = btn.dataset.dir === 'left' ? -distance : distance;
        target.scrollBy({ left: dir, behavior: 'smooth' });
    });
});


enableDragScroll('.milkshakes-container');
enableDragScroll('.blogs-container');
enableDragScroll('.products-container');
enableDragScroll('.reviews-container');
enableDragScroll('.gallery-container');
enableDragScroll('.aboutus-container');
enableDragScroll('.contactus-container');
enableDragScroll('.faqs-container');
enableDragScroll('.team-container');
enableDragScroll('.services-container');
enableDragScroll('.testimonials-container');
enableDragScroll('.portfolio-container');
enableDragScroll('.events-container');
enableDragScroll('.news-container');
enableDragScroll('.shop-container');
enableDragScroll('.features-container');
enableDragScroll('.partners-container');
enableDragScroll('.sponsors-container');




