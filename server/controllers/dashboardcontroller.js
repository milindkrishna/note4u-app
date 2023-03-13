const Note = require('../models/Notes');
const mongoose = require('mongoose')

exports.dashboard = async (req,res) => {
    // set the page total to 12 
    let perPage = 6;

    // page count otherwise 1 to default
    // http://localhost:5000/dashboard?page=2 
    // so next page show with 13th content
    let page = req.query.page || 1;

    const locals = {
        title: 'Dashboard',
        description:'Free Nodejs Notes App'
    }

// pagination logic
try {

    const notes = await Note.aggregate([
        // gives us the result with recent notes
        { $sort: { updatedAt: -1 } },
        // matches the user id to give the notes which only the user has added

       { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        {
            // gives the title and body with 30 and 100 word counts
          $project: {
            title: { $substr: ["$title", 0, 30] },
            body: { $substr: ["$body", 0, 100] },
          },
        }
        ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
  
      const count = await Note.count();
  
      res.render('dashboard/index', {
        userName: req.user.firstName,
        locals,
        notes,
        layout: "../views/layouts/dashboard",
        current: page,
        pages: Math.ceil(count / perPage)
      });
   

} catch (error) {
    console.log(error);
}

}


// view particular notes by id

exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id })
      .where({ user: req.user.id })
      .lean();
  
    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      res.send("Something went wrong.");
    }
  };


  // update specific note using PUT method in method-override dependency

  exports.dashboardUpdateNote = async (req, res) => {
    try {
      await Note.findOneAndUpdate(
        { _id: req.params.id },
        // title and body is the same name use in form inside name tag
        { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
      ).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  // delete a specific note

  exports.dashboardDeleteNote = async (req, res) => {
    try {
      await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };


  // add note

  exports.dashboardAddNote = async (req, res) => {
    res.render("dashboard/add", {
      layout: "../views/layouts/dashboard",
    });
  };


  // submit the added note

  exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Note.create(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };


  // search the note 
  exports.dashboardSearch = async (req, res) => {
    try {
      res.render("dashboard/search", {
        searchResults: "",
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {}
  };


  // submit the search note

  exports.dashboardSearchSubmit = async (req, res) => {
    try {

      // grabing from form in dashboard headers  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      const searchResults = await Note.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        ],
      }).where({ user: req.user.id });
  
      res.render("dashboard/search", {
        searchResults,
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {
      console.log(error);
    }
  };





