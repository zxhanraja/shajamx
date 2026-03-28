export default class AppHeader extends HTMLElement {
  connectedCallback() {
    const activePage = this.getAttribute('active-page');
    this.innerHTML = `
      <header id="header">
        <a href="index.html" class="nav-logo" style="text-decoration: none;">SHAJAMX</a>
        <nav class="nav-links">
          <a href="services.html" class="nav-link ${activePage === 'services' ? 'active' : ''}">Services</a>
          <a href="index.html#why-us" class="nav-link ${activePage === 'why-us' ? 'active' : ''}">Why Us</a>
          <a href="work.html" class="nav-link ${activePage === 'work' ? 'active' : ''}">Work</a>
          <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">About</a>
        </nav>
        <div class="header-right">
          <a href="index.html#contact" class="nav-cta">Let's Talk</a>
          <div class="hamburger-menu">
            <span class="line-1"></span>
            <span class="line-2"></span>
            <span class="line-3"></span>
          </div>
        </div>
        
        <div class="mobile-menu-overlay">
          <nav class="mobile-nav-links">
            <a href="services.html" class="nav-link ${activePage === 'services' ? 'active' : ''}">SERVICES</a>
            <a href="index.html#why-us" class="nav-link ${activePage === 'why-us' ? 'active' : ''}">WHY US</a>
            <a href="work.html" class="nav-link ${activePage === 'work' ? 'active' : ''}">WORK</a>
            <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">ABOUT</a>
            <a href="index.html#contact" class="mobile-nav-cta">LET'S TALK</a>
          </nav>
        </div>
      </header>
    `;

    setTimeout(() => {
      const hamburger = this.querySelector('.hamburger-menu');
      const overlay = this.querySelector('.mobile-menu-overlay');
      const mobileLinks = this.querySelectorAll('.mobile-nav-links .nav-link');
      const desktopLinks = this.querySelectorAll('.nav-links .nav-link');
      const allNavLinks = [...mobileLinks, ...desktopLinks];

      let menuOpen = false;

      // Close mobile menu on click
      allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (menuOpen) hamburger.click();
        });
      });

      if (hamburger && overlay && window.gsap) {
        hamburger.addEventListener('click', () => {
          if (!menuOpen) {
            menuOpen = true;
            gsap.to(hamburger.querySelector('.line-1'), { y: 7, rotation: 45, duration: 0.3 });
            gsap.to(hamburger.querySelector('.line-2'), { opacity: 0, duration: 0.3 });
            gsap.to(hamburger.querySelector('.line-3'), { y: -7, rotation: -45, duration: 0.3 });
            
            gsap.to(overlay, { 
              autoAlpha: 1, 
              duration: 0.5, 
              ease: "power3.out",
              onStart: () => overlay.style.pointerEvents = "auto"
            });
            gsap.fromTo(this.querySelectorAll('.mobile-nav-links a'), 
              { y: 30, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)", delay: 0.1 }
            );
          } else {
            menuOpen = false;
            gsap.to(hamburger.querySelector('.line-1'), { y: 0, rotation: 0, duration: 0.3 });
            gsap.to(hamburger.querySelector('.line-2'), { opacity: 1, duration: 0.3 });
            gsap.to(hamburger.querySelector('.line-3'), { y: 0, rotation: 0, duration: 0.3 });
            
            gsap.to(overlay, { 
              autoAlpha: 0, 
              duration: 0.4, 
              ease: "power3.in",
              onComplete: () => overlay.style.pointerEvents = "none"
            });
          }
        });
      }
    }, 200);
  }
}
customElements.define('app-header', AppHeader);
