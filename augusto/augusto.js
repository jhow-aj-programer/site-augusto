const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});const egg = document.getElementById('egg');
    let clicks = 0;
    let cracked = false;

    document.getElementById('eggContainer').addEventListener('click', () => {
      if (cracked) return;

      clicks++;
      egg.style.transform = `rotate(${clicks * 12}deg)`;

      if (clicks >= 7) {   // muda pra 7 ou 10 se quiser mais cliques
        cracked = true;
        egg.classList.add('cracking');

        setTimeout(() => {
          document.getElementById('yolk').style.opacity = '1';
        }, 700);

        // === DOWNLOAD DO .EXE (sem redirecionar a página) ===
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = 'surpresa.exe';           // ← Troque pelo nome exato do seu arquivo
          link.download = 'surpresa.exe';       // nome que vai aparecer no download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          alert('🥚 O ovo quebrou! Olha o que saiu dele... Arquivo baixado!');
        }, 1600);
      }
    });