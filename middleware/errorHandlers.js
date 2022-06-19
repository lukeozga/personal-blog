function pageNotFound(req,res){
    res.status(404).render('404');
};

function genericServerError(err, req, res, next) {
    console.error(err);
    res.status(500).render("500");
};

module.exports = {
    pageNotFound:pageNotFound,
    genericServerError: genericServerError
};