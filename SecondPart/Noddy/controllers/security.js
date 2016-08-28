
// store these in the database
var appKey = "112233";

var validate = function(key) {
    if (key == appKey) {
        return true;
    }
    return false;
}

exports.authorization = function(req, res, next) {
    console.log("In authorization");

    var appKeyParam = req.headers.apikey;

    console.log("In authorization appKeyParam=" + appKeyParam);


    // get authorization header info
    if (appKeyParam != null) {
        if (validate(appKeyParam)) {
            next();
            return;
        }
    }

    next('route');

    res.status(401);
    res.type('application/json');
    res.json({success:false, msg:"Not Authorized"});
    return;
};
