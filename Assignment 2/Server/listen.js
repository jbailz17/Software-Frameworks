module.exports = function(http){
    // Listen on port 3000
    http.listen(3000,()=>{
        var d = new Date();
        var n = d.getHours();
        var m = d.getMinutes();
        console.log('Server has been started at: '+ n + ':' + m);
        console.log('Listening on port: 3000');
    });
}