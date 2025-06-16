function show(button) {
    const id = button.dataset.id;
    const x = document.getElementById(id);
    const isHidden = window.getComputedStyle(x).display === 'none';
    x.style.display = isHidden ? 'block' : 'none';
}
