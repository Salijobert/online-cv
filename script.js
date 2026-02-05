const mainContainer = document.querySelector('main');
const navLinks = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page-content');
const marker = document.getElementById('marker');
const blobs = document.querySelectorAll('.blob');

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    mainContainer.scrollTop = 0;
    
    const firstLink = document.querySelector('.nav-item');
    if(firstLink) indicator(firstLink);
    
    const homeSection = document.getElementById('home');
    if(homeSection) homeSection.classList.add('visible');
});

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

mainContainer.addEventListener('scroll', () => {
    const viewHeight = mainContainer.clientHeight;

    pageSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;

        const fadeDistance = sectionHeight / 1; 

        if (rect.top < 0) {
            let newOpacity = 1 + (rect.top / fadeDistance);
            
            if (newOpacity < 0) newOpacity = 0;
            section.style.opacity = newOpacity;
        } 
        else if (rect.bottom > viewHeight) {
            const hiddenAmount = rect.bottom - viewHeight;
            
            let newOpacity = 1 - (hiddenAmount / fadeDistance);

            if (newOpacity < 0) newOpacity = 0;
            section.style.opacity = newOpacity;
        }
        else {
            section.style.opacity = 1;
        }
    });
});


function indicator(element) {
    if(element) {
        marker.style.top = element.offsetTop + 'px';
        marker.style.height = element.offsetHeight + 'px';
    }
}

const observerOptions = {
    root: mainContainer, 
    threshold: 0.3       
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            const activeId = entry.target.id;
            const activeLink = document.querySelector(`.nav-item[href="#${activeId}"]`);

            navLinks.forEach(item => item.classList.remove('active'));

            if(activeLink) {
                activeLink.classList.add('active');
                indicator(activeLink);
            }
        }
    });
}, observerOptions);

pageSections.forEach(section => {
    observer.observe(section);
});

function animateBlob(blob) {
    const x = Math.random() * 120 - 20; 
    const y = Math.random() * 120 - 20;
    const scale = 0.8 + Math.random() * 0.7;
    const duration = 10000 + Math.random() * 10000; 
    
    blob.style.transitionDuration = `${duration}ms`;
    blob.style.transform = `translate(${x}vw, ${y}vh) scale(${scale})`;
    
    setTimeout(() => { animateBlob(blob); }, duration);
}

blobs.forEach(blob => animateBlob(blob));