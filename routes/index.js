const express = require('express');
const router = express.Router();
const userModel = require('../models/users-model');
const postModel = require('../models/posts-model');
const passport = require('passport');
const upload = require('../config/multer-config');

router.get('/', (req, res) => {
    res.render('index', {title : 'Express'});
})

router.get('/profile',isLoggedIn, (req, res) => {
    // res.render('index', {title : 'Express'});
    res.render("profile",{ user: req.user });
})

// router.get('/profile', (req, res) => {
//     // res.render('index', {title : 'Express'});
//     res.render("profile");
// })


router.get('/login', (req, res, next) => {
    console.log(req.flash("error"));
    res.render('login2', {message: req.flash('error')});
})

router.get('/feed', (req, res) => {
    res.render('feed');
})

router.get('/profile/dp/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (user && user.dp && user.dp.data) {
      res.set('Content-Type', user.dp.contentType);
      res.send(user.dp.data);
    } else {
      res.sendFile(__dirname + '/public/default-dp.png'); // fallback image
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dp");
  }
});



router.get('/alluserPost', async(req, res) => {
    let user = await userModel
    .findOne({_id : "68ce99ffbde7bf1fc60ad1e7"})
    .populate('posts');
    res.send(user);

});

router.get('/createUser',async (req, res) => {
    let createdUser  = await userModel.create({
        username : "try",
            password : "trial",
            posts : [],
            email : "charvi@test",
            fullname : "Charvi",
    });
    res.send(createdUser);
})

router.get('/createPost',async (req, res) => {
    let createdPost  = await postModel.create({
        postText : "hello this is a trial",
        user: '68ce99ffbde7bf1fc60ad1e7'
    });
    // res.send(createdPost);
    let user = await userModel.findOne({_id : "68ce99ffbde7bf1fc60ad1e7"});
    user.posts.push(createdPost._id);
    await user.save();
    res.send("done");
})

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const post = await Post.create({
      postText: req.body.postText,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

router.post('/register', async (req, res, next) => {
    const { fullname, email, password } = req.body;

    // Optional: check required fields
    if (!fullname || !email || !password) {
        return res.status(400).send("Please fill in all required fields.");
    }

    // Create the user object
    const userData = new userModel({
        fullname,
        email,
    });

    // Register the user with passport-local-mongoose
    userModel.register(userData, password, (err, registeredUser) => {
        if (err) {
            if (err.name === "UserExistsError") {
                return res.status(400).send("Username already taken. Please choose another one.");
            } else {
                return next(err); // next is defined because it's in the route params
            }
        }

        req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/profile'); // success redirect
    });
    });
});

router.post('/profile/edit', upload.single('dp'), async (req, res) => {
  try {
    const { firstname, lastname, username, instagram, pronouns, website} = req.body;
    const updateData = { firstname, lastname, username, instagram, pronouns, website };
    const pronounsArray = pronouns ? pronouns.split(',') : [];

    // If user uploaded a dp, save buffer + mimetype
    if (req.file) {
      updateData.dp = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await userModel.findByIdAndUpdate(req.user._id, updateData, { new: true });
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile");
  }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',  // where to go if login succeeds
    failureRedirect: '/login',    // where to go if login fails
    failureFlash: true            // optional, if you use flash messages
}));

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/profile');
    });
  })(req, res, next);
});


router.get("/logout", (req, res, next) => {
    req.logout(function(err){
        if(err){return next(err);}
        res.redirect('/login');
    });
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}
module.exports = router;