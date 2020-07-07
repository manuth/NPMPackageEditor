# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## NPMPackageEditor [unreleased]
### Added
  - Support for ignoring existing dependencies when `Register`ing dependencies to a collection
  - The functionality to set values of existing `Directory`-entries using the `Directory.Set` method

### Fixed
  - `Normalize` method of the `Package` class
  - `Key`-existence checking in the `Dictionary` class

[Show differences](https://github.com/manuth/ESLintPresets/compare/v1.2.0...dev)

## NPMPackageEditor v1.2.0
### Added
  - Support for overwriting existing dependencies when registering a collection
  - A property for retrieving all dependencies in a collection
  - A `FileName` property to the `Package` class
  - New tests for stability improvements

### Updated
  - The `README` file
  - All dependencies

[Show differences](https://github.com/manuth/ESLintPresets/compare/v1.1.0...v1.2.0)

## NPMPackageEditor v1.1.0
### Added
  - Functionality for clearing dependency-collections
  - Support for automatically setting git-related info
  - Functionality to automatically load the `description` from `README` files

[Show differences](https://github.com/manuth/ESLintPresets/compare/v1.0.0...v1.1.0)

## NPMPackageEditor v1.0.0
### Added
  - Types for `package.json`-metadata
  - Components for creating dynamic objects
  - Classes for storing key-value pairs
  - A `Package`-class for editing package-metadata
  - Functionality to decide under which circumstances properties are added to the resulting `package.json` metadata
  - Tests for all classes
  - Class for converting objects to `Dictionary`s
  - Components for managing dependencies

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/e60b0f6d7b2b11bcf89171030121bd2912d58cb6...v1.0.0)
