import User from '../models/User.js'

const isAdmin = async (req,res,next) => {
    const user = await User.findById(req.userAuthId);
    // check if the user is admin
    if(user.isAdmin) {
        next();
    } else {
        next(new Error('Access denied'));
    }
}

export default isAdmin;