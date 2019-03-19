const express = require('express');
const routes = express.Router();
const Db = require('./data/db.js');

routes.use(express.json());

// GET /api/posts	Returns an array of all the post objects contained in the database.
routes.get('/api/posts', (req, res) => {
	Db.find(req.query)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((error) => {
			res.status(500).json({
				error: 'The posts information could not be retrieved.'
			});
		});
});

// POST /api/posts	Creates a post using the information sent inside the request body.
routes.post('/api/posts', (req, res) => {
	const post = req.body;
	if (post.title && post.contents) {
		res.status(201).json(post);
	} else {
		res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
		return;
	}
	Db.insert(post)
		.then((post) => {
			console.log('Created post => ', post);
		})
		.catch((error) => {
			res.status(500).json({ error: 'There was an error while saving the post to the database' });
		});
});

// GET /api/posts/:id	Returns the post object with the specified id.
routes.get('/api/posts/:id', (req, res) => {
	const id = req.params.id;
	Db.findById(id)
		.then((post) => {
			if (post) {
				res.json(post);
			} else {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			res.status(500).json({ error: 'The post information could not be retrieved.' });
		});
});

// DELETE /api/posts/:id	Removes the post with the specified id and returns the deleted post object.You may need to make additional calls to the database in order to satisfy this requirement.

routes.delete('/api/posts/:id', (req, res) => {
	const id = req.params.id;
	Db.remove(id)
		.then((post) => {
			if (post) {
				console.log('Deleting post with id:', id);
				res.json(id);
			} else {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			res.status(500).json({ error: 'The post could not be removed' });
		});
});

// PUT /api/posts/:id	Updates the post with the specified id using data from the request body.Returns the modified document, NOT the original.
routes.put('/api/posts/:id', (req, res) => {
	const { id } = req.params;
	const updatePost = req.body;
	Db.update(id, updatePost)
		.then((updated) => {
			if (!id) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}
			if (updatePost.title && updatePost.contents) {
				console.log('updating', updatePost);
				res.status(200).json(updatePost);
			} else {
				res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
				return;
			}
		})
		.catch((error) => {
			res.status(500).json({ error: 'The post information could not be modified.' });
		});
});

module.exports = routes;
