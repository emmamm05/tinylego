/*
 * grunt build task
 * https://github.com/blueimp/grunt-bump-build-git
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module */
module.exports = function (grunt) {
    'use strict';
    grunt.registerTask(
        'build',
        'Bump the version, build the project and add, commit and tag in git in one step.',
        function (version, message) {
            var tasks = ['bump:' + (version || '')].concat(
                grunt.config('build.tasks') || ['default']
            );
            if (message) {
                tasks.push('git:add');
                tasks.push('git:commit:' + message);
                if (version) {
                    tasks.push('git:tag:' + message);
                }
            }
            grunt.task.run(tasks);
        }
    );
};
