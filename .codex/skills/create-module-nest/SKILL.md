---
name: create-module-nest
description: Create a NestJS module under src/api using hexagonal architecture. Use this when the user asks to scaffold a module like "create-module-nest registration" or asks to create a Nest module with application, domain, infrastructure, controller, dto, repository, schema, and module file. Prefer the helper script in scripts/create-module-nest.sh for deterministic scaffolding. Fail if the target folder already exists.
---

# Purpose
Create a full NestJS module scaffold inside `src/api/<module-name>` using a deterministic helper script.

# When to use
Use this skill when the task is to scaffold a new module under `src/api` with this structure:

- `application/services`
- `domain/models`
- `domain/ports`
- `infrastructure/controllers`
- `infrastructure/repositories`
- `infrastructure/schemas`
- `<module-name>.module.ts`

# Inputs
Accept any of these forms:

- `create-module-nest registration`
- `create-module-nest user-profile`
- `create module nest registration`
- `create a nest module called registration`

# Behavior
1. Extract the module name from the request.
2. Normalize the module name to kebab-case.
3. Prefer running the helper script:
   - `bash .codex/skills/create-module-nest/scripts/create-module-nest.sh "<module-name>"`
4. If the script path does not exist in the current project, also check:
   - `bash ./.codex/skills/create-module-nest/scripts/create-module-nest.sh "<module-name>"`
5. If both paths fail because the skill is installed elsewhere but the files are visible to Codex, locate `create-module-nest.sh` inside this skill and execute it with the normalized module name.
6. If the target folder already exists, stop and report failure. Do not overwrite files.
7. Do not modify `src/app.module.ts`.
8. After successful creation:
   - print the created file tree
   - summarize the module name and path created

# Output requirements
Return:
- whether creation succeeded
- the target path
- the created files

# Constraints
- No partial scaffolding
- No TODO placeholders
- Must create compilable NestJS boilerplate
- Use:
   - kebab-case for file/folder names
   - PascalCase for classes
   - camelCase for injected model variable
- Collection name should be a simple pluralized kebab-case form

# Notes
Use the script because it is cheaper and more deterministic than generating every file inline.