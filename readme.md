
# fem
`fem` is cli tool to download frontendmaster.com course videos directly to your google drive

## Installation

```
git clone https://github.com/quocnguyen/fem
cd fem && npm i
cp .env-sample .env
```

## Config

put your config in `.env` file.

| KEY  | MEAN |
| ------------- | ------------- |
| COOKIE  | frontendmaster cookie  |
| GOOGLE_CLIENT_ID  | your google client api  |
| GOOGLE_CLIENT_SECRET | your google client secret |
| GOOGLE_REFRESH_TOKEN | google oauth2 refresh token |


## How to use

```
node cli.js dl <COURSE URL> <GOOGLE DRIVE FOLDER ID>
```

## Example

```
node cli.js dl https://frontendmasters.com/courses/lean-front-end-engineering/ 0B_XXXoiWQLD3bHZFc1FicllndHM
```

## Why download
Frontend Master courses are super awesome and cover a lot in-deep stuffs. I need to download them to my google drive and re-watching them whatever I want. I am stupid, can't understand all in 1 run.

This script by any mean isn't a hack or cheat, you need frontend master subscription in order to use.

Buy their subscription. It's worth every penny, you got my word, finger crossed.

# License

MIT
