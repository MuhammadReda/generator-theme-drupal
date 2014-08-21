'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

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
                type: 'input',
                name: 'themeName',
                message: 'Your theme name',
                default: this.appname,
                filter: function(userInput) {
                    return myUtils.filterThemeName(userInput);
                }
            },
            {
                type: 'input',
                name: 'themeDesc',
                message: 'Your theme description'
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
                type: 'confirm',
                name: 'useModernizr',
                message: 'Would you like to include Modernizr?',
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
            }
        ];

        this.prompt(prompts, function (props) {
            this.themeName = props.themeName;
            this.themeDesc = props.themeDesc;
            this.useGrunt = props.useGrunt;
            this.useGruntPlugins = props.useGruntPlugins;
            this.useModernizr = props.useModernizr;

            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            this.dest.mkdir('app');
            this.dest.mkdir('app/templates');

            this.src.copy('_package.json', 'package.json');
            this.src.copy('_bower.json', 'bower.json');
        },

        projectfiles: function() {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function() {
        if (!this.options['skip-install']) {
            // change directory before installing dependencies
//            process.chdir(process.cwd() + '/' + this.projectName);

            this.installDependencies({
                npm: true,
                bower: true
            });
        }
    }
});

module.exports = DrupalThemeGenerator;
