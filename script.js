const API_KEY = 'b8ca0b4482da0071913fabf4148817fd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const main = document.getElementById('trending-container');
const hero = document.getElementById('hero');
const heroTitle = document.getElementById('hero-title');
const heroOverview = document.getElementById('hero-overview');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

function getMovies() {
    fetch(`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => {
            showMovies(data.results);
            setupHero(data.results[0]);
        });
}

function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
        if(movie.poster_path) {
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie-card');
            movieEl.innerHTML = `<img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">`;
            movieEl.onclick = () => getTrailer(movie.id);
            main.appendChild(movieEl);
        }
    });
}

function setupHero(movie) {
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${IMG_URL + movie.backdrop_path})`;
    heroTitle.innerText = movie.title;
    heroOverview.innerText = movie.overview;
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value;
    if(query) {
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES`)
            .then(res => res.json())
            .then(data => {
                showMovies(data.results);
                document.querySelector('.row h3').innerText = `Resultados: ${query}`;
            });
    }
});

function getTrailer(id) {
    fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {
            const trailer = videoData.results.find(v => v.type === 'Trailer');
            if(trailer) {
                document.getElementById('video-modal').style.display = 'block';
                document.getElementById('video-player').innerHTML = `
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" frameborder="0" allowfullscreen></iframe>
                `;
            } else { alert("Trailer no disponible."); }
        });
}

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('video-player').innerHTML = '';
}

getMovies();
