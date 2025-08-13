export interface Dependency {
    name: string
    git: URL | string
    type: "endpoint" | "hook" | "interface" | "module" | "layout" | "display" | "panel" | "operation" | "bundle"
    npm_install?: boolean | "true" | "false"
    npm_build?: boolean | "true" | "false"
    branch?: string
}
