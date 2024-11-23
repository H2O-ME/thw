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

    // 项目卡片点击事件
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const links = {
                '齐盛六班': 'https://xn--6-ti2c86fw58d.rth1.xyz/',
                '齐盛高中服务器1': 'https://h2o-me.github.io/',
                '齐盛高中服务器2': 'https://xn--yzyz67f.rth1.xyz/',
                '我的GitHub': 'https://github.com/H2O-ME',
                '米坛社区会员': 'https://www.bandbbs.cn/members/368236/'
            };
            const title = this.querySelector('h3').textContent;
            window.open(links[title], '_blank');
        });
    });
});
