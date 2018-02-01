module.exports = {
    isValidURL: async function(youtube, url, result) {
        var response = await youtube.getVideo(url);
        result(response);
    }
}