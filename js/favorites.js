import {GithubUser} from'./githubUser.js'

class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
        GithubUser.search('')
    }
    load(){
        this.entries = JSON.parse(localStorage.getItem("@github_favorites:")) || []
        this.updateCss()
    }
    save(){
        localStorage.setItem("@github_favorites:", JSON.stringify(this.entries))
    }
    delete(user){
        const filteredEntries = this.entries.filter((entry) => entry.login !== user.login)
        
        this.entries = filteredEntries
        this.update()
        this.save()
    }
    async add(username){
        try{
            const userExist = this.entries.find((entry) => entry.login.toLowerCase() === username.toLowerCase())

            if(userExist){
                throw new Error("Usuário já cadastrado!")
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined){
                throw new Error("Usuário não encontrado!")
            }
            
            this.entries = [user,...this.entries]
            this.update()
            this.save()
        }catch(error){
        alert(error.message)
       }
    }
    
}

export class FavoritesView extends Favorites{
    constructor (root){
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }
    
    onAdd(){
        const addButton = this.root.querySelector('.search button') 
        addButton.onclick = () =>{
            const {value} = this.root.querySelector('#search-input')
            this.add(value)
        }
    }
    updateCss() {
        const main = this.root.querySelector('main')
      
        if (this.entries.length === 0) {
            main.classList.add('table-empty')
        } else {
            main.classList.remove('table-empty')
        }
        
    }
    update(){
        this.removeAllTr()
        this.entries.forEach((user)=>{
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a').textContent = user.login
            row.querySelector('.user span').textContent =`/${user.name}`
            row.querySelector('.public_repos').textContent = user.public_repos
            row.querySelector('.Followers').textContent = user.followers
            row.querySelector('.remove').onclick = ()=>{
                const isOk = confirm(`Tem certeza que quer excluir ${user.name}?`)

                if(isOk){
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
        this.updateCss()
    }
    createRow(){
        const tr = document.createElement('tr')
        tr.innerHTML=`
        <td class="user">
            <img src="" alt="">
            <h2>
                <a href=""></a>
                <span></span>
            </h2>
        </td>
        <td>
            <h2 class="public_repos"></h2>
        </td>
        <td>
            <h2 class="Followers"></h2>
        </td>
        <td>
            <button class="remove"><h2>Remover</h2></button>
        </td>`
        
        return tr
    }
    
    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr)=>{
        tr.remove()
        })
    }
}