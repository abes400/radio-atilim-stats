# Radio Atılım Statistics Monitor

## Project setup
```
npm install
```

### Compiles and starts the application in debug mode
```
npm run build
```

### Compiles and packages the application as a standalone distributable, generating a dedicated installer depending on the platform desired.
Ex: For macOS, it generates a <b>.dmg</b> file.

For Windows, it generates an <b> Executable Installer (.exe)</b>.
```
npm run dist
```

### Compiles Vue components for development
This will allow you to preview the GUI in browser while editing templates and the stylesheets. However, since it lacks access to Electron's main process ( which it heavily depends on), most core functionalities will not work.
```
npm run serve
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
