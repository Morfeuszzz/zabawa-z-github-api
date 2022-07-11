const btn = document.getElementById("submit");
const div_for_repos = document.getElementById("all-repos");

btn.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    let repos_array = [];
    div_for_repos.innerHTML = "";

    async function getAllRepos() {
        let api_repo_url = `https://api.github.com/users/${username}/repos`;
        const response = await fetch(api_repo_url, {
            // (options section)w drugim parametrze fetch czyli w tym, określa się wartości działania na API, np zmiana metody z defaoultowej(GET) na przykładowo POST, ustawiania headers, credentials, cache, redirect itp.
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(res) //nie moze być ustawione jak wysyła się zapytanie GET
        });
        return response;  //zwracamy response czyli fetchowaną odp z API oraz parsujemy(.json()) ją na natywny JavaScriptowy obiekt, JEDNAK parsujemy na json przy wywołaniu funkcji
    }
    getAllRepos()
        .then(response => {
            if (!response.ok) {     //fetch zwraca zawsze powodzenie z wyjątkiem problemu z netem, w tym if-ie sprawdza czy kod po pobraniu danych jest kodem 200 to okej czy 400/500 to wtedy powie że coś nie tak. Ale funkcja res.ok nie działa na responsie który jest po .json czyli zamieniony na JS object
                //defaultowo .then wszystko pozaprobleme z netem uznaje za okej, dlatego sprawdzam response poprzez metode .ok
                console.log("nie działa wariacie");
                throw new Error(`HTTP error: ${response.status}`);  //wrzuca do devtools konsoli tekst i status błędu, np. 404
            } else {
                console.log("dziala", response);
                return response.json();
            }
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                repos_array.push(data[i].name);     // repos_array.push(data[i].owner.login);  obiekt w obiekcie
            }
            // console.log("Info o repos", data);
            // console.log("Nazwy repos w tablicy", repos_array);
            displayReposAsButtons();
        })
        .catch(err => console.error(`Fetch problem dupa: ${err.status}`));
        
        function displayReposAsButtons() {
            // div_for_repos.innerHTML = repos_array.join(", ");
            for (let j = 0; j < repos_array.length; j++) {
                let newButton = document.createElement("button");
                newButton.innerHTML = repos_array[j];
                div_for_repos.appendChild(newButton);
                newButton.setAttribute('class', 'buttons');

                newButton.setAttribute('value', repos_array[j]);
                // let tempRepo = repos_array[j];
                // console.log('Repo', tempRepo);
                // newButton.setAttribute('onclick', getLangForRepo(tempRepo, username));
            }
        }
    });

// buttons.addEventListener('click', () => {
//     // getLangForRepo( , username);
//     console.log('dupa')
// });

///////////////////////////////////////////////////////////////////////
// Pobieranie ilości bajtów na każdy język w danym repo

async function getLangForRepo(repo, username) {
    // console.log(username);
    // let api_lang_url = `https://api.github.com/repos/${username}/REPO/languages`;
    let api_lang_url = `https://api.github.com/repos/${username}/${repo}/languages`;

    // const response = await fetch(api_lang_url);
    // return response.json();
    await fetch(api_lang_url)
    .then(res => {
        res.json()
        .then(data => {
            console.log("data", data);
        })
    })
}

// getLangForRepo()
//     .then(res => {
//         console.log("Ilosc bajtow danego jezyka", res, "Repo to");
//     });