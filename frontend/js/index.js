const getArtists = (url) => {
    const params = {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }
    return fetch(url, params)
        .then((data) => data.json())
};

const deleteArtist = (url) => {
    const params = {
        method: "DELETE",
    }
    return fetch(url, params)
};

const hide = (el) => {
    el.style.display = 'none';
}
const show = (el) => {
    el.style.display = 'block'
}

const cardDeck = document.querySelector('.card-deck');

getArtists('/api/artists')
    .then((json) => {
        const loading = document.querySelector('.loading');
        json.forEach(artist => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.style.width = "360px";

            const photoSrc = artist.photo ? `/uploads/${artist.photo}` : "https://bulma.io/images/placeholders/1280x960.png"
            card.dataset.id = artist._id;
            card.innerHTML = `
                <span class="card-delete">╳</span>
                <span class="card-edit">✎</span>
                <div class="card-image">
                <figure class="image is-16by9">
                    <img src="${photoSrc}"  data-name="image" alt="Placeholder image">
                </figure>
                </div>
                <div class="card-content">
                <div class="media">
                    <div class="media-left">
                    <figure class="image is-48x48">
                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                    </figure>
                    </div>
                    <div class="media-content">
                    <p class="title is-4" data-name="name">${artist.name}</p>
                    <p class="subtitle is-6">@johnsmith</p>
                    </div>
                </div>

                <div class="content" data-name="description">
                ${artist.description || 'no description'}
                </div>
                </div>
            `;
            cardDeck.appendChild(card);
            loading.style.display = 'none';
        });
    })
    .catch(err => {
        console.log(err)
    });


let card;
let id;
let overlay = document.querySelector('.overlay');
let deleteBtn;
let editBtn;
let editableElements;
let prevValues = {};
let cardControls;

cardDeck.addEventListener('click', function (e) {
    const element = e.target;
    if (element.classList.contains('card-delete')) {
        e.stopPropagation();
        card = element.parentElement;
        id = card.dataset.id;
        deleteArtist(`/api/artists/${id}`)
            .then(() => {
                card.innerHTML = "";
                card.remove();
            })
            .catch((e) => {
                console.log(e);
            })
    }
    if (element.classList.contains('card-edit')) {
        e.stopPropagation();
        card = element.parentElement;
        id = card.dataset.id;
        deleteBtn = card.querySelector('.card-delete');
        editBtn = card.querySelector('.card-edit');
        editableElements = card.querySelectorAll('[data-name]');
        prevValues = {};

        card.classList.add('is-edited');

        show(overlay);
        hide(editBtn);
        hide(deleteBtn);
        cardControls = document.createElement('div');
        cardControls.innerHTML = `
        <button class="button js-cancel is-light">Cancel</button>
        <button class="button js-save is-link">Save</button>
        `
        card.appendChild(cardControls);


        editableElements.forEach((el) => {
            const elementName = el.dataset.name;
            if (elementName === 'image') {
                prevValues[elementName] = el.src;
                return;
            }
            prevValues[elementName] = el.textContent.trim();
            el.setAttribute('contenteditable', true);
        });
    }

    if (element.classList.contains('js-cancel')) {
        e.stopPropagation();

        editableElements.forEach((el) => {
            const elementName = el.dataset.name;
            if (elementName === 'image') {
                el.src = prevValues[elementName];
                return;
            }
            el.textContent = prevValues[elementName];
            el.setAttribute('contenteditable', false);
        });

        cardControls.remove();
        hide(overlay);
        show(editBtn);
        show(deleteBtn);
        card.classList.remove('is-edited');

    }

    if (element.classList.contains('js-save')) {
        e.stopPropagation();
        let updatedValues;

        editableElements.forEach((el) => {
            const elementName = el.dataset.name;
            if (elementName === 'image') {
                if (el.src !== prevValues[elementName]) {
                    updatedValues[elementName];
                }
                return;
            }
            if (el.textContent !== prevValues[elementName]) {
                updatedValues[elementName];
            }
            el.setAttribute('contenteditable', false);
        });

        updateArtist(`/api/artists/${id}`, updatedValues)
            .then(() => {
                editableElements.forEach((el) => {
                    if(elementName === 'image') {
                        return;
                    }
                    el.setAttribute('contenteditable', false);
                });
                cardControls.remove();
                hide(overlay);
                show(editBtn);
                show(deleteBtn);
                card.classList.remove('is-edited');
            })
            .catch((e) => {
                console.log(e);
            })
    }
})

