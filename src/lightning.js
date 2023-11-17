module.exports = () => {
  window.lightningjs || (function (n) {
    const e = 'lightningjs';
    function t(e, t) {
      let r; let i; let a; let o; let d; let
        c;
      return (
        t && (t += `${/\?/.test(t) ? '&' : '?'}lv=1`),
        n[e]
          || ((r = window),
          (i = document),
          (a = e),
          (o = i.location.protocol),
          (d = 'load'),
          (c = 0),
          (function () {
            n[a] = function () {
              const t = arguments;
              const i = this;
              const o = ++c;
              const d = (i && i != r && i.id) || 0;
              function s() {
                return (s.id = o), n[a].apply(s, arguments);
              }
              return (
                (e.s = e.s || []).push([o, d, t]),
                (s.then = function (n, t, r) {
                  const i = (e.fh[o] = e.fh[o] || []);
                  const a = (e.eh[o] = e.eh[o] || []);
                  const d = (e.ph[o] = e.ph[o] || []);
                  return n && i.push(n), t && a.push(t), r && d.push(r), s;
                }),
                s
              );
            };
            var e = (n[a]._ = {});
            function s() {
              e.P(d), (e.w = 1), n[a]('_load');
            }
            (e.fh = {}),
            (e.eh = {}),
            (e.ph = {}),
            (e.l = t
              ? t.replace(/^\/\//, `${o == 'https:' ? o : 'http:'}//`)
              : t),
            (e.p = { 0: +new Date() }),
            (e.P = function (n) {
              e.p[n] = new Date() - e.p[0];
            }),
            e.w && s(),
            r.addEventListener
              ? r.addEventListener(d, s, !1)
              : r.attachEvent('onload', s);
            const l = function () {
              function n() {
                return [
                  '<!DOCTYPE ',
                  o,
                  '><',
                  o,
                  '><head></head><',
                  t,
                  '><',
                  r,
                  ' src="',
                  e.l,
                  '"></',
                  r,
                  '></',
                  t,
                  '></',
                  o,
                  '>',
                ].join('');
              }
              var t = 'body';
              var r = 'script';
              var o = 'html';
              const d = i[t];
              if (!d) { return setTimeout(l, 100); }
              e.P(1);
              let c;
              const s = i.createElement('div');
              const h = s.appendChild(i.createElement('div'));
              const u = i.createElement('iframe');
              (s.style.display = 'none'),
              (d.insertBefore(s, d.firstChild).id = `lightningjs-${a}`),
              (u.frameBorder = '0'),
              (u.id = `lightningjs-frame-${a}`),
              /MSIE[ ]+6/.test(navigator.userAgent)
                  && (u.src = 'javascript:false'),
              (u.allowTransparency = 'true'),
              h.appendChild(u);
              try {
                u.contentWindow.document.open();
              } catch (n) {
                (e.domain = i.domain),
                (c = `javascript:var d=document.open();d.domain='${
                  i.domain
                }';`),
                (u.src = `${c}void(0);`);
              }
              try {
                const p = u.contentWindow.document;
                p.write(n()), p.close();
              } catch (e) {
                u.src = `${c
                }d.write("${
                  n().replace(/"/g, `${String.fromCharCode(92)}"`)
                }");d.close();`;
              }
              e.P(2);
            };
            e.l && l();
          }())),
        (n[e].lv = '1'),
        n[e]
      );
    }
    const r = (window.lightningjs = t(e));
    (r.require = t), (r.modules = n);
  }({}));
};
