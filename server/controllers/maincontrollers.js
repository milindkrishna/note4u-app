exports.homepage = async (req,res) => {
        const locals = {
            title: 'Nodejs Notes',
            description:'Free Nodejs Notes App'
        }

        if (req.user){
            res.render('index',{
                locals,
                layout: '../views/layouts/front-page',
                user: req.user 
            })
        } else {
            res.render('index', { user: null });
          }
        
    }

exports.about = async (req,res) => {
        const locals = {
            title: 'About Nodejs Notes',
            description:'Free Nodejs Notes App'
        }
        if (req.user){
        res.render('about',{
            locals,
            user: req.user })
    } else {
        res.render('about', { user: null });
      }
}

exports.faq = async (req,res) => {
    const locals = {
        title: 'FAQ for Nodejs Notes',
        description:'Free Nodejs Notes App'
    }
    if (!req.user || req.user ){
    res.render('faq',{
        locals,
        user: req.user })
}  
}