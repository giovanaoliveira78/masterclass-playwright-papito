import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deletTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'

test('deve poder cadastrar uma nova tarefa', async ({ page }) => {
    await page.goto('http://192.168.15.7:8080/')

    await page.fill('#newTask', 'Ler um livro de TypeScript')
})

// Abaixo uma forma diferente de fazer a mesma coisa
// Aqui é implementado padrões de projeto
test('deve poder cadastrar uma nova tarefa de uma forma diferente', async ({ page }) => {
    await page.goto('http://192.168.15.7:8080/')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill('Teste Teste Teste')
    await inputTaskName.press('Enter') // aqui eu uso uma função do teclado, no caso o "enter"
})

//Aqui em vez de pressionar o enter, será feito com o click no botão
test('deve poder cadastrar uma nova tarefa de uma outra forma', async ({ page }) => {
    await page.goto('http://192.168.15.7:8080/')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill('Mais um teste')

    await page.click('xpath=//button[contains(text(), "Create")]')
})

// Aqui é um jeito diferente de fazer o click com o código mais simples e legível e usando o faker
test('deve poder cadastrar uma nova tarefa usando faker', async ({ page }) => {
    const { faker } = await import('@faker-js/faker')
    await page.goto('http://192.168.15.7:8080/')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(faker.lorem.words())

    await page.click('css=button >> text=Create')
})

// Aqui fazendo junto com a API do instrutor (não baixei o insomnia porque tem que abrir chamado pro suporte, só segui o curso)
test('deve poder cadastrar uma nova tarefa usando a API do instrutor', async ({ page, request }) => {
    const taskName = 'Estudar playwright'
    //await request.delete('Aqui deveria ser o link local da API do instrutor' + taskName) // Na API do instrutor precisa passar a rota e a mensagem, por isso a concatenação com o taskName

    await page.goto('http://192.168.15.7:8080/')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(taskName)

    await page.click('css=button >> text=Create')
})

//Usando Gherkin e dataTestID pra verificar se o texto foi incluido na lista
test('deve poder cadastrar uma nova tarefa usando a API do instrutor e usando gherkin', async ({ page, request }) => {

    // Dado que eu tenho uma nova tarefa
    const taskName = 'Estudar Robot'
    //await request.delete('Aqui deveria ser o link local da API do instrutor' + taskName) // Na API do instrutor precisa passar a rota e a mensagem, por isso a concatenação com o taskName

    // E que estou na página de cadastro
    await page.goto('http://192.168.15.7:8080/')

    // Quando faço o cadastro dessa tarefa
    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(taskName)

    await page.click('css=button >> text=Create')

    // Então essa tarefa deve ser exibida na lista 
    const target = page.getByTestId('task-item')
    await expect(target).toHaveText(taskName)
})

//Usando uma forma diferente de pegar o elemento que exibe o texto ba lista
test('deve poder cadastrar uma nova tarefa usando a API do instrutor, captando elemento de forma diferente', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Estudar Cypress',
        is_done: false
    }
    await deletTaskByHelper(request, task.name)

    const tasksPage: TasksPage = new TasksPage(page)
    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)
})

test('não deve permitir tarefa duplicada', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Estudar Cypress',
        is_done: false
    }

    await deletTaskByHelper(request, task.name) // Na API do instrutor precisa passar a rota e a mensagem, por isso a concatenação com o taskName

    await postTask(request, task)

    const tasksPage: TasksPage = new TasksPage(page)
    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')
})

test('campo obrigatório', async ({ page }) => {
    const task: TaskModel = {
        name: '',
        is_done: false
    }

    const tasksPage: TasksPage = new TasksPage(page)
    await tasksPage.go()
    await tasksPage.create(task)

    // Nesse contexto a mensagem que é o ponto principal no teste não é HTML
    // A mensagem vem do navegador, então não da pra inspecionar, é inserido pela propriedade do elemento
    //Abaixo pega o elemento de imput e converte ele em HMTL

    const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage) // Converte em HTML
    expect(validationMessage).toEqual('This is a required field')
})