# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## NPMPackageEditor [Unreleased]
### Breaking
  - Fixed spelling errors in exported properties

### Fixed
  - Vulnerabilities in dependencies
  - Spelling errors

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.7...dev)

## NPMPackageEditor v1.4.7
### Fixed
  - Vulnerabilities in dependencies
  - Drone-pipelines for multi-digit version-numbers

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.6...v1.4.7)

## NPMPackageEditor v1.4.6
### Fixed
  - Broken drone-pipelines
  - Broken Auto-Merge workflow

### Updated
  - All dependencies
  - Drone-pipelines to use small-sized images

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.5...v1.4.6)

## NPMPackageEditor v1.4.5
### Fixed
  - Vulnerabilities in dependencies

### Added
  - A workflow for merging Dependabot-PRs
  - A workflow for analyzing the code

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.4...v1.4.5)

## NPMPackageEditor v1.4.4
### Updated
  - All dependencies

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.3...v1.4.4)

## NPMPackageEditor v1.4.3
### Fixed
  - Broken dependabot-settings
  - Vulnerabilities in dependencies

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.2...v1.4.3)

## NPMPackageEditor v1.4.2
### Updated
  - ESLint rules for preventing usage of deprecated API

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.1...v1.4.2)

## NPMPackageEditor v1.4.1
### Added
  - A component for representing `package.json`-files with additional properties

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.4.0...v1.4.1)

## NPMPackageEditor v1.4.0
### Added
  - The functionality to store additional properties in the `Package` class
  - Tests for improving the stability

### Updated
  - All dependencies
  - The TypeScript-library

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.3.1...v1.4.0)

## NPMPackageEditor v1.3.1
### Fixed
  - The path-determination of the `README` file during `Package` normalization

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.3.0...v1.3.1)

## NPMPackageEditor v1.3.0
### Added
  - Support for ignoring existing dependencies when `Register`ing dependencies to a collection
  - The functionality to set values of existing `Directory`-entries using the `Directory.Set` method

### Fixed
  - `Normalize` method of the `Package` class
  - `Key`-existence checking in the `Dictionary` class

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.2.0...v1.3.0)

## NPMPackageEditor v1.2.0
### Added
  - Support for overwriting existing dependencies when registering a collection
  - A property for retrieving all dependencies in a collection
  - A `FileName` property to the `Package` class
  - New tests for stability improvements

### Updated
  - The `README` file
  - All dependencies

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.1.0...v1.2.0)

## NPMPackageEditor v1.1.0
### Added
  - Functionality for clearing dependency-collections
  - Support for automatically setting git-related info
  - Functionality to automatically load the `description` from `README` files

[Show differences](https://github.com/manuth/NPMPackageEditor/compare/v1.0.0...v1.1.0)

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
