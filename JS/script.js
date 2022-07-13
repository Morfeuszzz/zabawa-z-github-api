const submit_btn = document.getElementById("submit");
const div_for_repos = document.getElementById("all-repos");

submit_btn.addEventListener("click", () => {

    if (document.querySelector('.div-for-repo-lang')) {     //bez tworzenie zmiennej do tego, o 1 linijkę mniej kodu
        document.querySelector('.div-for-repo-lang').remove();
    }

    const username = document.getElementById("username").value;
    let repos_array = [];
    div_for_repos.innerHTML = "";

    async function getAllRepos() {
        // let api_repo_url = `https://api.github.com/users/USERNAME/repos`;    //ogólny endpoint github api
        let api_repo_url = `https://api.github.com/users/${username}/repos`;    //zwraca tylko publiczne repo
        const response = await fetch(api_repo_url, {    // (sekcja opcjonalna)w drugim parametrze fetch czyli w tym, określa się działania na API, np zmiana metody GET na przykładowo POST, ustawiania headers, credentials, cache, redirect itp.
            method: 'GET',      //default
            headers: {
                'Content-Type': 'application/json'      //default
            },
            // body: JSON.stringify(res) //nie moze być ustawione jak wysyła się zapytanie GET, bardziej 'body' jest do np. metody POST
        });
        return response;  //zwracamy response czyli fetchowaną odp z API oraz parsujemy(.json()) ją na natywny JavaScriptowy obiekt, JEDNAK parsuje na json przy wywołaniu funkcji
    }
    
    getAllRepos()
        .then(response => {
            if (!response.ok) {     //fetch zwraca zawsze powodzenie z wyjątkiem problemu z netem i swoimi problemami, w tym if-ie sprawdza czy kod po pobraniu danych jest kodem 200(2XX) to okej, czy 400/500 to wtedy powie że coś nie tak. Ale funkcja res.ok nie działa na responsie który jest po .json czyli zamieniony na JS object
                //defaultowo .then wszystko poza problemem z netem uznaje za okej, dlatego sprawdzam response poprzez metode .ok
                throw new Error(`HTTP error code szefie: ${response.status}`);  //wrzuca do devtools konsoli tekst i status błędu, np. 404
            } else {
                console.log("działa", response);
                return response.json();     //tutaj zwracam sparsowany response
            }
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                repos_array.push(data[i].name);     //dodaje do tablicy tylko nazwy repo
            }
            // console.log("Info o repos", data);
            // console.log("Nazwy repos w tablicy", repos_array);
            displayReposAsButtons();    //tworzy przyciski o nazwie repo jakie uda mu się pobrać
            prepareToShowRepoLang();    //tworzy div-a w którym wyświetla języki repo wybranego przez użytkownika oraz ilość MB każdego z języków które ma owe repo
        })
        .catch(error => console.log(`Fetch problem kumplu: ${error}`));     //console-uje nazwę error-a

    function displayReposAsButtons() {
        for (let j = 0; j < repos_array.length; j++) {
            let newButton = document.createElement('button');
            newButton.innerHTML = repos_array[j];       //wrzuca do buttona-a nazwę repo jakie pobrał
            div_for_repos.appendChild(newButton);       //dodaje nowy przycisk do div-a który ma zawierać wszystkie przyciski
            newButton.setAttribute('class', 'buttons');
            newButton.setAttribute('value', repos_array[j]);    //nadaje value przyciskom, wykorzystuję to później przy pobieraniu języków określonego button-a(repo)
        }
    }

    async function getLangForRepo(repo, username) {
        // let api_lang_url = `https://api.github.com/repos/USERNAME/REPO/languages`;       //ogólny endpoint github api
        let api_lang_url = `https://api.github.com/repos/${username}/${repo}/languages`;
        const response = await fetch(api_lang_url);
        return response.json();     //tutaj zrobiłem bez sprawdzanie czy wystąpił błąd, od razu ma zwrócić odpowiedź sparsowaną na json-a
    }
    
    function prepareToShowRepoLang() {
        let buttons = document.querySelectorAll('.buttons');
        let container = document.body;
        buttons.forEach( button => {
            button.addEventListener('click', (e) => {
                let divExists = document.querySelector('.div-for-repo-lang');
                let selectedRepo = e.target.value;      //pobiera value z aktualnie klikniętego przycisku żeby wiedzieć o jakim repo ma pobrać dane
                if (divExists == null) {        //sprawdza czy istnieje już div na języki danego repo     
                    let newDivForRepoLang = document.createElement('div');
                    container.appendChild(newDivForRepoLang);
                    newDivForRepoLang.setAttribute('class', 'div-for-repo-lang');   //jeżeli nie istnieje to tworzy tego div-a i dodaje zakładaną klasę
                } 
                divExists = document.querySelector('.div-for-repo-lang');       //nadpisuje zmienną przechowującą info o tym divie ponieważ w tym momencie powinien już istnieć i wartość zmiennej 'divExists' nie jest już null-em

                getLangForRepo(selectedRepo, username)
                    .then(data => {
                            let text = '';
                            for (let key in data) {     //przechodzi przez każdą właściwość obiektu JS, dodaje ją oraz jej wartość do stringa którego później wyświetla
                                text += key + " : " + data[key]+" B<br>";
                                console.log(key, data[key]);
                            }
                            divExists.innerHTML = text;
                    });
            });
        });
    }
});