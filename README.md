_This is very much a work in progress._

# locodoc

Simple node.js service which leverages [unoconv](https://github.com/dagwieers/unoconv) to use headless LibreOffice for document conversion.
It is made for use with [Manticore](https://github.com/adityab/Manticore), but can be used for other services too.

## Setup

Switch to the cloned repository, and then run:
```bash
npm install
cp config.sample.json config.json
```

## Run

```bash
node app.js
```

## Configure

You can edit the following in `config.json`:
- `port`: `3000` by default
- `allowedOrigin`: CORS whitelisted host(s), if requests come from browsers. Set to Manticore's standard port on the same server by default, `http://localhost:9000`.
