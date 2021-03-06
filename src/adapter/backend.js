/*
 * Saves visualisations to an anonymous Gist or prepares one for download
 *
 * Provides:
 *   embed(req, reply)
 *   edit(req, reply)
 */
function adapter(server, gist, utils, Config) {

    function download(req, reply) {
        var data = {
            "html": req.payload.html.replace(/\\n/g, '\n'),
            "js": req.payload.js.replace(/\\n/g, '\n'),
            "css": req.payload.css.replace(/\\n/g, '\n')
        };

        utils.formatSectionsIntoPage(data)
            .then(html => {
                reply(html)
                    .header("Content-Type", "text/html")
                    .header("Content-Disposition", "attachment; filename=\"jhere-playground.html\"")
            })
            .catch(err => errorHandler(err, reply));
    }

    function save(req, reply) {
        // Prepare the gist and save it
        var data = {
            "html": req.payload.html,
            "js": req.payload.js,
            "css": req.payload.css
        };

        // Create a new gist
        gist.setMap(data)
            .then(prepareResponse)
            .then(reply)
            .catch(err => errorHandler(err, reply));
    }

    function prepareResponse(id) {
        console.log(id.toString())
        return {
            result: "success",
            id: id
        };
    }

    function errorHandler(err, reply) {
        reply({}).code(500);
    }

    return {
        save, download
    };
}

export default adapter;
