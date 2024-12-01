const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

//1 -

async function fetchAllMovies() {
  let query = 'select * from restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllMovies();

    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//2 -

async function fetchRestaurantsById(id) {
  let query = 'select * from restaurants where id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);

  try {
    let result = await fetchRestaurantsById(id);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restauarants found for id : ' + id });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//3 -

async function fetchAllMoviesByCuisine(cuisine) {
  let query = 'select * from restaurants where cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;

  try {
    let result = await fetchAllMoviesByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No movies found for cuisine : ' + cuisine });
    }

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//4 -

async function fetchByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'select * from restaurants where isVeg = ? and hasOutdoorSeating = ? and isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  try {
    let result = await fetchByFilter(isVeg, hasOutdoorSeating, isLuxury);
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message:
          'No restaurants found for : ' + isLuxury + isVeg + hasOutdoorSeating,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//5 -

async function sortByRating() {
  let query = 'select * from restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await sortByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No restaurants found',
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//6 -

async function fetchAllDishes() {
  let query = 'select * from dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();

    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//7 -

async function fetchDishesById(id) {
  let query = 'select * from dishes where id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);

  try {
    let result = await fetchDishesById(id);
    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found for id : ' + id });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//8 -

async function fetchDishesByVegNonveg(isVeg) {
  let query = 'select * from dishes where isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;

  try {
    let result = await fetchDishesByVegNonveg(isVeg);
    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found for : ' + isVeg });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//9 -

async function sortByPrice() {
  let query = 'select * from dishes ORDER BY price ASC';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await sortByPrice();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
