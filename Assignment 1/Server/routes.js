const fs = require('fs');

module.exports = function(app,path){
    console.log("Routes Started");

    let data = fs.readFileSync('data.json');

    app.get('/chatApp/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../chatApp/dist') + '/index.html');
    });

    app.get('/api', (req, res) => {
        if (data) {
            res.send(data);
        } else {
            res.sendStatus(500);
        }
    });

    app.post('/api', (req, res) => {
        fs.writeFile('data.json', JSON.stringify(req.body), (err) => {
            if(err) {
                console.log('Error writing to file: ', err);
                res.sendStatus(500);
            } else {
                data = fs.readFileSync('data.json');
                res.sendStatus(200);
            }
        });
    });
};