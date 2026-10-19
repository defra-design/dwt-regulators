const path = require('path')
const crypto = require('crypto')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000
const password = process.env.PROTOTYPE_PASSWORD
const COOKIE = 'dwt_auth'
const govukDist = path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')

app.set('trust proxy', 1) // Heroku terminates https, so this lets req.secure work
app.use(express.urlencoded({ extended: false }))

// Password gate: only active if PROTOTYPE_PASSWORD is set
if (password) {
  // Stateless cookie: a hash of the password, so changing the password logs everyone out
  const token = crypto.createHmac('sha256', password).update('dwt-regulators').digest('hex')
  const same = (a, b) => {
    const x = crypto.createHash('sha256').update(String(a)).digest()
    const y = crypto.createHash('sha256').update(String(b)).digest()
    return crypto.timingSafeEqual(x, y)
  }
  const hasCookie = (req) => {
    const match = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='))
    return Boolean(match) && same(match.slice(COOKIE.length + 1), token)
  }
  const safeNext = (n) => (typeof n === 'string' && /^\/(?![/\\])/.test(n) ? n : '/')
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  // Basic brute-force limit: 10 wrong attempts per IP per 15 minutes (resets on restart)
  const attempts = new Map()
  const tooMany = (ip) => (attempts.get(ip) || []).filter(t => Date.now() - t < 15 * 60 * 1000).length >= 10
  const fail = (ip) => attempts.set(ip, [...(attempts.get(ip) || []), Date.now()])

  const page = (next, error) => `<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="utf-8">
  <title>${error ? 'Error: ' : ''}Enter the password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="/govuk-frontend/govuk-frontend.min.css">
</head>
<body class="govuk-template__body">
  <script>document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');</script>
  <a href="#main-content" class="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>
  <div class="govuk-width-container">
    <main class="govuk-main-wrapper" id="main-content">
      <div class="govuk-grid-row"><div class="govuk-grid-column-two-thirds">
        ${error ? `<div class="govuk-error-summary" data-module="govuk-error-summary">
          <div role="alert">
            <h2 class="govuk-error-summary__title">There is a problem</h2>
            <div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list">
              <li><a href="#password">${escape(error)}</a></li>
            </ul></div>
          </div>
        </div>` : ''}
        <h1 class="govuk-heading-l">Enter the password</h1>
        <p class="govuk-body">This is a prototype. Use the password you were given to continue.</p>
        <form method="post" action="/login" novalidate>
          <input type="hidden" name="next" value="${escape(next)}">
          <div class="govuk-form-group${error ? ' govuk-form-group--error' : ''} govuk-password-input" data-module="govuk-password-input">
            <label class="govuk-label govuk-label--s" for="password">Password</label>
            ${error ? `<p id="password-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> ${escape(error)}</p>` : ''}
            <div class="govuk-input__wrapper govuk-password-input__wrapper">
              <input class="govuk-input govuk-password-input__input govuk-js-password-input-input${error ? ' govuk-input--error' : ''}" id="password" name="password" type="password" spellcheck="false"${error ? ' aria-describedby="password-error"' : ''} autocomplete="current-password" autocapitalize="none" autofocus>
              <button type="button" class="govuk-button govuk-button--secondary govuk-password-input__toggle govuk-js-password-input-toggle" data-module="govuk-button" aria-controls="password" aria-label="Show password" hidden>Show</button>
            </div>
          </div>
          <button type="submit" class="govuk-button" data-module="govuk-button">Continue</button>
        </form>
      </div></div>
    </main>
  </div>
  <script type="module" src="/govuk-frontend/govuk-frontend.min.js"></script>
  <script type="module">import { initAll } from '/govuk-frontend/govuk-frontend.min.js'; initAll()</script>
</body>
</html>`

  // Login page assets are public
  app.use('/govuk-frontend', express.static(govukDist))
  app.use('/assets', express.static(path.join(govukDist, 'assets')))

  app.get('/login', (req, res) => res.send(page(safeNext(req.query.next))))

  app.post('/login', (req, res) => {
    const next = safeNext(req.body.next)
    if (tooMany(req.ip)) return res.status(429).send(page(next, 'Too many attempts. Try again in 15 minutes'))
    const supplied = (req.body.password || '').trim()
    if (!supplied) return res.status(400).send(page(next, 'Enter the password'))
    if (!same(supplied, password)) {
      fail(req.ip)
      return res.status(401).send(page(next, 'Password is incorrect'))
    }
    res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.redirect(next)
  })

  app.use((req, res, next) => {
    if (hasCookie(req)) return next()
    res.redirect('/login?next=' + encodeURIComponent(req.originalUrl))
  })
}

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => console.log(`Prototype running at http://localhost:${port}`))
