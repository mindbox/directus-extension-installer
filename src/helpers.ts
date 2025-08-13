import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { parse } from "yaml";
import path from "node:path";
import { Dependency } from "./types";

export function readDependenciesFromFile(filepath: string) {
    const depsFile = readFileSync(path.resolve(filepath), 'utf-8')
    return JSON.parse(depsFile) as Array<Dependency>
}

export function parseStringToDependencies(string: string) {
    return JSON.parse(string) as Array<Dependency>
}

export function parseYamlToDependencies(filepath: string) {
    const yamlFile = readFileSync(filepath, 'utf-8')
    const yamlContents = parse(yamlFile)

    // Check if there is a directus object in the yaml file.
    if (!yamlContents.directus) throw Error('There is no "directus" object in your yaml file. Please make sure to provide the right structure.')

    // Check if there are extensions in the yaml file.
    if (!yamlContents.directus.extra_extensions || !yamlContents.directus.extra_extensions.extensions) throw Error('There are no extensions inside of your yaml or you have the wrong format.')

    for(let ext of yamlContents.directus.extra_extensions.extensions) {
        if(ext.npm_install && typeof ext.npm_install === "string") ext.npm_install = parseBoolean(ext.npm_install)
    }

    return yamlContents.directus.extra_extensions.extensions as Array<Dependency>
}

export function getExtensionPath(extensionsInstallPath: string, dependencyType: string, dependencyName: string) {
    let finalPath = ""
    switch (dependencyType) {
        case "display":
            finalPath = path.resolve(extensionsInstallPath, 'displays', dependencyName)
            break;
        case "endpoint":
            finalPath = path.resolve(extensionsInstallPath, 'endpoints', dependencyName)
            break;
        case "hook":
            finalPath = path.resolve(extensionsInstallPath, 'hooks', dependencyName)
            break;
        case "interface":
            finalPath = path.resolve(extensionsInstallPath, 'interfaces', dependencyName)
            break;
        case "layout":
            finalPath = path.resolve(extensionsInstallPath, 'layouts', dependencyName)
            break;
        case "module":
            finalPath = path.resolve(extensionsInstallPath, 'modules', dependencyName)
            break;
        case "operation":
            finalPath = path.resolve(extensionsInstallPath, 'operations', dependencyName)
            break;
        case "panel":
            finalPath = path.resolve(extensionsInstallPath, 'panels', dependencyName)
            break;
        case "bundle":
            finalPath = path.resolve(extensionsInstallPath, dependencyName)
            break;
    }
    return finalPath
}

export function parseBoolean(input: "true" | "false") {
    return JSON.parse(input)
}

export function createExtensionBasePaths(extensionsInstallPath:string) {
    createPathIfNotExists(extensionsInstallPath)
    const extensionBaseFolders = [
        'displays',
        'endpoints',
        'hooks',
        'interfaces',
        'layouts',
        'modules',
        'operations',
        'panels'
    ]
    extensionBaseFolders.forEach(extensionBaseFolder => createPathIfNotExists(path.join(extensionsInstallPath, extensionBaseFolder)))
}

export function createPathIfNotExists(pathToCreate:string) {
    if(!existsSync(path.resolve(pathToCreate))) {
        mkdirSync(path.resolve(pathToCreate))
    }
}
