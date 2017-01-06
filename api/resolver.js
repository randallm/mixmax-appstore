var request = require('request');
var _ = require('underscore');

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();

  if (/^https:\/\/itunes\.apple\.com\/lookup\?id=\d+$/.test(term)) {
    handleIdString(term, req, res);
  }
};

function handleIdString(id, req, res) {
  request({
    url: id,
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }
    var app = response.body.results[0];
    res.json({
      body: `<a href="${app.trackViewUrl}">
               <div style="font-weight: 600; font-size: 13px; border-radius: 2px; border: 1px solid lightgray; font-family: sans-serif;">
                 <img src="${app.artworkUrl100}" style="width: 90px; height: 90px; padding: 6px 0 3px 6px;">
                 <div style="width: calc(100% - 90px - 2.5em); height:100px; float: right; padding-top: 1.5em; padding-right: 1em;">
                   <p style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin: 0; color: #000;">${app.trackName}</p>
                   <p style="color: #889; font-weight: 400; margin: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${app.description}</p>
                 </div>
               </div>
             </a>`
    });
  });
}
