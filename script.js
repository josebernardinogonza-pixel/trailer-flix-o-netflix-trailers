const API_KEY = 'b8ca0b4482da0071913fabf4148817fd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const main = document.getElementById('trending-container');
const hero = document.getElementById('hero');
const heroTitle = document.getElementById('hero-title');
const heroOverview = document.getElementById('hero-overview');

// 1. Obtener películas de la API
function getMovies() {
    fetch(`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => {
            showMovies(data.results);
            setupHero(data.results[0]); // Poner la más popular en el banner
        });
}

// 2. Crear las tarjetas de películas
function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');
        movieEl.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
        `;
        movieEl.onclick = () => getTrailer(movie.id);
        main.appendChild(movieEl);
    });
}

// 3. Configurar el banner principal
function setupHero(movie) {
    hero.style.backgroundImage = `linear-gradient(to right, rgba(20,20,20,0.9), transparent), url(${IMG_URL + movie.backdrop_path})`;
    heroTitle.innerText = movie.title;
    heroOverview.innerText = movie.overview;
}

// 4. Buscar y abrir el trailer
function getTrailer(id) {
    fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {
            const trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if(trailer) {
                const modal = document.getElementById('video-modal');
                const player = document.getElementById('video-player');
                player.innerHTML = `
                    <iframe width="100%" height="450px" src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" frameborder="0" allowfullscreen></iframe>
                `;
                modal.style.display = 'block';
            } else {
                alert("¡Vaya! No encontramos un trailer para esta película.");
            }
        });
}

// Cerrar el modal
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('video-player').innerHTML = '';
}

getMovies();
