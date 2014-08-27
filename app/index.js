'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var _ = require('lodash');

var myUtils = require('../utils/utils');

var DrupalThemeGenerator = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
//        this.log(yosay(
//            'Welcome to the gnarly Drupal-Theme generator!'
//        ));

        var prompts = [
            {
                type: 'input',
                name: 'themeName',
                message: 'Your theme name',
                default: this.appname
            },
            {
                type: 'input',
                name: 'themeDesc',
                message: 'Your theme description',
                default: 'None'
            },
            {
                type: 'list',
                name: 'drupalVersion',
                message: 'Drupal version',
                choices: [
                    {
                        value: 'drupal7',
                        name: 'Drupal 7'
                    },
                    {
                        value: 'drupal8',
                        name: 'Drupal 8'
                    }
                ]
            },
            {
                type: 'confirm',
                name: 'useGrunt',
                message: 'Would you like to use Grunt as your task runner?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useGruntPlugins',
                message: 'Would you like some help compressing your js, css and images?',
                default: true
            },
            {
                type: 'list',
                name: 'cssFramework',
                message: 'CSS framework',
                choices: [
                    {
                        value: 'foundation',
                        name: 'Foundation for SASS/Compass'
                    },
                    {
                        value: 'bootstrap',
                        name: 'Bootstrap for SASS/Compass'
                    },
                    {
                        value: 'none',
                        name: 'None'
                    }
                ]
            },
            {
                type: 'checkbox',
                name: 'addFeatures',
                message: 'Additional features?',
                choices: [
                    {
                        value: 'modernizr',
                        name: 'Use Modernizr (Loaded from cdnJs.com; But you can change that later from theme\'s template.php file.)'
                    },
                    {
                        value: 'rtl',
                        name: 'Right-to-Left Support (for Bootstrap or Foundation)'
                    }
                ]
            }
        ];

        this.prompt(prompts, function (props) {
            this.themeName= myUtils.filterThemeName(props.themeName);
            this.themeNameOriginal = props.themeName;
            this.themeDesc = props.themeDesc;
            this.drupalVersion = props.drupalVersion;
            this.cssFramework = props.cssFramework;
            this.useGrunt = props.useGrunt;
            this.useGruntPlugins = props.useGruntPlugins;
            
            this.featureModernizr = (_.indexOf(props.addFeatures, 'modernizr') != -1) ? true : false;
            this.featureRtl = (_.indexOf(props.addFeatures, 'rtl') != -1) ? true : false;

            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            var _appFolder = this.themeName;
            
            this.dest.mkdir(_appFolder);
            this.dest.mkdir(_appFolder + '/templates');
            this.dest.mkdir(_appFolder + '/scss');
            this.dest.mkdir(_appFolder + '/css');

            this.template('_package.json', _appFolder + '/package.json');
            this.template('_bower.json', _appFolder + '/bower.json');
        },

        projectfiles: function() {
            var _appFolder = this.themeName;
            
            this.src.copy('gitignore', _appFolder + '/.gitignore');
            this.src.copy('bowerrc', _appFolder + '/.bowerrc');
            this.src.copy('editorconfig', _appFolder + '/.editorconfig');
            this.src.copy('jshintrc', _appFolder + '/.jshintrc');
            
            // do NOT copy compass config file if none cssFramework is selected.
            if(this.cssFramework !== 'none')
                this.src.copy('_config.rb', _appFolder + '/config.rb');
            // copy cssFramework .scss files
            else if(this.cssFramework === 'foundation') {
                this.src.copy('scss/__foundation-settings.scss', _appFolder + '/scss/_foundation-settings.scss');
                this.src.copy('scss/_foundation.scss', _appFolder + '/scss/foundation.scss');
                if(this.featureRtl) {
                    this.src.copy('scss/__foundation-settings-rtl.scss', _appFolder + '/scss/_foundation-settings-rtl.scss');
                    this.src.copy('scss/_foundation-rtl.scss', _appFolder + '/scss/foundation-rtl.scss');
                }
            }
            else if(this.cssFramework === 'bootstrap') {
                this.src.copy('scss/_bootstrap.scss', _appFolder + '/scss/bootstrap.scss');
                if(this.featureRtl) {
                    this.src.copy('scss/_bootstrap-rtl.css', _appFolder + '/css/bootstrap-rtl.scss');
                }
            }
            
            
            if(this.drupalVersion === 'drupal7') {
                this.template('d7/_theme.info', _appFolder + '/' + _appFolder + '.info');
                this.template('d7/_template.php', _appFolder + '/template.php');
                if(this.cssFramework === 'foundation') {
                    this.template('d7/_html-foundation.tpl.php', _appFolder + '/templates/html.tpl.php');
                }
                else if(this.cssFramework === 'bootstrap') {
                    this.template('d7/_html-bootstrap.tpl.php', _appFolder + '/templates/html.tpl.php');
                }
                else {
                    
                }
            }
        }
    },

    end: function() {
        if (!this.options['skip-install']) {
            // change directory before installing dependencies
            process.chdir(process.cwd() + '/' + this.themeName);
            
            this.installDependencies({
                npm: true,
                bower: true
            });
        }
    }
});

module.exports = DrupalThemeGenerator;
