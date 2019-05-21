const addArtist = (url, artistData) => {
    const params = {
        method: "POST",
        body: artistData,
    }
    return fetch(url, params)
        .then((data) => data.json())
};
 
const form = document.forms.addArtist;

form.addEventListener('submit', function (event) {
    // prevent default form submit
    event.preventDefault();
    // collect data from form
    const inputs = form.querySelectorAll('input');
    const inputArr = [...inputs];
    var artistData = new FormData();

    inputArr.forEach((element) => {
        if (element.type === 'submit') return;
        if (element.type === 'file') {
            artistData.append(element.name, element.files[0])
            return;
        }
        const value = element.value;
        artistData.append(element.name, value)
    });

    // send data to API
    addArtist('/api/artists', artistData)
        .then((artist) => {
            alert(`Created new artist with ID: ${artist._id} and name: ${artist.name}`)
        })
        .catch(err => {
            console.log(err)
        });
});
