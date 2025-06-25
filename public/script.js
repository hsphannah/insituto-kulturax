// Espera que todo o conteúdo do HTML seja carregado antes de executar qualquer script.
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MENU HAMBÚRGUER ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav');

    if (hamburgerMenu && nav) { // Verifica se os elementos do menu existem
        hamburgerMenu.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            });
        });
    }

    // --- LÓGICA DO CARROSSEL DE AÇÕES ---
    const acoesCarousel = document.querySelector('.acoes-carousel');

    // Executa a lógica do carrossel APENAS se o elemento existir na página
    if (acoesCarousel) {
        let scrollAmount = 0;
        const scrollStep = 300;
        const scrollInterval = 3000;

        function autoScrollCarousel() {
            if (scrollAmount < acoesCarousel.scrollWidth - acoesCarousel.clientWidth) {
                scrollAmount += scrollStep;
            } else {
                scrollAmount = 0;
            }
            acoesCarousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }

        let carouselTimer = setInterval(autoScrollCarousel, scrollInterval);

        acoesCarousel.addEventListener('mouseenter', () => {
            clearInterval(carouselTimer);
        });

        acoesCarousel.addEventListener('mouseleave', () => {
            carouselTimer = setInterval(autoScrollCarousel, scrollInterval);
        });
    }

    // --- LÓGICA PARA CARREGAR NOTÍCIAS ---
    // (Esta função já estava correta, agora apenas está dentro do DOMContentLoaded)
    async function carregarNoticias() {
        const container = document.getElementById('noticias-container');
        if (!container) return; // Se não houver container de notícias, não faz nada.

        try {
            const response = await fetch('/api/noticias');
            if (!response.ok) {
                throw new Error('Não foi possível buscar as notícias.');
            }
            const noticias = await response.json();
            container.innerHTML = '';

            if (noticias.length === 0) {
                container.innerHTML = '<p>Nenhuma novidade no momento.</p>';
                return;
            }

            noticias.forEach(noticia => {
                const noticiaHtml = `
                    <div class="noticia-item">
                        <h4>${noticia.titulo}</h4>
                        <p>${noticia.conteudo}</p>
                        <a href="#" class="leia-mais-link">Leia mais</a> 
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', noticiaHtml);
            });
        } catch (error) {
            console.error('Erro:', error);
            container.innerHTML = '<p>Ocorreu um erro ao carregar as notícias. Tente novamente mais tarde.</p>';
        }
    }

    // Chama a função para carregar as notícias
    carregarNoticias();

});