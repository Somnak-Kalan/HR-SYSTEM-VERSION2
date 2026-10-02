# Big-System

## Start this project

### Clone (ssh)

```
git clone git@gitlab.com:git-system-code/big-system.git
```

### Go to the project

```
cd big-system
```

### Installation

```
npm install --save
```

### Running

```
npm start
```

# Directory and file structure.

```
├── public
└── src
    ├── App.jsx // for config routes
    ├── assets  // for fonts and images
    ├── layouts // for layouts
    ├── pages   // for pages that use route in App.jsx
    |   ├── Sample
    |   |   └── Sample.jsx  // sample for use in others page
    |   └── mainFolderName
    |       └── pageName.jsx // can copy from sample above for use in other page
    ├── components
    |   ├── componentName.jsx
    |   └── folderName
    |       └── componentName.jsx
    ├── services
    |   └── fileName.service.js // file for rest api and call for use in ui
    └── utils
        └── http-common.js // connection file (axios)

```
