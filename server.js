const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./server/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  if (req.method === 'GET' && req.query.cuisines) {
    const cuisinesFilter = req.query.cuisines.toLowerCase();

    const db = router.db;
    const restaurants = db.get('restaurants')
      .filter((restaurant) =>
        restaurant.cuisines.some((cuisine) => cuisine.toLowerCase() === cuisinesFilter)
      )
      .value();

    res.json(restaurants);
  } else {
    next();
  }
});

server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on http://localhost:3001');
});