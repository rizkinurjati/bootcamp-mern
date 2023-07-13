const notFound = (req, res) =>{
    req.status(404).send({ msg: 'route does not exists' });
};

module.exports = notFound;