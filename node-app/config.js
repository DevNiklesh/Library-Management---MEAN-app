exports.config = {
    passport: {
        secret: "my_secret",
        expiresIn: 10000
    },
    env: {
        port: 3000,
        mogoDBUri: "mongodb+srv://devApp:devApp@trial-db.o6nml.mongodb.net/Trial-db?retryWrites=true&w=majority",
    }
}