/**
 * God Focus /go/ smart links — App Store destinations + lightweight attribution.
 * God Focus is iOS-only: every device is sent to the configured App Store URL.
 * Analytics failure never blocks redirect.
 */
(function () {
  "use strict";

  var APP_STORE = "https://apps.apple.com/app/id6791024734";
  var GO_HOME = "https://godfocus.puzdev.com/go/";
  var LINKS_URL = "/go/links.json";

  // Public PostHog project key from God Focus app build settings (phc_… client key).
  var POSTHOG_TOKEN = "phc_wbXcpxCXnq8Fo5wQ9PF7HDK96m4g8BbhAi5r6B9QfWgQ";
  var POSTHOG_HOST = "https://us.i.posthog.com";
  var EVENT = "god_focus_short_link_click";
  var MAX_WAIT_MS = 280;

  function ua() {
    return String(navigator.userAgent || "");
  }

  function isAppleMobile() {
    var s = ua();
    if (/iPhone|iPad|iPod/i.test(s)) return true;
    // iPadOS desktop UA still reports Mac + touch
    if (/Macintosh/i.test(s) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1) {
      return true;
    }
    return false;
  }

  function sourceCode() {
    var path = (location.pathname || "/").replace(/\/+/g, "/");
    var m = path.match(/\/go\/?([^/]*)\/?$/i);
    if (!m) return "";
    var code = String(m[1] || "").toLowerCase();
    if (!code || code === "index.html") return "";
    if (code.indexOf(".") !== -1) return "";
    return code;
  }

  function uuid() {
    try {
      if (crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    } catch (e) {}
    return "gf_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
  }

  function safeUrl(url, fallback) {
    try {
      var u = new URL(String(url || ""), location.href);
      if (u.protocol === "https:" || u.protocol === "http:") return u.href;
    } catch (e) {}
    return fallback || APP_STORE;
  }

  function setFallback(href) {
    var a = document.getElementById("fallback");
    if (a) a.setAttribute("href", href);
  }

  function go(href) {
    try {
      location.replace(href);
    } catch (e) {
      location.href = href;
    }
  }

  /** Cookie-free capture via sendBeacon/fetch — no PostHog JS SDK. */
  function track(props) {
    if (!POSTHOG_TOKEN || POSTHOG_TOKEN.indexOf("phc_") !== 0) {
      return Promise.resolve(false);
    }
    var body = JSON.stringify({
      api_key: POSTHOG_TOKEN,
      event: EVENT,
      distinct_id: uuid(),
      properties: Object.assign(
        {
          $lib: "god-focus-go",
          $lib_version: "1.0.0",
          product: "god_focus",
          analytics_surface: "smart_link",
          platform: "web"
        },
        props || {}
      ),
      timestamp: new Date().toISOString()
    });
    var endpoint = POSTHOG_HOST.replace(/\/+$/, "") + "/capture/";

    return new Promise(function (resolve) {
      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        resolve(!!ok);
      }
      try {
        if (navigator.sendBeacon) {
          var blob = new Blob([body], { type: "application/json" });
          var ok = navigator.sendBeacon(endpoint, blob);
          setTimeout(function () {
            finish(ok);
          }, 40);
          return;
        }
      } catch (e) {}
      try {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          mode: "cors",
          keepalive: true,
          credentials: "omit"
        })
          .then(function () {
            finish(true);
          })
          .catch(function () {
            finish(false);
          });
      } catch (e2) {
        finish(false);
      }
    });
  }

  function resolve(registry, code) {
    var defaults = (registry && registry.defaults) || {};
    var storeDefault = defaults.ios_destination || defaults.destination || APP_STORE;
    var version = registry && registry.link_version != null ? registry.link_version : 1;

    if (!code) {
      return {
        source_id: "root",
        channel: "direct",
        placement: "go_root",
        is_qr: false,
        destination: safeUrl(storeDefault, APP_STORE),
        link_version: version,
        valid: true
      };
    }

    var entry = registry && registry.links ? registry.links[code] : null;
    if (!entry || entry.enabled === false) {
      // Invalid / disabled → soft-land on /go/ (which then goes to App Store).
      return {
        source_id: code,
        channel: "unknown",
        placement: "invalid",
        is_qr: false,
        destination: GO_HOME,
        link_version: version,
        valid: false
      };
    }

    var dest = entry.ios_destination || entry.destination || storeDefault;
    return {
      source_id: code,
      channel: entry.channel || "unknown",
      placement: entry.placement || "unknown",
      is_qr: !!entry.is_qr,
      destination: safeUrl(dest, APP_STORE),
      link_version: version,
      valid: true
    };
  }

  function run(registry) {
    var code = sourceCode();
    var resolved = resolve(registry, code);
    setFallback(resolved.destination);

    var props = {
      source_id: resolved.source_id,
      channel: resolved.channel,
      placement: resolved.placement,
      is_qr: resolved.is_qr,
      destination: resolved.destination,
      link_version: resolved.link_version,
      valid_source: resolved.valid,
      device_class: isAppleMobile() ? "apple_mobile" : "other"
    };

    var redirected = false;
    function redirectNow() {
      if (redirected) return;
      redirected = true;
      go(resolved.destination);
    }

    var timer = setTimeout(redirectNow, MAX_WAIT_MS);
    track(props)
      .catch(function () {})
      .then(function () {
        clearTimeout(timer);
        redirectNow();
      });
  }

  function boot() {
    setFallback(APP_STORE);
    fetch(LINKS_URL, { cache: "no-store", credentials: "omit" })
      .then(function (res) {
        if (!res.ok) throw new Error("links_" + res.status);
        return res.json();
      })
      .then(run)
      .catch(function () {
        run({
          link_version: 1,
          defaults: {
            ios_destination: APP_STORE
          },
          links: {}
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
