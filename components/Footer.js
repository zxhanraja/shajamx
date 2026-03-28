export default class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer id="footer">
        <canvas id="footer-canvas"></canvas>
        <div class="footer-top">
          <div class="footer-left">
            <div class="footer-logo">SHAJAMX</div>
            <div class="footer-tagline">Where Code Meets Craft</div>
          </div>
          <div class="footer-right">
            <a href="services.html" class="footer-link">Services</a>
            <a href="work.html" class="footer-link">Work</a>
            <a href="about.html" class="footer-link">About</a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="copyright">&copy; 2026 ShajaмX. All rights reserved.</div>
          <div class="built-with">Built with ❤️ + GSAP + Three.js</div>
        </div>
        
        <div class="footer-ticker-container">
          <div class="footer-ticker-track">
            <div class="footer-ticker-inner">
              CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS ·
            </div>
            <div class="footer-ticker-inner">
              CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS · CREATIVITY · TECHNOLOGY · DESIGN · STRATEGY · INNOVATION · VISUALS ·
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('app-footer', AppFooter);
