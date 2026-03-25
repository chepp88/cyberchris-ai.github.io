document.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById('chatIcon');
    const windowEl = document.getElementById('chatWindow');
    const input = document.getElementById('chatInput');
    const btn = document.getElementById('chatSendBtn');

    if(icon) icon.onclick = () => windowEl.classList.toggle('active');

    if(btn) {
        btn.onclick = () => {
            const msg = input.value;
            if(!msg) return;
            // Append message logic here
            input.value = '';
        };
    }
});
