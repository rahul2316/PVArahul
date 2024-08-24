async function searchGifs() {
    const searchTerm = document.getElementById('search-input').value;
    const response = await fetch(`/search-gifs?q=${encodeURIComponent(searchTerm)}`);
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (response.status === 404) {
        resultsContainer.innerHTML = '<p>GIFs not found</p>';
        return;
    }

    const gifs = await response.json();

    gifs.forEach(gif => {
        const gifDiv = document.createElement('div');
        gifDiv.className = 'gif';
        gifDiv.innerHTML = `
            <img src="${gif.url}" alt="${gif.title}" onclick="recordView('${gif.gif_id}')">
            <p>${gif.title}</p>
            <button onclick="recordLike('${gif.gif_id}')">Like</button>
        `;
        resultsContainer.appendChild(gifDiv);
    });
}

function recordView(gif_id) {
    fetch('/view-gif', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gif_id, user_id: 'anonymous_user' })
    });
}

function recordLike(gif_id) {
    fetch('/like-gif', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gif_id, user_id: 'anonymous_user' })
    });
}
