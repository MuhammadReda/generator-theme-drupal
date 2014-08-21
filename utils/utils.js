var filterThemeName = function(input) {
    var output = input.toLowerCase();
    output = output.replace(/^[0-9\\.\\s]+/, ''); // replace numbers at the beginning with nothing.
    output = output.replace(/[^a-zA-Z0-9]/g, '_'); // replace special characters with _
    return output;
}

exports.filterThemeName = filterThemeName;
