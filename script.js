document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const container = document.querySelector('.container');

    function checkScroll() {
        const scrollPosition = container.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - windowHeight/2 &&
                scrollPosition < sectionTop + sectionHeight - windowHeight/2) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // 添加平滑滚动
    container.style.scrollBehavior = 'smooth';

    // 监听滚动事件
    container.addEventListener('scroll', checkScroll);
    
    // 初始检查
    checkScroll();

    // 向下滚动按钮点击事件
    document.querySelector('.scroll-down').addEventListener('click', function() {
        const nextSection = document.querySelector('#section2');
        nextSection.scrollIntoView({ behavior: 'smooth' });
    });
});
