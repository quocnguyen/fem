#!/usr/bin/env node

'use strict'
require('dotenv').config({silent: true})
const cli = require('commander')
const request = require('superagent')
const cheerio = require('cheerio')
const co = require('co')
const dl = require('youtube-dl')
const gdb = require('google-drive-blobs')
const queue = require('queue')({
  concurrency: 5
})
const store = gdb({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

cli
.version('0.0.3')

cli
  .command('dl <url> <parentId>')
  .description('download fem course url')
  .action(function (url, parentId) {
    co(function *() {
      const agent = request.agent()
      const res = yield agent
        .get(url)
        .set('Cookie', process.env.COOKIE)
      const $ = cheerio.load(res.text)
      let videos = $('.video-link').map(function () {
        return $(this).attr('href').replace('#v=', '')
      }).get()

      console.log(`Total videos: ${videos.length}`)

      videos.forEach(function (videoId, idx, list) {
        queue.push(function (cb) {
          getInfo(videoId).then(video => pipeToDrive({video, parentId}, cb))
        })
      })

      queue.on('success', function (result, job) {
        console.log(`Done: ${result.title}`)
      })

      queue.start(function (err) {
        if (err) console.log(err)
        console.log('Completed!')
      })
    })
    .catch(console.log)
  })

function getInfo (videoId) {
  return new Promise((resolve, reject) => {
    dl.getInfo(`http://fast.wistia.net/embed/iframe/${videoId}`, function (err, info) {
      console.log(`Download video ${info._filename}`)
      if (err) { return reject(err) }
      resolve(info)
    })
  })
}

function pipeToDrive ({video, parentId}, cb) {
  dl(`http://fast.wistia.net/embed/iframe/${video.id}`).pipe(
    store.createWriteStream({
      filename: video._filename,
      parent: parentId
    }, cb)
  )
}

cli.parse(process.argv)
