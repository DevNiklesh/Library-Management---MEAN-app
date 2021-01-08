const Book = require('../schemas/book-schema');

exports.getBookById = (id) => {
    return new Promise((resolve, reject) => {
        Book.findOne({ _id: id}, (err, book) => {
            if(err) reject(err);
            resolve(book);
        }).populate('addedBy');
    });
};

exports.create = async (req, res, next) => {
    try {
        if(req.body && req.user) {
            req.body.addedBy = req.user._id;
            console.log(req.body);
            let newBook = new Book(req.body);
            newBook.save().then(data => {
                res.send(data);
            }, (e) => {
                next(e);
            });

        } else {
            next("No data found in the request")
        }
    } catch(error) {
        next(error);
    }
};

exports.getOneBook = async (req, res, next) => {
    try {
        if(req.params.id) {
            const book = await this.getBookById(req.params.id);
            if(!book) next("No book found with id: " + req.params.id);
            res.send(book);
        } else {
            next("Book id not available");
        }
    } catch(error) {
        next(error);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        Book.find({}, (err, docs) => {
            if(err) {
                next(err);
            } else {
                res.send(docs);
            }
        }).populate("addedBy");
    } catch(error) {
        next(error);
    }
};

exports.deleteById = async (req, res, next) => {
    try {
        if(req.params.id && req.user) {
            const book = await this.getBookById(req.params.id);
            if(!book) { 
                next("No book found with id: " + req.params.id); 
            }
            if(book.addedBy._id.toString() === req.user._id.toString()) {
                Book.deleteOne({ _id: req.params.id }).then(val => {
                    if(val.deletedCount > 0) {
                        return res.send({
                            message: "Deleted successfully",
                            data: val
                        });
                    } else {
                        next("No book found with id: " + req.params.id);
                    }
                }).catch(err => {
                    next(err);
                });
            } else {
                next("Unauthorized Action");
            }
        } else {
            next("No id found in the request");
        }
    } catch(error) {
        next(error);
    }
};