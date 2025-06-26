import { responseHandler } from "../utils/responseHandler.js";


export const getProfileController = async (req, res, next) => {

    console.log(req.user,'user data');
    try{
        const data = {
          user: {
            email: req.user.email,
            isVerified: req.user.isVerified,
            createdAt: req.user.createdAt,
          },
        };
        return responseHandler(
          res,
          200,
          data,
          "Profile data fetched successfully"
        );
    }catch(err){
        console.log(err);
    }
    
};
