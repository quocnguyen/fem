#!/usr/bin/env node

'use strict'

const cli = require('commander')
const request = require('superagent')
const cheerio = require('cheerio')
const co = require('co')
// const ask = require('inquirer').prompt
const execa = require('execa')
const queue = require('queue')({
  concurrency: 5
})
cli
.version('0.0.2')

cli
  .command('dl <url>')
  .description('download fem course url')
  .action(function (url) {
    co(function *() {
      let agent = request.agent()
      let res = yield agent.get('https://frontendmasters.com/login/')
      let $ = cheerio.load(res.text)
      let form = $('#rcp_login_form')
      let nonce = form.find('input[name="rcp_login_nonce"]').val()
      // let answer = yield ask([
      //   {
      //     type: 'text',
      //     message: 'Your frontendmasters username',
      //     name: 'username'
      //   },
      //   {
      //     type: 'password',
      //     message: 'Your frontendmasters password',
      //     name: 'password'
      //   }
      // ])

      let answer = {
        username: 'quocnguyen@clgt.vn',
        password: 'clgtteam'
      }

      res = yield agent
        .post('https://frontendmasters.com/login/')
        .type('form')
        .send({
          rcp_user_login: answer.username,
          rcp_user_pass: answer.password,
          rcp_action: 'login',
          rcp_redirect: '/courses/',
          rcp_login_nonce: nonce,
          rcp_login_submit: 'Login'
        })

      res = yield agent.get(url)
      $ = cheerio.load(res.text)
      let videos = $('.video-link').map(function () {
        return $(this).attr('href').replace('#v=', '')
      }).get()

      console.log(`Total videos: ${videos.length}`)
      // let courseName = url.split('/courses/')[1].split('/').join('')
      // mkdirp.sync(`download/${courseName}`)

      videos.forEach(function (video, idx, list) {
        queue.push(function (cb) {
          console.log(`download video ${idx}/${list.length}....`)
          let cmd = execa('youtube-dl', [`http://fast.wistia.net/embed/iframe/${video}`])
          cmd.then(function () {
            console.log(`downloaded video ${idx}/${list.length}`, video)
            cb()
          })
        })
      })

      queue.start(function (err) {
        if (err) console.log(err)
        console.log('all done')
      })
    })
    .catch(console.log)
  })

cli.parse(process.argv)
