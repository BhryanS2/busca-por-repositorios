const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.repos:Repositorys")) || []
    },

    set(Repositorys) {
        localStorage.setItem("dev.repos:Repositorys", JSON.stringify(Repositorys))
    }
}

/*
 <div class="container">
            <div class="image-container">
                <img src="https://avatars.githubusercontent.com/u/2254731?v=4" class="image">
            </div>

            <div class="description-container">
                <strong class='name-repo'>Front-end</strong>

                <p class='description'>Interface desenvolvida em React JavaScript para a plataforma educacional PODEMOS.
                </p>

                <div class="linkAndDelete">
                    <a target="_blank" href="https://github.com/BhryanS2/Front-end" class="link">Acessar</a>

                    <button id="btnDell" data-target="1">excluir</button>
                </div>
            </div>
        </div>
*/
/*
const repository = [
    {
        avatar_url: 'https://avatars.githubusercontent.com/u/64044982?v=4',
        name: 'Front-end',
        description: 'Interface desenvolvida em React JavaScript para a plataforma educacional PODEMOS.',
        html_url: "https://github.com/BhryanS2/Front-end",
    },
]
*/


const Repository = {
    all: Storage.get(),

    async add(repo) {
        try {
            let repository = await (await fetch(`https://api.github.com/repos/${repo}`)).json()
            let desc = repository.description
            if (repository.description == null) {
                desc = 'Sem descrição'
                value_description = 'not_description'
            }
            
            Repository.all.push({
                avatar_url: repository.owner.avatar_url,
                name: repository.name,
                description: desc,
                html_url: repository.html_url
            })

            App.reload()
        } catch (error) {
            alert(error.message)
        }
    },

    remove(index) {
        Repository.all.splice(index, 1)
        App.reload()
    },
}

const DOM = {
    repositoryCotainer: document.querySelector('#repo-list'),

    addRepository(repo, index) {
        const div = document.createElement('div')
        div.setAttribute('class', 'container')
        div.innerHTML = DOM.innetHtmlRepository(repo, index)
        div.dataset.index = index

        DOM.repositoryCotainer.appendChild(div)
    },

    innetHtmlRepository(repo, index) {
        const html = `
        <div class="image-container">
            <img src="${repo.avatar_url}" class="image">
        </div>

        <div class="description-container">
            <strong class='name-repo'>${repo.name}</strong>

            <p class='${repo.description == 'Sem descrição' ? "not_description": "description"}'>${repo.description}</p>

            <div class="linkAndDelete">
                <a target="_blank" href="${repo.html_url}" class="link">Acessar</a>

                <button id="btnDell" onclick="remove(${index})">excluir</button>
            </div>
        </div>
        `
        return html;
    },

    clearRepositorys() {
        DOM.repositoryCotainer.innerHTML = ''
    }

}

const Form = {
    input: document.querySelector("#input"),


    clearFields() {
        Form.input.value = ''
    },

    validade(value){
        if(value == '') throw new Error("O input não pode ficar vazio")
    },

    submit(event) {
        event.preventDefault()
        try {
            Form.validade(Form.input.value)
            Repository.add(Form.input.value)
            Form.clearFields()
        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init() {
        Repository.all.forEach(DOM.addRepository)
        Storage.set(Repository.all)
    },

    reload() {
        DOM.clearRepositorys()
        App.init()
    },
}

App.init()