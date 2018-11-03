var ObjectId = require('mongodb').ObjectID;

module.exports = function (app, db) {
    app.get('/online_users/:username', function (req, res) {
        db.db().collection('users').find({status: "online", username: {$ne: req.params.username}}).toArray((err, result) => {
            if(err) {
                res.json({'error': 'An error has occurred'});
            } else {
                res.json(result);
            }
        });

    });

    app.post('/add_user', function (req, res) {
        let request = req.body;
        let userToFind = {username: request.username};
        db.db().collection('users').findOne(userToFind, (err, result) => {
            if(err){
                res.json({ 'error': 'An error has occurred' });
            } else {
                if(result){
                    res.json(result);
                } else {
                    let newUser = {
                        username: request.username,
                        status: "online",
                        dialogs: []
                    };
                    db.db().collection('users').insertOne(newUser, (err, result) => {
                        if (err) {
                            res.json({ 'error': 'An error has occurred' });
                        } else {
                            res.json(result.ops[0]);
                        }
                    });
                }
            }
        });
    });

    app.get('/get_all_messages/:userFrom', function (req, res) {
        let userFrom = req.params.userFrom;
        db.db().collection('messages').find({userFrom: userFrom}).toArray((err, result) => {
            if(err) {
                res.json({'error': 'An error has occurred'});
            } else {
                let all_messages
                res.json(result);
            }
        });
    });

    app.get('/get_dialog/:user1/:user2', function (req, res) {
        let user1 = req.params.user1;
        let user2 = req.params.user2;
        db.db().collection('messages').find({userFrom: user1, userTo: user2}).toArray((err, result) => {
            if(err) {
                res.json({'error': 'An error has occurred'});
            } else {
                let dialog = {'outcome' : result};
                db.db().collection('messages').find({userFrom: user2, userTo: user1}).toArray((err, result) => {
                    if(err) {
                        res.json({'error': 'An error has occurred'});
                    } else {
                        dialog['income'] = result;
                        res.json(dialog);
                    }
                });
            }
        });
    });

    app.post('/write_message', function (req, res) {
        let request = req.body;
        let userFrom = request.userFrom;
        let userTo = request.userTo;
        let newMessage = {
            userFrom: userFrom,
            userTo: userTo,
            text: request.text,
            date: Date.now(),
            key: request.key
        };
        db.db().collection('messages').insertOne(newMessage, (err, result) => {
            if (err) {
                res.json({ 'error': 'An error has occurred' });
            } else {
                console.log('new message: ' + newMessage);
                res.json(result.ops[0]);
            }
        });
    });

    app.delete('/delete_message', function (req, res) {
        let request = req.body;
        let id = request.id;
        db.db().collection('messages').deleteOne({ "_id" : ObjectId(id) }, (err, result) => {
            if (err) {
                res.json({ 'error': 'An error has occurred' });
            } else {
                res.json({'res': 'ok'});
            }
        });
    });
};