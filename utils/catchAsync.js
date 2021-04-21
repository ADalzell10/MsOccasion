// for error catching on async functions
module.exports = function(func){
    return function(req, res, next){
        func(req, res, next).catch(next);
    }
}