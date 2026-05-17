// ========== PARTICLES JS CONFIGURATION ==========
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 65, density: { enable: true, value_area: 800 } },
                color: { value: "#7aa2f7" },
                shape: { type: "circle" },
                opacity: { value: 0.25, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: true, distance: 140, color: "#7aa2f7", opacity: 0.12, width: 1 },
                move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: false }, resize: true },
            },
            retina_detect: true
        });
    }
}
