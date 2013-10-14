exports.index = function(req, res){
    // scripts
    var styles = '<link href="/css/sumo.css" rel="stylesheet" type="text/css" media="screen"/>';
    var scripts = '';
    
    res.render('index', { 
                title: 'Meat auth',
                style: styles, 
                script: scripts });
};


