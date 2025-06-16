function show(button) {
    const allBoxes = document.querySelectorAll('.experience-box');
    const allButtons = document.querySelectorAll('.experience-button');
    const id = button.getAttribute('data-id');

    allBoxes.forEach(box => {
        if (box.id === id) {
            box.classList.toggle('active');
        } else {
            box.classList.remove('active');
        }
    });

    allButtons.forEach(btn => {
        if (btn === button) {
            btn.classList.toggle('open');
        } else {
            btn.classList.remove('open');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const ball = document.querySelector('.bouncing-ball');
    const nav = document.querySelector('nav');

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let velocityY = 0;
    let velocityX = 0;
    let gravity = 0.5;
    let bounceFactor = 0.7;
    let friction = 0.98;
    let animationFrame;
    let lastMouseY = 0;
    let lastTime = 0;

    // Get nav line position
    function getNavLineY() {
        const navRect = nav.getBoundingClientRect();
        return navRect.bottom + window.scrollY;
    }

    // DRAGGING
    ball.addEventListener('mousedown', (e) => {
        isDragging = true;
        cancelAnimationFrame(animationFrame);
        velocityY = 0;
        velocityX = 0;

        const rect = ball.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        lastMouseY = e.clientY;
        lastTime = Date.now();

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;

        if (deltaTime > 0) {
            velocityY = (e.clientY - lastMouseY) / deltaTime * 16;
            lastMouseY = e.clientY;
            lastTime = currentTime;
        }

        let x = e.clientX + window.scrollX - offsetX;
        let y = e.clientY + window.scrollY - offsetY;

        const ballWidth = ball.offsetWidth;

        // Constrain horizontally to viewport
        x = Math.max(window.scrollX, Math.min(window.scrollX + window.innerWidth - ballWidth, x));

        // Can drag anywhere above nav line
        const navLineY = getNavLineY();
        y = Math.max(0, Math.min(navLineY - ball.offsetHeight, y));

        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;

        velocityY = Math.max(velocityY, 2);
        applyPhysics();
    });

    // PHYSICS
    function applyPhysics() {
        function animate() {
            if (isDragging) return;

            let currentX = parseFloat(ball.style.left) || 0;
            let currentY = parseFloat(ball.style.top) || 0;

            velocityY += gravity;
            velocityX *= friction;

            currentY += velocityY;
            currentX += velocityX;

            const ballWidth = ball.offsetWidth;
            const ballHeight = ball.offsetHeight;

            // Horizontal boundaries
            if (currentX <= window.scrollX) {
                currentX = window.scrollX;
                velocityX = -velocityX * bounceFactor;
            } else if (currentX >= window.scrollX + window.innerWidth - ballWidth) {
                currentX = window.scrollX + window.innerWidth - ballWidth;
                velocityX = -velocityX * bounceFactor;
            }

            // Bounce on nav line
            const navLineY = getNavLineY();
            if (currentY + ballHeight >= navLineY - 5) {
                currentY = navLineY - ballHeight - 5;
                velocityY = -velocityY * bounceFactor;
                velocityX += (Math.random() - 0.5) * 2;

                if (Math.abs(velocityY) < 0.5) {
                    velocityY = 0;
                    velocityX *= 0.8;

                    if (Math.abs(velocityX) < 0.1) {
                        return;
                    }
                }
            }

            ball.style.left = `${currentX}px`;
            ball.style.top = `${currentY}px`;

            animationFrame = requestAnimationFrame(animate);
        }

        animationFrame = requestAnimationFrame(animate);
    }

    // Prevent text selection while dragging
    document.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
    });
});
