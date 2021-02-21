class App {
    constructor() {
        //todos os repositorios ficam aqui
        this.repositores = []

        this.formEl = document.getElementById('repo-form')
        this.inputEl = document.getElementById('input')

        this.listEl = document.getElementById('repo-list')
        this.buttonEl = document.getElementById('btnDell')

        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event)
        //this.buttonEl.addEventListener('click', this.remove(0))
    }

    //aparece uma msg de carregando
    setlaoding(loading = true) {

        if (loading === true) {
            let loadingEl = document.createElement('span')

            loadingEl.appendChild(document.createTextNode('carregando...'))

            loading.setAttribute('id', 'loading')

            this.formEl.appendChild(loadingEl)
        } else {
            document.getElementById("loading")
        }
    }
    
    //busca por respositorios
    async addRepository(event) {
        event.preventDefault()

        const repoInput = this.inputEl.value;
        //console.log(repoInput)

        //se nada tiver escrito o código acaba aqui
        if (repoInput.length === 0) return;

        //rente fazer o que está aqui dentro
        try {
            //response recebe o formato JSON
            const response = await (await fetch(`https://api.github.com/repos/${repoInput}`)).json()

            //console.log(response)

            const { name, description, html_url, owner: { avatar_url } } = response

            this.repositores.push({
                name,
                description,
                avatar_url,
                html_url,
            })

            //console.log(this.repositores)

            this.inputEl.value = ''//limpa o valor do input        
            this.listEl.innerHTML = ""//limpa a tela para que não repita mais repositórios

            //nesse forEach passo o obj repo e a posição
            this.repositores.forEach((repo, index) => this.render(repo, index))
        } catch (error) {
            //console.log(error)
            alert('não foi possível encontrar o repositório')
        }

        this.setlaoding(false)
    }

    //não consegui fazer um metodo para apagar
    remove(index) {
        this.repositores.splice(index, 1)
    }

    render(repo, index) {
        //apagando conteúdo

        //console.log(repo)

        const html = `
        <div class='container'>
            <div class="image-container">
                <img src="${repo.avatar_url}" class="image">
            </div>
    
            <div class="description-container">
                <strong class='name-repo'>${repo.name}</strong>
    
                <p class='${repo.description == 'Sem descrição' ? "not_description" : "description"}'>${repo.description}</p>
    
                <div class="linkAndDelete">
                    <a target="_blank" href="${repo.html_url}" class="link">Acessar</a>
    
                    <button id="btnDell">excluir</button>
                </div>
            </div>
        </div>`

        this.listEl.innerHTML += html
    }

}

new App()
