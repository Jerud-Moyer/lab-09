const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: 
          [{ chocolate: { amount: 1, measurement: 'tsp' } }, { beer: { amount: 9, measurement: 'pints' } }]

      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: 
            [{ chocolate: { amount: 1, measurement: 'tsp' } }, { beer: { amount: 9, measurement: 'pints' } }]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: 
          [{ chocolate: { amount: 1, measurement: 'tsp' } }]
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: 
          [{ chocolate: { amount: 1, measurement: 'tsp' } }]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: 
          [{ chocolate: { amount: 1, measurement: 'tsp' } }]
        });
      });
  });

  it('should delete with delete', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const response = await request(app)
      .delete(`/api/v1/recipes/${recipe.id}`);

    expect(response.body).toEqual(recipe);
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const response = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);
    expect(response.body).toEqual(recipe);
  });

  it('creates a log', () => {
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: 2,
        dateOfEvent: '11/22/20',
        notes: 'fud gud',
        rating: '5 star'

      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '2',
          dateOfEvent: '11/22/20',
          notes: 'fud gud',
          rating: '5 star'
        });
      });
  });

  it('gets all logs', async() => {
    const logs = await Promise.all([
      { recipeId: 3, dateOfEvent: '09/05/2020', notes: 'notes', rating: '4 star' },
      { recipeId: 4, dateOfEvent: '09/09/2020', notes: 'words', rating: '3 star' },
      { recipeId: 5, dateOfEvent: '09/13/2020', notes: 'lies', rating: '1 star' }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('updates a log by id', async() => {
    const log = await Log.insert({
      recipeId: 2,
      dateOfEvent: '11/22/20',
      notes: 'fud gud',
      rating: '5 star'
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: 3,
        dateOfEvent: '11/22/20',
        notes: 'foood goood',
        rating: '5 star'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '3',
          dateOfEvent: '11/22/20',
          notes: 'foood goood',
          rating: '5 star'
        });
      });
  });

  it('should delete a log with delete', async() => {
    const log = await Log.insert({
      recipeId: 3,
      dateOfEvent: '11/22/20',
      notes: 'foood goood',
      rating: '5 star'
    });

    const response = await request(app)
      .delete(`/api/v1/logs/${log.id}`);

    expect(response.body).toEqual(log);
  });

  it('gets a log by id', async() => {
    const log = await Log.insert({
      recipeId: 3,
      dateOfEvent: '11/22/20',
      notes: 'foood goood',
      rating: '5 star'
    });

    const response = await request(app)
      .get(`/api/v1/logs/${log.id}`);
    expect(response.body).toEqual(log);
  });
});
