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

const updateArtist = (url, artistData) => {
    const params = {
        method: "PUT",
        body: artistData,
    }
    return fetch(url, params)
        .then((data) => data.json())
};

const hide = (el) => {
    el.style.display = 'none';
}
const show = (el) => {
    el.style.display = 'block'
}

// Set Photo To Canvas Function
function setImageToCanvas(image, id, canvas, context, width = image.width, height = image.height) {
    var ratio = width / height;
    var newWidth = canvas.width;
    var newHeight = canvas.height;
    // if (newHeight > canvas.height) {
    //     newHeight = canvas.height;
    //     newWidth = newHeight * ratio;
    // }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, newWidth, newHeight);
    id.setAttribute('src', canvas.toDataURL('image/png'));
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
                <!-- Canvas For Uploaded Image -->
                <canvas class="uploadCanvas"></canvas>
                <!-- Default Canvas Image -->
                <figure class="image is-16by9">
                    <img src="${photoSrc}" class="js-artist-img" alt="Placeholder image">
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

let uploadCanvas;
let uploadContext;
let uploadedPhoto;
let uploadPhotoInput;

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
        prevValues = {};
        uploadCanvas = card.querySelector('.uploadCanvas');
        uploadContext = uploadCanvas.getContext('2d');
        uploadedPhoto = card.querySelector('.js-artist-img');

        card.classList.add('is-edited');

        show(overlay);
        hide(editBtn);
        hide(deleteBtn);
        cardControls = document.createElement('div');
        cardControls.innerHTML = `
        <button class="button js-cancel is-light">Cancel</button>
        <button class="button js-save is-link">Save</button>
        `
        addImgBtn = document.createElement('div');
        addImgBtn.classList.add('field', 'card-add-img');
        addImgBtn.innerHTML = `
        <div class="file is-link is-small">
            <label class="file-label">
                <input class="file-input js-upload-photo" type="file" name="photo" data-name="photo">
                <span class="file-cta">
                    <span class="file-icon">
                        <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                        update photo…
                    </span>
                </span>
            </label>
        </div>
        `
        card.appendChild(cardControls);
        card.appendChild(addImgBtn);

        editableElements = card.querySelectorAll('[data-name]');

        editableElements.forEach((el) => {
            const elementName = el.dataset.name;
            if (elementName === 'photo') {
                const imgSrc = card.querySelector('.js-artist-img').src;
                prevValues[elementName] = imgSrc;
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
            if (elementName === 'photo') {
                    const img = card.querySelector('.js-artist-img');
                    img.src = prevValues[elementName];
                return;
            }
            el.textContent = prevValues[elementName];
            el.setAttribute('contenteditable', false);
        });

        cardControls.remove();
        addImgBtn.remove();
        hide(overlay);
        show(editBtn);
        show(deleteBtn);
        card.classList.remove('is-edited');

    }

    if (element.classList.contains('js-save')) {
        e.stopPropagation();
        let updatedValues = new FormData();

        editableElements.forEach((el) => {
            const elementName = el.dataset.name;
            if (elementName === 'photo') {
                if (el.files && el.files[0]) {
                    updatedValues.append(elementName, el.files[0]);
                } else {
                    const imgNameRegExp = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}\.(?:jpeg|png|jpg)/;
                    const imgSrc = card.querySelector('.js-artist-img').src;
                    const imgName = imgSrc.match(imgNameRegExp) && imgSrc.match(imgNameRegExp)[0];
                    updatedValues.append(elementName, imgName);
                }
                return;
            }
            const elementTextValue = el.textContent.trim();
            updatedValues.append(elementName, elementTextValue);
        });

        updateArtist(`/api/artists/${id}`, updatedValues)
            .then((updateData) => {
                editableElements.forEach((el) => {
                    const elementName = el.dataset.name;
                    if (elementName === 'photo') {
                        return;
                    }
                    el.setAttribute('contenteditable', false);
                });
                cardControls.remove();
                addImgBtn.remove();
                hide(overlay);
                show(editBtn);
                show(deleteBtn);
                card.classList.remove('is-edited');
                // set updated photo to corresponding img in our card in DOM
                if (updateData.photo) {
                    const artistImg = card.querySelector('.js-artist-img');
                    artistImg.src = `/uploads/${updateData.photo}`;
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
})

cardDeck.addEventListener('change', function (e) {
    const element = e.target;
    if(element.classList.contains('js-upload-photo')) {
        const imageUploadInput = element;
         // Get File Extension
        var ext = imageUploadInput.files[0]['name'].substring(imageUploadInput.files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
        // If File Exists & Image
        if (imageUploadInput.files && imageUploadInput.files[0] && (ext == "png" || ext == "jpeg" || ext == "jpg")) {
        // Set Photo To Canvas
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.src = e.target.result;
            img.onload = function() {
            setImageToCanvas(img, uploadedPhoto, uploadCanvas, uploadContext);
            }
        }
        reader.readAsDataURL(imageUploadInput.files[0]);
        }
    }
})

