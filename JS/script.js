const btn = document.getElementById("submit");
// const div_for_repos = document.getElementById("all-repos");

let repos_array = [];

btn.addEventListener("click", () => {
    const username = document.getElementById("username").value;

    async function getAllRepos(res = {}) {
        let api_repo_url = `https://api.github.com/users/${username}/repos`;
        const response = await fetch(api_repo_url, {
            // (options section)w drugim parametrze fetch czyli w tym, określa się wartości działania na API, np zmiana metody z defaoultowej(GET) na przykładowo POST, ustawiania headers, credentials, cache, redirect itp.
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(res) //nie moze być ustawione jak wysyła się zapytanie GET
        });
        return response.json();  //zwracamy respone czyli fetchowaną odp z API oraz parsujemy(.json()) ją na natywny JavaScriptowy obiekt 
    }
    getAllRepos()
        .then(res => {
            if (res.ok) {   //fetch zwraca zawsze powodzenie z wyjątkiem problemu z netem, w tym if-ie sprawdza czy kod po pobraniu danych jest kodem 200 to okej czy 400/500 to wtedy powie że coś nie tak
                for (let i = 0; i < res.length; i++) {
                    repos_array.push(res[i].name);
                    // repos_array.push(res[i].owner.login);  obiekt w obiekcie
                }
                console.log("Info o repos", res);
                console.log("Nazwy repos w tablicy", repos_array);
            } else {
                console.log("Coś poszło nie tak");
            }
        });

    ///////////////////////////////////////////////////////////////////////
    // Pobieranie ilości bajtów na każdy język w danym repo

    async function getLangForRepo(res = {}) {
        // let api_lang_url = `https://api.github.com/repos/${username}/REPO/languages`;
        let api_lang_url = `https://api.github.com/repos/${username}/ZSK/languages`;

        const response = await fetch(api_lang_url);
        return response.json();
        
    }

    getLangForRepo()
        .then(res => {
            console.log("Ilosc bajtow danego jezyka", res);
        });

});