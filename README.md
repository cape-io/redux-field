# redux-field

For when you want to control individual form fields with redux. Think something like https://vitalets.github.io/x-editable/ for Redux.

Nothing should stop you from using the same reducer/actions for an entire form. However the main purpose of this is to save individual form fields as they change with a backend every time they change.

In the future we will likely create helper functions to allow for easier full form integration.

Currently source is in a single (yuck) file. It will be split into many files with tests for each in the following weeks. Unfortunately, today you'll have to read the source for documentation.

This is a 1.0 release because it's used in production. Will follow semver.
