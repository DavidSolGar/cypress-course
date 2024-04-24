describe('Test with backend', () => {

    beforeEach('login to application', () => {
      cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' })
      cy.loginToApplication()
    })
  
    // it('first', () => {
    //   cy.log('Yeah bro we logged into the PAGE')
    // })
  
    it('Verify correct request and response', () => {
  
      // utilizaremos un interceptor de llamadas al browser
  
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles').as('postArticles')
  
      cy.contains('New Article').click()
      cy.get('[formcontrolname="title"]').type('This is the TITLE')
      cy.get('[formcontrolname="description"]').type('this the DESCIPTION')
      cy.get('[formcontrolname="body"]').type('This is the body of the ARTICLEEEEE')
      cy.contains('Publish Article').click()
  
      
      cy.wait('@postArticles')   // esperar a q se complete la peticion y no llegue vacia 
      cy.get('@postArticles').then(xhr => {
        console.log(xhr)
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.article.body).to.equal('This is the body of the ARTICLEEEEE')
      })
    })
  
    it('Intercepting and modifying the request and response', () => {
  
      cy.intercept('POST', '**/articles', (req) => {
        req.reply( res => {
          expect(res.body.article.description).to.equal('this is the DESCRIPTION GUYS')  // mensaje original 
          // aca cammbiamos el valor 
          res.body.article.description = "this is the DESCRIPTION GUYS to intercept"
        })
      }).as('postArticles')
  
      cy.contains('New Article').click()
      cy.get('[formcontrolname="title"]').type('This is the TITLE  GUYSSSSS')
      cy.get('[formcontrolname="description"]').type('this is the DESCRIPTION GUYS')
      cy.get('[formcontrolname="body"]').type('This is the body of the ARTICLEEEEE  GUYSSSS')
      cy.contains('Publish Article').click()
  
      cy.wait('@postArticles')   // esperar a q se complete la peticion y no llegue vacia 
      cy.get('@postArticles').then( xhr => {
        console.log(xhr)
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.article.body).to.equal('This is the body of the ARTICLEEEEE  GUYSSSS')
  
        // Aca mandamos el assert para ver si se creo con el valor q mandamos en la interception 
        expect(xhr.response.body.article.description).to.equal('this is the DESCRIPTION GUYS to intercept')
  
  
      })
    })
  
    it('Verify popular tags are displayed', () => {
      cy.get('.tag-list')
        .should('contain', 'cypress')
        .should('contain', 'automation')
        .should('contain', 'testing')
    })
  
    it('verify global feed likes count', () => {
      cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', { "articles": [], "articlesCount": 0 })
      cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json' })
  
      cy.contains('Global Feed').click()
      cy.get('app-article-list button').then(heartList => {
        expect(heartList[0]).to.contain('1')
        expect(heartList[1]).to.contain('5')
  
      })
      cy.fixture('articles').then(file => {
        const artcicleLink = file.articles[1].slug
        file.articles[1].favoritesCount = 6
        cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/' + artcicleLink + '/favorite')
      })
      cy.get('app-article-list button').eq(1).click().should('contain', '6')
    })
  
    it.only('Deleting a new article in global feed', () => {
  
      const bodyRequest = {
        "article": {
          "title": "Request from API and Postman",
          "description": "API is EASY",
          "body": "Backend is Cool ",
          "tagList": []
        }
      }
  
      cy.get('@token').then(token => {
  
        cy.request({
          url: Cypress.env('apiUrl')+'/api/articles/',
          headers: { 'Authorization': 'Token ' +token},
          method: 'POST',
          body: bodyRequest
        }).then( response => {
          expect(response.status).to.equal(201)
        })
  
        cy.contains('Global Feed').click()
        cy.get('.preview-link').first().click()
        cy.get('.article-actions').contains('Delete Article').click()
  
        cy.request({
          url: Cypress.env('apiUrl')+'/api/articles?limit=10&offset=0',
          headers: { 'Authorization': 'Token ' +token},
          method: 'GET'
        }).its('body').then(body => {
             expect(body.articles[0].title).not.to.equal('Request from API and Postman')
        })
      })
    })
  })
  