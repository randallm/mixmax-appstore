var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  request({
    url: 'https://itunes.apple.com/search',
    qs: {
      term: term,
      country: 'us',
      entity: 'software'
    },
    gzip: true,
    json: true,
    timeout: 10 * 1000
  }, function(err, response) {
    if (err || response.statusCode !== 200 || !response.body) {
      res.status(500).send('Error');
      return;
    }

    var results = _.chain(response.body.results)
      .map(function(app) {
        return {
          title: `<div>
                    <img src="${app.artworkUrl60}">
                    <div style="width: calc(100% - 60px - .5em); height:60px; padding-left: .5em; display: inline-block;">
                      <p style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${app.trackName}</p>
                      <p style="overflow: hidden; height: 3em; text-overflow: ellipsis; color: #889; font-weight: 400;">${app.description}</p>
                    </div>
                  </div>`,
          text: `https://itunes.apple.com/lookup?id=${app.trackId}`
        };
      })
      .value();

    if (response.body.resultCount === 0) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      res.json(results);
    }
  });
};
