/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.postFileUpload = (req, res, next) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  console.log(req.file.originalname);
  res.render('home', {
    title: 'Home',
    originalname: req.file.originalname
  });
};