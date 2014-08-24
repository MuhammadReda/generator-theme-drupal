<?php // $Id$



/**
* theme_preprocess_html()
*/
function <%= themeNameSanitized %>_preprocess_html(&$vars) {

    $vars['add_responsive_tags'] = true;
}



/**
* Implementation of hook_js_alter()
*/
function <%= themeNameSanitized %>_js_alter(&$js) {

    // add modernizr
    $modernizrKey = "<%= themeNameSanitized %>_modernizr";
    $js[$modernizrKey] = $js['misc/drupal.js'];
    $js[$modernizrKey]['data'] = '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.2/modernizr.min.js';
    $js[$modernizrKey]['weight'] = -999;
    $js[$modernizrKey]['version'] = '2.8.2';
}
