var filterThemeName = function(input) {
    var output = input.toLowerCase();
    output = output.replace(/^[0-9\\.\\s]+/, '');
    output = output.replace(/[^a-zA-Z0-9]/g, '_');
    return output;
}

exports.filterThemeName = filterThemeName;
