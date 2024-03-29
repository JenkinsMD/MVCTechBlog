const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newCmt = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newCmt);
    return 
  } catch (err) {
    res.status(400).json(err);
  }
  return
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const cmtData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!cmtData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(cmtData);
  } catch (err) {
    res.status(500).json(err);
  }
  return
});



module.exports = router;
