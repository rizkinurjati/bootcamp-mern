const Users = require('../../api/v1/user/model');
const Organizers = require('../../api/v1/organizer/model');
const { BadRequestError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');

const createOrganizers = async (req) => {
    const { organizer, email, password, confirmPassword, name, role } = req.body;
    if (password !== confirmPassword) {
        throw new BadRequestError('Password dan confrimation password tidak cocok')
    }

    const result = await Organizers.create({ organizer });

    const users = await Users.create({
        name,
        email,
        password,
        role,
        organizer: result._id
    });

    delete users._doc.password;
    
    return users;
};

const createUsers = async (req, res) => {

    const { email, password, confirmPassword, name, role } = req.body;
    if (password !== confirmPassword) {
        throw new BadRequestError('Password dan confrimation password tidak cocok')
    }
    const result = await Users.create({
        name,
        email,
        password,
        role,
        organizer: req.user.organizer,
    });
    
    return result;
};

const getAllUsers = async (req) => {
    const result = await Users.find();
  
    return result;
  };

module.exports = {
    createOrganizers,
    createUsers,
    getAllUsers,
};