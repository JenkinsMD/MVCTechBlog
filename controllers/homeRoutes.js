const router = require('express').Router();
const { BlogPost, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const blogData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    
    // Serialize data so the template can read it
    
    const blogs = blogData.map((blogPost) => blogPost.get({ plain: true }));
  
    
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
  }
  return
});

//get single post w/ comments
router.get('/blogroutes/:id', async (req, res) => {
  try {
    const blogData = await BlogPost.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const blogs = blogData.get({ plain: true });
    console.log("SP Blogs  "+JSON.stringify(blogs.user.name))//logs object object
    
    res.render('singlePost', {
      blogs,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
  return
});

router.get('/dashboard',withAuth, async (req, res) => {

  console.log("in /dashboard---------------")
  console.log(req.session.user_id + "<---- user id")

  try {
    const blogData = await BlogPost.findAll( {
      where: {
        user_id: req.session.user_id
      },
      attributes: ['id','title', 'content', 'date_created', 'user_id'],
      include: [
        {
          model: Comment,
          attributes: ['id','comment','user_id','post_id', 'date_created'],
        },
        {
          model: User,
          attributes: ['id','name'],
        },

      ],
    });
    console.log("After Try----------" + blogData)
    const blogsDash = blogData.map(blog => blog.get({ plain: true}));
    console.log("blogsDash    "+blogsDash)


    res.render('dashboard', {
      blogsDash,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
 return
});


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
