# secret-santa

## Installation

Make sure to install NPM first.
https://nodejs.org/en/

Clone the repository and run `npm install`:

(You can skip typescript install if you already have it)

```
npm i typescript -g
git clone https://github.com/ryand88/secret-santa
cd secret-santa
touch ./src/config/keys_dev.ts
npm install
```

Add mongu URI to keys_dev.ts

Compile Typescript files on both server and client, then run server.

```
tsc
cd client
tsc
cd ..
npm run server
```

(You could also open separate terminals for client and server and run "tsc -w" for watch mode)

Navigate to localhost:5000
