const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// Middleware para parsear el cuerpo de la solicitud
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'Invalid ID' });       
    }

    try {
        book = await Book.findById(id);
        if(book == null) { // if(!book)
            return res.status(404).json({ message: 'Book not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.book = book;
    next();
}

// obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET FINDALL',books);
        if(books.length === 0) {
            return res.status(204).json({ message: 'No books found' });
        }
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear un libro
router.post('/', async (req, res) => {
    console.log('POST', req.body);
    const { title, author, genre, publication_date } = req?.body;
    if(!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const book = new Book({
        title,
        author,
        genre,
        publication_date,
    });
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', getBook, async (req, res) => {
    console.log('GET BY ID', res.book);
    res.json(res.book);
});

// router.put('/:id', getBook, async (req, res) => {
//     try {
//         const book = res.book;
//         book.title = req.body.title || book.title;
//         book.author = req.body.author || book.author;
//         book.genre = req.body.genre || book.genre;
//         book.publication_date = req.body.publication_date || book.publication_date;
//         const updatedBook = await book.save();
//         res.json(updatedBook);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

router.patch('/:id', getBook, async (req, res) => {
    const { title, author, genre, publication_date } = req?.body;
    if(!title && !author && !genre && !publication_date) {
        return res.status(400).json({ message: 'At least one field is required' });
    }
    try {
        const book = res.book;
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.publication_date = publication_date || book.publication_date;
        console.log('PATCH', book);
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        res.json({ message: `The book ${book.title} has been successfully deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
//  Busca libros en la base de datos cuya propiedad title coincida con una expresión regular($regex). 
//  El patrón es el valor del título que el usuario ingresó, y la opción 'i' hace que la búsqueda 
//  no sea sensible a mayúsculas y minúsculas.
router.get('/search/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const books = await Book.find({ title: { $regex: title, $options: 'i' } });
        if(books.length === 0) {
            return res.status(200).json({ message: 'No books found' });
        }
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/genre/:genre', async (req, res) => {
    const { genre } = req.params;
    try {
        const books = await Book.find({ genre: { $regex: genre, $options: 'i' } });
        if(books.length === 0) {
            return res.status(200).json({ message: 'No books found' });
        }
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const books = await Book.find({ author: { $regex: author, $options: 'i' } });
        if(books.length === 0) {
            return res.status(200).json({ message: 'No books found' });
        }
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/publication_date/:publication_date', async (req, res) => {
    const { publication_date } = req.params;
    try {
        const books = await Book.find({ publication_date: { $regex: publication_date, $options: 'i' } });
        if(books.length === 0) {
            return res.status(200).json({ message: 'No books found' });
        }
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;