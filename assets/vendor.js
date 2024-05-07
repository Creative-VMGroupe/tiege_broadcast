var themeVendor = (function (t) {
  "use strict";
  function e(t, e) {
    return (
      e.forEach(function (e) {
        e &&
          "string" != typeof e &&
          !Array.isArray(e) &&
          Object.keys(e).forEach(function (i) {
            if ("default" !== i && !(i in t)) {
              var n = Object.getOwnPropertyDescriptor(e, i);
              Object.defineProperty(
                t,
                i,
                n.get
                  ? n
                  : {
                      enumerable: !0,
                      get: function () {
                        return e[i];
                      },
                    }
              );
            }
          });
      }),
      Object.freeze(t)
    );
  }
  var i = ["DA", "DE", "EN", "ES", "FR", "IT", "JA", "NL", "PT", "PT_BR"];
  function n(t) {
    var e = t.replace(/-/, "_").toUpperCase();
    return -1 !== i.indexOf(e)
      ? e
      : -1 !== i.indexOf(e.substring(0, 2))
      ? e.substring(0, 2)
      : "EN";
  }
  var s = /({\w+})/g,
    o = {
      lastName: '[name="address[last_name]"]',
      firstName: '[name="address[first_name]"]',
      company: '[name="address[company]"]',
      address1: '[name="address[address1]"]',
      address2: '[name="address[address2]"]',
      country: '[name="address[country]"]',
      zone: '[name="address[province]"]',
      postalCode: '[name="address[zip]"]',
      city: '[name="address[city]"]',
      phone: '[name="address[phone]"]',
    };
  function r(t, e, i, n) {
    var o = (function (t, e) {
      return (
        (t = t || "CA"),
        e.filter(function (e) {
          return e.code === t;
        })[0]
      );
    })(i, n);
    !(function (t, e) {
      Object.keys(t).forEach(function (i) {
        t[i].labels.forEach(function (t) {
          t.textContent = e.labels[i];
        });
      });
    })(e, o),
      (function (t, e, i) {
        var n = i.formatting.edit,
          o = e.country.wrapper,
          r = !1;
        ((l = n),
        l.split("_").map(function (t) {
          var e = t.match(s);
          return e
            ? e.map(function (t) {
                var e = t.replace(/[{}]/g, "");
                switch (e) {
                  case "zip":
                    return "postalCode";
                  case "province":
                    return "zone";
                  default:
                    return e;
                }
              })
            : [];
        })).forEach(function (i) {
          i.forEach(function (n) {
            (e[n].wrapper.dataset.lineCount = i.length),
              e[n].wrapper &&
                ("country" !== n
                  ? r
                    ? t.append(e[n].wrapper)
                    : t.insertBefore(e[n].wrapper, o)
                  : (r = !0));
          });
        });
        var l;
      })(t, e, o),
      (function (t, e) {
        var i = t.zone;
        if (!i) return;
        if (0 === e.zones.length)
          return (
            (i.wrapper.dataset.ariaHidden = "true"),
            void (i.input.innerHTML = "")
          );
        i.wrapper.dataset.ariaHidden = "false";
        var n = i.input,
          s = n.cloneNode(!0);
        (s.innerHTML = ""),
          e.zones.forEach(function (t) {
            var e = document.createElement("option");
            (e.value = t.code), (e.textContent = t.name), s.appendChild(e);
          }),
          (n.innerHTML = s.innerHTML),
          n.dataset.default && (n.value = n.dataset.default);
      })(e, o);
  }
  var l = Object.freeze({
    __proto__: null,
    AddressForm: function (t, e, i) {
      e = e || "en";
      var s = (function (t, e) {
        var i = {};
        return (
          Object.keys(o).forEach(function (n) {
            var s = t.querySelector(e[n]);
            i[n] = s
              ? {
                  wrapper: s.parentElement,
                  input: s,
                  labels: document.querySelectorAll('[for="' + s.id + '"]'),
                }
              : {};
          }),
          i
        );
      })(
        t,
        (function () {
          for (var t = Object({}), e = 0; e < arguments.length; e++) {
            var i = arguments[e];
            if (i)
              for (var n in i)
                Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
          }
          return t;
        })(o, (i = i || { inputSelectors: {} }).inputSelectors)
      );
      return (
        (function (t) {
          Object.keys(t).forEach(function (e) {
            var i = t[e].input,
              n = t[e].labels;
            if (i) {
              if ("object" != typeof i)
                throw new TypeError(t[e] + " is missing an input or select.");
              if ("object" != typeof n)
                throw new TypeError(t[e] + " is missing a label.");
            }
          });
        })(s),
        (function (t) {
          if (!t) return Promise.resolve(null);
          return fetch(location.origin + "/meta.json")
            .then(function (t) {
              return t.json();
            })
            .then(function (t) {
              return -1 !== t.ships_to_countries.indexOf("*")
                ? null
                : t.ships_to_countries;
            })
            .catch(function () {
              return null;
            });
        })(i.shippingCountriesOnly).then(function (i) {
          return (function (t) {
            return fetch("https://country-service.shopifycloud.com/graphql", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({
                query:
                  "query countries($locale: SupportedLocale!) {  countries(locale: $locale) {    name    code    labels {      address1      address2      city      company      country      firstName      lastName      phone      postalCode      zone    }    formatting {      edit    }    zones {      name      code    }  }}",
                operationName: "countries",
                variables: { locale: n(t) },
              }),
            })
              .then(function (t) {
                return t.json();
              })
              .then(function (t) {
                return t.data.countries;
              });
          })(e).then(function (e) {
            !(function (t, e, i) {
              !(function (t, e) {
                var i = t.country.input,
                  n = i.cloneNode(!0);
                e.forEach(function (t) {
                  var e = document.createElement("option");
                  (e.value = t.code),
                    (e.textContent = t.name),
                    n.appendChild(e);
                }),
                  (i.innerHTML = n.innerHTML),
                  i.dataset.default && (i.value = i.dataset.default);
              })(e, i);
              var n = e.country.input ? e.country.input.value : null;
              (function (t, e, i) {
                e.country.input.addEventListener("change", function (n) {
                  r(t, e, n.target.value, i);
                });
              })(t, e, i),
                r(t, e, n, i);
            })(
              t,
              s,
              (function (t, e) {
                if (!e) return t;
                return t.filter(function (t) {
                  return -1 !== e.indexOf(t.code);
                });
              })(e, i)
            );
          });
        })
      );
    },
  });
  var a = Object.freeze({
    __proto__: null,
    formatMoney: function (t, e) {
      "string" == typeof t && (t = t.replace(".", ""));
      let i = "";
      const n = /\{\{\s*(\w+)\s*\}\}/,
        s = e || "${{amount}}";
      function o(t, e = 2, i = ",", n = ".") {
        if (isNaN(t) || null == t) return 0;
        const s = (t = (t / 100).toFixed(e)).split(".");
        return (
          s[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${i}`) +
          (s[1] ? n + s[1] : "")
        );
      }
      switch (s.match(n)[1]) {
        case "amount":
          i = o(t, 2);
          break;
        case "amount_no_decimals":
          i = o(t, 0);
          break;
        case "amount_with_comma_separator":
          i = o(t, 2, ".", ",");
          break;
        case "amount_no_decimals_with_comma_separator":
          i = o(t, 0, ".", ",");
      }
      return s.replace(n, i);
    },
  });
  function c(t) {
    new Image().src = t;
  }
  function h(t, e) {
    if (null === e) return t;
    if ("master" === e) return d(t);
    const i = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
    if (i) {
      const n = t.split(i[0]),
        s = i[0];
      return d(`${n[0]}_${e}${s}`);
    }
    return null;
  }
  function d(t) {
    return t.replace(/http(s)?:/, "");
  }
  var u = Object.freeze({
      __proto__: null,
      preload: function (t, e) {
        "string" == typeof t && (t = [t]);
        for (let i = 0; i < t.length; i++) {
          c(h(t[i], e));
        }
      },
      loadImage: c,
      imageSize: function (t) {
        const e = t.match(
          /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/
        );
        return e ? e[1] : null;
      },
      getSizedImageUrl: h,
      removeProtocol: d,
    }),
    p =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {};
  function f(t) {
    return t &&
      t.__esModule &&
      Object.prototype.hasOwnProperty.call(t, "default")
      ? t.default
      : t;
  }
  var g,
    m = { exports: {} },
    v = { exports: {} },
    y = { exports: {} };
  (g = y),
    (function (t, e) {
      g.exports ? (g.exports = e()) : (t.EvEmitter = e());
    })("undefined" != typeof window ? window : p, function () {
      function t() {}
      let e = t.prototype;
      return (
        (e.on = function (t, e) {
          if (!t || !e) return this;
          let i = (this._events = this._events || {}),
            n = (i[t] = i[t] || []);
          return n.includes(e) || n.push(e), this;
        }),
        (e.once = function (t, e) {
          if (!t || !e) return this;
          this.on(t, e);
          let i = (this._onceEvents = this._onceEvents || {});
          return ((i[t] = i[t] || {})[e] = !0), this;
        }),
        (e.off = function (t, e) {
          let i = this._events && this._events[t];
          if (!i || !i.length) return this;
          let n = i.indexOf(e);
          return -1 != n && i.splice(n, 1), this;
        }),
        (e.emitEvent = function (t, e) {
          let i = this._events && this._events[t];
          if (!i || !i.length) return this;
          (i = i.slice(0)), (e = e || []);
          let n = this._onceEvents && this._onceEvents[t];
          for (let s of i)
            n && n[s] && (this.off(t, s), delete n[s]), s.apply(this, e);
          return this;
        }),
        (e.allOff = function () {
          return delete this._events, delete this._onceEvents, this;
        }),
        t
      );
    });
  var b = { exports: {} };
  /*!
   * Infinite Scroll v2.0.4
   * measure size of elements
   * MIT license
   */ !(function (t) {
    !(function (e, i) {
      t.exports ? (t.exports = i()) : (e.getSize = i());
    })(window, function () {
      function t(t) {
        let e = parseFloat(t);
        return -1 == t.indexOf("%") && !isNaN(e) && e;
      }
      let e = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ];
      return function (i) {
        if (
          ("string" == typeof i && (i = document.querySelector(i)),
          !(i && "object" == typeof i && i.nodeType))
        )
          return;
        let n = getComputedStyle(i);
        if ("none" == n.display)
          return (function () {
            let t = {
              width: 0,
              height: 0,
              innerWidth: 0,
              innerHeight: 0,
              outerWidth: 0,
              outerHeight: 0,
            };
            return (
              e.forEach((e) => {
                t[e] = 0;
              }),
              t
            );
          })();
        let s = {};
        (s.width = i.offsetWidth), (s.height = i.offsetHeight);
        let o = (s.isBorderBox = "border-box" == n.boxSizing);
        e.forEach((t) => {
          let e = n[t],
            i = parseFloat(e);
          s[t] = isNaN(i) ? 0 : i;
        });
        let r = s.paddingLeft + s.paddingRight,
          l = s.paddingTop + s.paddingBottom,
          a = s.marginLeft + s.marginRight,
          c = s.marginTop + s.marginBottom,
          h = s.borderLeftWidth + s.borderRightWidth,
          d = s.borderTopWidth + s.borderBottomWidth,
          u = t(n.width);
        !1 !== u && (s.width = u + (o ? 0 : r + h));
        let p = t(n.height);
        return (
          !1 !== p && (s.height = p + (o ? 0 : l + d)),
          (s.innerWidth = s.width - (r + h)),
          (s.innerHeight = s.height - (l + d)),
          (s.outerWidth = s.width + a),
          (s.outerHeight = s.height + c),
          s
        );
      };
    });
  })(b);
  var w = { exports: {} };
  !(function (t) {
    !(function (e, i) {
      t.exports ? (t.exports = i(e)) : (e.fizzyUIUtils = i(e));
    })(p, function (t) {
      let e = {
          extend: function (t, e) {
            return Object.assign(t, e);
          },
          modulo: function (t, e) {
            return ((t % e) + e) % e;
          },
          makeArray: function (t) {
            if (Array.isArray(t)) return t;
            if (null == t) return [];
            return "object" == typeof t && "number" == typeof t.length
              ? [...t]
              : [t];
          },
          removeFrom: function (t, e) {
            let i = t.indexOf(e);
            -1 != i && t.splice(i, 1);
          },
          getParent: function (t, e) {
            for (; t.parentNode && t != document.body; )
              if ((t = t.parentNode).matches(e)) return t;
          },
          getQueryElement: function (t) {
            return "string" == typeof t ? document.querySelector(t) : t;
          },
          handleEvent: function (t) {
            let e = "on" + t.type;
            this[e] && this[e](t);
          },
          filterFindElements: function (t, i) {
            return (t = e.makeArray(t))
              .filter((t) => t instanceof HTMLElement)
              .reduce((t, e) => {
                if (!i) return t.push(e), t;
                e.matches(i) && t.push(e);
                let n = e.querySelectorAll(i);
                return (t = t.concat(...n));
              }, []);
          },
          debounceMethod: function (t, e, i) {
            i = i || 100;
            let n = t.prototype[e],
              s = e + "Timeout";
            t.prototype[e] = function () {
              clearTimeout(this[s]);
              let t = arguments;
              this[s] = setTimeout(() => {
                n.apply(this, t), delete this[s];
              }, i);
            };
          },
          docReady: function (t) {
            let e = document.readyState;
            "complete" == e || "interactive" == e
              ? setTimeout(t)
              : document.addEventListener("DOMContentLoaded", t);
          },
          toDashed: function (t) {
            return t
              .replace(/(.)([A-Z])/g, function (t, e, i) {
                return e + "-" + i;
              })
              .toLowerCase();
          },
        },
        i = t.console;
      return (
        (e.htmlInit = function (n, s) {
          e.docReady(function () {
            let o = "data-" + e.toDashed(s),
              r = document.querySelectorAll(`[${o}]`),
              l = t.jQuery;
            [...r].forEach((t) => {
              let e,
                r = t.getAttribute(o);
              try {
                e = r && JSON.parse(r);
              } catch (e) {
                return void (
                  i && i.error(`Error parsing ${o} on ${t.className}: ${e}`)
                );
              }
              let a = new n(t, e);
              l && l.data(t, s, a);
            });
          });
        }),
        e
      );
    });
  })(w);
  var x = { exports: {} };
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(b.exports))
        : ((e.Flickity = e.Flickity || {}), (e.Flickity.Cell = i(e.getSize)));
    })("undefined" != typeof window ? window : p, function (t) {
      const e = "flickity-cell";
      function i(t) {
        (this.element = t),
          this.element.classList.add(e),
          (this.x = 0),
          this.unselect();
      }
      let n = i.prototype;
      return (
        (n.destroy = function () {
          this.unselect(),
            this.element.classList.remove(e),
            (this.element.style.transform = ""),
            this.element.removeAttribute("aria-hidden");
        }),
        (n.getSize = function () {
          this.size = t(this.element);
        }),
        (n.select = function () {
          this.element.classList.add("is-selected"),
            this.element.removeAttribute("aria-hidden");
        }),
        (n.unselect = function () {
          this.element.classList.remove("is-selected"),
            this.element.setAttribute("aria-hidden", "true");
        }),
        (n.remove = function () {
          this.element.remove();
        }),
        i
      );
    });
  })(x);
  var S = { exports: {} };
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i())
        : ((e.Flickity = e.Flickity || {}), (e.Flickity.Slide = i()));
    })("undefined" != typeof window ? window : p, function () {
      function t(t, e, i) {
        (this.beginMargin = t),
          (this.endMargin = e),
          (this.cellAlign = i),
          (this.cells = []),
          (this.outerWidth = 0),
          (this.height = 0);
      }
      let e = t.prototype;
      return (
        (e.addCell = function (t) {
          this.cells.push(t),
            (this.outerWidth += t.size.outerWidth),
            (this.height = Math.max(t.size.outerHeight, this.height)),
            1 === this.cells.length &&
              ((this.x = t.x), (this.firstMargin = t.size[this.beginMargin]));
        }),
        (e.updateTarget = function () {
          let t = this.getLastCell(),
            e = t ? t.size[this.endMargin] : 0,
            i = this.outerWidth - (this.firstMargin + e);
          this.target = this.x + this.firstMargin + i * this.cellAlign;
        }),
        (e.getLastCell = function () {
          return this.cells[this.cells.length - 1];
        }),
        (e.select = function () {
          this.cells.forEach((t) => t.select());
        }),
        (e.unselect = function () {
          this.cells.forEach((t) => t.unselect());
        }),
        (e.getCellElements = function () {
          return this.cells.map((t) => t.element);
        }),
        t
      );
    });
  })(S);
  var E = { exports: {} };
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(w.exports))
        : ((e.Flickity = e.Flickity || {}),
          (e.Flickity.animatePrototype = i(e.fizzyUIUtils)));
    })("undefined" != typeof window ? window : p, function (t) {
      let e = {
        startAnimation: function () {
          this.isAnimating ||
            ((this.isAnimating = !0), (this.restingFrames = 0), this.animate());
        },
        animate: function () {
          this.applyDragForce(), this.applySelectedAttraction();
          let t = this.x;
          this.integratePhysics(),
            this.positionSlider(),
            this.settle(t),
            this.isAnimating && requestAnimationFrame(() => this.animate());
        },
        positionSlider: function () {
          let e = this.x;
          this.isWrapping &&
            ((e = t.modulo(e, this.slideableWidth) - this.slideableWidth),
            this.shiftWrapCells(e)),
            this.setTranslateX(e, this.isAnimating),
            this.dispatchScrollEvent();
        },
        setTranslateX: function (t, e) {
          (t += this.cursorPosition), this.options.rightToLeft && (t = -t);
          let i = this.getPositionValue(t);
          this.slider.style.transform = e
            ? `translate3d(${i},0,0)`
            : `translateX(${i})`;
        },
        dispatchScrollEvent: function () {
          let t = this.slides[0];
          if (!t) return;
          let e = -this.x - t.target,
            i = e / this.slidesWidth;
          this.dispatchEvent("scroll", null, [i, e]);
        },
        positionSliderAtSelected: function () {
          this.cells.length &&
            ((this.x = -this.selectedSlide.target),
            (this.velocity = 0),
            this.positionSlider());
        },
        getPositionValue: function (t) {
          return this.options.percentPosition
            ? 0.01 * Math.round((t / this.size.innerWidth) * 1e4) + "%"
            : Math.round(t) + "px";
        },
        settle: function (t) {
          !this.isPointerDown &&
            Math.round(100 * this.x) === Math.round(100 * t) &&
            this.restingFrames++,
            this.restingFrames > 2 &&
              ((this.isAnimating = !1),
              delete this.isFreeScrolling,
              this.positionSlider(),
              this.dispatchEvent("settle", null, [this.selectedIndex]));
        },
        shiftWrapCells: function (t) {
          let e = this.cursorPosition + t;
          this._shiftCells(this.beforeShiftCells, e, -1);
          let i =
            this.size.innerWidth -
            (t + this.slideableWidth + this.cursorPosition);
          this._shiftCells(this.afterShiftCells, i, 1);
        },
        _shiftCells: function (t, e, i) {
          t.forEach((t) => {
            let n = e > 0 ? i : 0;
            this._wrapShiftCell(t, n), (e -= t.size.outerWidth);
          });
        },
        _unshiftCells: function (t) {
          t && t.length && t.forEach((t) => this._wrapShiftCell(t, 0));
        },
        _wrapShiftCell: function (t, e) {
          this._renderCellPosition(t, t.x + this.slideableWidth * e);
        },
        integratePhysics: function () {
          (this.x += this.velocity),
            (this.velocity *= this.getFrictionFactor());
        },
        applyForce: function (t) {
          this.velocity += t;
        },
        getFrictionFactor: function () {
          return (
            1 -
            this.options[
              this.isFreeScrolling ? "freeScrollFriction" : "friction"
            ]
          );
        },
        getRestingPosition: function () {
          return this.x + this.velocity / (1 - this.getFrictionFactor());
        },
        applyDragForce: function () {
          if (!this.isDraggable || !this.isPointerDown) return;
          let t = this.dragX - this.x - this.velocity;
          this.applyForce(t);
        },
        applySelectedAttraction: function () {
          if (
            (this.isDraggable && this.isPointerDown) ||
            this.isFreeScrolling ||
            !this.slides.length
          )
            return;
          let t =
            (-1 * this.selectedSlide.target - this.x) *
            this.options.selectedAttraction;
          this.applyForce(t);
        },
      };
      return e;
    });
  })(E),
    (function (t) {
      !(function (e, i) {
        if (t.exports)
          t.exports = i(
            e,
            y.exports,
            b.exports,
            w.exports,
            x.exports,
            S.exports,
            E.exports
          );
        else {
          let t = e.Flickity;
          e.Flickity = i(
            e,
            e.EvEmitter,
            e.getSize,
            e.fizzyUIUtils,
            t.Cell,
            t.Slide,
            t.animatePrototype
          );
        }
      })(
        "undefined" != typeof window ? window : p,
        function (t, e, i, n, s, o, r) {
          const { getComputedStyle: l, console: a } = t;
          let { jQuery: c } = t,
            h = 0,
            d = {};
          function u(t, e) {
            let i = n.getQueryElement(t);
            if (i) {
              if (((this.element = i), this.element.flickityGUID)) {
                let t = d[this.element.flickityGUID];
                return t && t.option(e), t;
              }
              c && (this.$element = c(this.element)),
                (this.options = { ...this.constructor.defaults }),
                this.option(e),
                this._create();
            } else a && a.error(`Bad element for Flickity: ${i || t}`);
          }
          (u.defaults = {
            accessibility: !0,
            cellAlign: "center",
            freeScrollFriction: 0.075,
            friction: 0.28,
            namespaceJQueryEvents: !0,
            percentPosition: !0,
            resize: !0,
            selectedAttraction: 0.025,
            setGallerySize: !0,
          }),
            (u.create = {});
          let p = u.prototype;
          Object.assign(p, e.prototype),
            (p._create = function () {
              let { resize: e, watchCSS: i, rightToLeft: n } = this.options,
                s = (this.guid = ++h);
              (this.element.flickityGUID = s),
                (d[s] = this),
                (this.selectedIndex = 0),
                (this.restingFrames = 0),
                (this.x = 0),
                (this.velocity = 0),
                (this.beginMargin = n ? "marginRight" : "marginLeft"),
                (this.endMargin = n ? "marginLeft" : "marginRight"),
                (this.viewport = document.createElement("div")),
                (this.viewport.className = "flickity-viewport"),
                this._createSlider(),
                (this.focusableElems = [this.element]),
                (e || i) && t.addEventListener("resize", this);
              for (let t in this.options.on) {
                let e = this.options.on[t];
                this.on(t, e);
              }
              for (let t in u.create) u.create[t].call(this);
              i ? this.watchCSS() : this.activate();
            }),
            (p.option = function (t) {
              Object.assign(this.options, t);
            }),
            (p.activate = function () {
              if (this.isActive) return;
              (this.isActive = !0),
                this.element.classList.add("flickity-enabled"),
                this.options.rightToLeft &&
                  this.element.classList.add("flickity-rtl"),
                this.getSize();
              let t = this._filterFindCellElements(this.element.children);
              this.slider.append(...t),
                this.viewport.append(this.slider),
                this.element.append(this.viewport),
                this.reloadCells(),
                this.options.accessibility &&
                  ((this.element.tabIndex = 0),
                  this.element.addEventListener("keydown", this)),
                this.emitEvent("activate"),
                this.selectInitialIndex(),
                (this.isInitActivated = !0),
                this.dispatchEvent("ready");
            }),
            (p._createSlider = function () {
              let t = document.createElement("div");
              (t.className = "flickity-slider"), (this.slider = t);
            }),
            (p._filterFindCellElements = function (t) {
              return n.filterFindElements(t, this.options.cellSelector);
            }),
            (p.reloadCells = function () {
              (this.cells = this._makeCells(this.slider.children)),
                this.positionCells(),
                this._updateWrapShiftCells(),
                this.setGallerySize();
 
            }),
            (p._makeCells = function (t) {
              return this._filterFindCellElements(t).map((t) => new s(t));
            }),
            (p.getLastCell = function () {
              return this.cells[this.cells.length - 1];
            }),
            (p.getLastSlide = function () {
              return this.slides[this.slides.length - 1];
            }),
            (p.positionCells = function () {
              this._sizeCells(this.cells), this._positionCells(0);
            }),
            (p._positionCells = function (t) {
              (t = t || 0),
                (this.maxCellHeight = (t && this.maxCellHeight) || 0);
              let e = 0;
              if (t > 0) {
                let i = this.cells[t - 1];
                e = i.x + i.size.outerWidth;
              }
              this.cells.slice(t).forEach((t) => {
                (t.x = e),
                  this._renderCellPosition(t, e),
                  (e += t.size.outerWidth),
                  (this.maxCellHeight = Math.max(
                    t.size.outerHeight,
                    this.maxCellHeight
                  ));
              }),
                (this.slideableWidth = e),
                this.updateSlides(),
                this._containSlides(),
                (this.slidesWidth = this.cells.length
                  ? this.getLastSlide().target - this.slides[0].target
                  : 0);
            }),
            (p._renderCellPosition = function (t, e) {
              let i = e * (this.options.rightToLeft ? -1 : 1);
              this.options.percentPosition &&
                (i *= this.size.innerWidth / t.size.width);
              let n = this.getPositionValue(i);
              t.element.style.transform = `translateX( ${n} )`;
            }),
            (p._sizeCells = function (t) {
              t.forEach((t) => t.getSize());
            }),
            (p.updateSlides = function () {
              if (((this.slides = []), !this.cells.length)) return;
              let { beginMargin: t, endMargin: e } = this,
                i = new o(t, e, this.cellAlign);
              this.slides.push(i);
              let n = this._getCanCellFit();
              this.cells.forEach((s, r) => {
                if (!i.cells.length) return void i.addCell(s);
                let l =
                  i.outerWidth -
                  i.firstMargin +
                  (s.size.outerWidth - s.size[e]);
                n(r, l) ||
                  (i.updateTarget(),
                  (i = new o(t, e, this.cellAlign)),
                  this.slides.push(i)),
                  i.addCell(s);
              }),
                i.updateTarget(),
                this.updateSelectedSlide();
            }),
            (p._getCanCellFit = function () {
              let { groupCells: t } = this.options;
              if (!t) return () => !1;
              if ("number" == typeof t) {
                let e = parseInt(t, 10);
                return (t) => t % e != 0;
              }
              let e = 1,
                i = "string" == typeof t && t.match(/^(\d+)%$/);
              i && (e = parseInt(i[1], 10) / 100);
              let n = (this.size.innerWidth + 1) * e;
              return (t, e) => e <= n;
            }),
            (p._init = p.reposition =
              function () {
                this.positionCells(), this.positionSliderAtSelected();
              }),
            (p.getSize = function () {
              (this.size = i(this.element)),
                this.setCellAlign(),
                (this.cursorPosition = this.size.innerWidth * this.cellAlign);
            });
          let f = { left: 0, center: 0.5, right: 1 };
          (p.setCellAlign = function () {
            let { cellAlign: t, rightToLeft: e } = this.options,
              i = f[t];
            (this.cellAlign = void 0 !== i ? i : t),
              e && (this.cellAlign = 1 - this.cellAlign);
          }),
            (p.setGallerySize = function () {
                           console.log(this.maxCellHeight)
              
              if (!this.options.setGallerySize) return;
              let t =
                this.options.adaptiveHeight && this.selectedSlide
                  ? this.selectedSlide.height
                  : this.maxCellHeight;
              this.viewport.style.height = `${t}px`;
            }),
            (p._updateWrapShiftCells = function () {
              if (((this.isWrapping = this.getIsWrapping()), !this.isWrapping))
                return;
              this._unshiftCells(this.beforeShiftCells),
                this._unshiftCells(this.afterShiftCells);
              let t = this.cursorPosition,
                e = this.cells.length - 1;
              this.beforeShiftCells = this._getGapCells(t, e, -1);
              let i = this.size.innerWidth - this.cursorPosition;
              this.afterShiftCells = this._getGapCells(i, 0, 1);
            }),
            (p.getIsWrapping = function () {
              let { wrapAround: t } = this.options;
              if (!t || this.slides.length < 2) return !1;
              if ("fill" !== t) return !0;
              let e = this.slideableWidth - this.size.innerWidth;
              if (e > this.size.innerWidth) return !0;
              for (let t of this.cells) if (t.size.outerWidth > e) return !1;
              return !0;
            }),
            (p._getGapCells = function (t, e, i) {
              let n = [];
              for (; t > 0; ) {
                let s = this.cells[e];
                if (!s) break;
                n.push(s), (e += i), (t -= s.size.outerWidth);
              }
              return n;
            }),
            (p._containSlides = function () {
              if (
                !(this.options.contain && !this.isWrapping && this.cells.length)
              )
                return;
              let t =
                this.slideableWidth - this.getLastCell().size[this.endMargin];
              if (t < this.size.innerWidth)
                this.slides.forEach((e) => {
                  e.target = t * this.cellAlign;
                });
              else {
                let e =
                    this.cursorPosition + this.cells[0].size[this.beginMargin],
                  i = t - this.size.innerWidth * (1 - this.cellAlign);
                this.slides.forEach((t) => {
                  (t.target = Math.max(t.target, e)),
                    (t.target = Math.min(t.target, i));
                });
              }
            }),
            (p.dispatchEvent = function (t, e, i) {
              let n = e ? [e].concat(i) : i;
              if ((this.emitEvent(t, n), c && this.$element)) {
                let n = (t += this.options.namespaceJQueryEvents
                  ? ".flickity"
                  : "");
                if (e) {
                  let i = new c.Event(e);
                  (i.type = t), (n = i);
                }
                this.$element.trigger(n, i);
              }
            });
          const g = [
            "dragStart",
            "dragMove",
            "dragEnd",
            "pointerDown",
            "pointerMove",
            "pointerEnd",
            "staticClick",
          ];
          let m = p.emitEvent;
          (p.emitEvent = function (t, e) {
            if ("staticClick" === t) {
              let t = this.getParentCell(e[0].target),
                i = t && t.element,
                n = t && this.cells.indexOf(t);
              e = e.concat(i, n);
            }
            if ((m.call(this, t, e), !g.includes(t) || !c || !this.$element))
              return;
            t += this.options.namespaceJQueryEvents ? ".flickity" : "";
            let i = e.shift(0),
              n = new c.Event(i);
            (n.type = t), this.$element.trigger(n, e);
          }),
            (p.select = function (t, e, i) {
              if (!this.isActive) return;
              if (
                ((t = parseInt(t, 10)),
                this._wrapSelect(t),
                (this.isWrapping || e) && (t = n.modulo(t, this.slides.length)),
                !this.slides[t])
              )
                return;
              let s = this.selectedIndex;
              (this.selectedIndex = t),
                this.updateSelectedSlide(),
                i ? this.positionSliderAtSelected() : this.startAnimation(),
                this.options.adaptiveHeight && this.setGallerySize(),
                this.dispatchEvent("select", null, [t]),
                t !== s && this.dispatchEvent("change", null, [t]);
            }),
            (p._wrapSelect = function (t) {
              if (!this.isWrapping) return;
              const {
                selectedIndex: e,
                slideableWidth: i,
                slides: { length: s },
              } = this;
              if (!this.isDragSelect) {
                let i = n.modulo(t, s),
                  o = Math.abs(i - e),
                  r = Math.abs(i + s - e),
                  l = Math.abs(i - s - e);
                r < o ? (t += s) : l < o && (t -= s);
              }
              t < 0 ? (this.x -= i) : t >= s && (this.x += i);
            }),
            (p.previous = function (t, e) {
              this.select(this.selectedIndex - 1, t, e);
            }),
            (p.next = function (t, e) {
              this.select(this.selectedIndex + 1, t, e);
            }),
            (p.updateSelectedSlide = function () {
              let t = this.slides[this.selectedIndex];
              t &&
                (this.unselectSelectedSlide(),
                (this.selectedSlide = t),
                t.select(),
                (this.selectedCells = t.cells),
                (this.selectedElements = t.getCellElements()),
                (this.selectedCell = t.cells[0]),
                (this.selectedElement = this.selectedElements[0]));
            }),
            (p.unselectSelectedSlide = function () {
              this.selectedSlide && this.selectedSlide.unselect();
            }),
            (p.selectInitialIndex = function () {
              let t = this.options.initialIndex;
              if (this.isInitActivated)
                return void this.select(this.selectedIndex, !1, !0);
              if (t && "string" == typeof t) {
                if (this.queryCell(t)) return void this.selectCell(t, !1, !0);
              }
              let e = 0;
              t && this.slides[t] && (e = t), this.select(e, !1, !0);
            }),
            (p.selectCell = function (t, e, i) {
              let n = this.queryCell(t);
              if (!n) return;
              let s = this.getCellSlideIndex(n);
              this.select(s, e, i);
            }),
            (p.getCellSlideIndex = function (t) {
              let e = this.slides.find((e) => e.cells.includes(t));
              return this.slides.indexOf(e);
            }),
            (p.getCell = function (t) {
              for (let e of this.cells) if (e.element === t) return e;
            }),
            (p.getCells = function (t) {
              return (t = n.makeArray(t))
                .map((t) => this.getCell(t))
                .filter(Boolean);
            }),
            (p.getCellElements = function () {
              return this.cells.map((t) => t.element);
            }),
            (p.getParentCell = function (t) {
              let e = this.getCell(t);
              if (e) return e;
              let i = t.closest(".flickity-slider > *");
              return this.getCell(i);
            }),
            (p.getAdjacentCellElements = function (t, e) {
              if (!t) return this.selectedSlide.getCellElements();
              e = void 0 === e ? this.selectedIndex : e;
              let i = this.slides.length;
              if (1 + 2 * t >= i) return this.getCellElements();
              let s = [];
              for (let o = e - t; o <= e + t; o++) {
                let t = this.isWrapping ? n.modulo(o, i) : o,
                  e = this.slides[t];
                e && (s = s.concat(e.getCellElements()));
              }
              return s;
            }),
            (p.queryCell = function (t) {
              if ("number" == typeof t) return this.cells[t];
              return (
                "string" == typeof t &&
                  !t.match(/^[#.]?[\d/]/) &&
                  (t = this.element.querySelector(t)),
                this.getCell(t)
              );
            }),
            (p.uiChange = function () {
              this.emitEvent("uiChange");
            }),
            (p.onresize = function () {
              this.watchCSS(), this.resize();
            }),
            n.debounceMethod(u, "onresize", 150),
            (p.resize = function () {
              if (!this.isActive || this.isAnimating || this.isDragging) return;
              this.getSize(),
                this.isWrapping &&
                  (this.x = n.modulo(this.x, this.slideableWidth)),
                this.positionCells(),
                this._updateWrapShiftCells(),
                this.setGallerySize(),
                this.emitEvent("resize");
              let t = this.selectedElements && this.selectedElements[0];
              this.selectCell(t, !1, !0);
            }),
            (p.watchCSS = function () {
              if (!this.options.watchCSS) return;
              l(this.element, ":after").content.includes("flickity")
                ? this.activate()
                : this.deactivate();
            }),
            (p.onkeydown = function (t) {
              let { activeElement: e } = document,
                i = u.keyboardHandlers[t.key];
              this.options.accessibility &&
                e &&
                i &&
                this.focusableElems.some((t) => e === t) &&
                i.call(this);
            }),
            (u.keyboardHandlers = {
              ArrowLeft: function () {
                this.uiChange(),
                  this[this.options.rightToLeft ? "next" : "previous"]();
              },
              ArrowRight: function () {
                this.uiChange(),
                  this[this.options.rightToLeft ? "previous" : "next"]();
              },
            }),
            (p.focus = function () {
              this.element.focus({ preventScroll: !0 });
            }),
            (p.deactivate = function () {
              this.isActive &&
                (this.element.classList.remove("flickity-enabled"),
                this.element.classList.remove("flickity-rtl"),
                this.unselectSelectedSlide(),
                this.cells.forEach((t) => t.destroy()),
                this.viewport.remove(),
                this.element.append(...this.slider.children),
                this.options.accessibility &&
                  (this.element.removeAttribute("tabIndex"),
                  this.element.removeEventListener("keydown", this)),
                (this.isActive = !1),
                this.emitEvent("deactivate"));
            }),
            (p.destroy = function () {
              this.deactivate(),
                t.removeEventListener("resize", this),
                this.allOff(),
                this.emitEvent("destroy"),
                c && this.$element && c.removeData(this.element, "flickity"),
                delete this.element.flickityGUID,
                delete d[this.guid];
            }),
            Object.assign(p, r),
            (u.data = function (t) {
              if ((t = n.getQueryElement(t))) return d[t.flickityGUID];
            }),
            n.htmlInit(u, "flickity");
          let { jQueryBridget: v } = t;
          return (
            c && v && v("flickity", u, c),
            (u.setJQuery = function (t) {
              c = t;
            }),
            (u.Cell = s),
            (u.Slide = o),
            u
          );
        }
      );
    })(v);
  var C = { exports: {} };
  /*!
   * Unidragger v3.0.1
   * Draggable base class
   * MIT license
   */
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(e, y.exports))
        : (e.Unidragger = i(e, e.EvEmitter));
    })("undefined" != typeof window ? window : p, function (t, e) {
      function i() {}
      let n,
        s,
        o = (i.prototype = Object.create(e.prototype));
      (o.handleEvent = function (t) {
        let e = "on" + t.type;
        this[e] && this[e](t);
      }),
        "ontouchstart" in t
          ? ((n = "touchstart"), (s = ["touchmove", "touchend", "touchcancel"]))
          : t.PointerEvent
          ? ((n = "pointerdown"),
            (s = ["pointermove", "pointerup", "pointercancel"]))
          : ((n = "mousedown"), (s = ["mousemove", "mouseup"])),
        (o.touchActionValue = "none"),
        (o.bindHandles = function () {
          this._bindHandles("addEventListener", this.touchActionValue);
        }),
        (o.unbindHandles = function () {
          this._bindHandles("removeEventListener", "");
        }),
        (o._bindHandles = function (e, i) {
          this.handles.forEach((s) => {
            s[e](n, this),
              s[e]("click", this),
              t.PointerEvent && (s.style.touchAction = i);
          });
        }),
        (o.bindActivePointerEvents = function () {
          s.forEach((e) => {
            t.addEventListener(e, this);
          });
        }),
        (o.unbindActivePointerEvents = function () {
          s.forEach((e) => {
            t.removeEventListener(e, this);
          });
        }),
        (o.withPointer = function (t, e) {
          e.pointerId === this.pointerIdentifier && this[t](e, e);
        }),
        (o.withTouch = function (t, e) {
          let i;
          for (let t of e.changedTouches)
            t.identifier === this.pointerIdentifier && (i = t);
          i && this[t](e, i);
        }),
        (o.onmousedown = function (t) {
          this.pointerDown(t, t);
        }),
        (o.ontouchstart = function (t) {
          this.pointerDown(t, t.changedTouches[0]);
        }),
        (o.onpointerdown = function (t) {
          this.pointerDown(t, t);
        });
      const r = ["TEXTAREA", "INPUT", "SELECT", "OPTION"],
        l = ["radio", "checkbox", "button", "submit", "image", "file"];
      return (
        (o.pointerDown = function (t, e) {
          let i = r.includes(t.target.nodeName),
            n = l.includes(t.target.type),
            s = !i || n;
          !this.isPointerDown &&
            !t.button &&
            s &&
            ((this.isPointerDown = !0),
            (this.pointerIdentifier =
              void 0 !== e.pointerId ? e.pointerId : e.identifier),
            (this.pointerDownPointer = { pageX: e.pageX, pageY: e.pageY }),
            this.bindActivePointerEvents(),
            this.emitEvent("pointerDown", [t, e]));
        }),
        (o.onmousemove = function (t) {
          this.pointerMove(t, t);
        }),
        (o.onpointermove = function (t) {
          this.withPointer("pointerMove", t);
        }),
        (o.ontouchmove = function (t) {
          this.withTouch("pointerMove", t);
        }),
        (o.pointerMove = function (t, e) {
          let i = {
            x: e.pageX - this.pointerDownPointer.pageX,
            y: e.pageY - this.pointerDownPointer.pageY,
          };
          this.emitEvent("pointerMove", [t, e, i]),
            !this.isDragging && this.hasDragStarted(i) && this.dragStart(t, e),
            this.isDragging && this.dragMove(t, e, i);
        }),
        (o.hasDragStarted = function (t) {
          return Math.abs(t.x) > 3 || Math.abs(t.y) > 3;
        }),
        (o.dragStart = function (t, e) {
          (this.isDragging = !0),
            (this.isPreventingClicks = !0),
            this.emitEvent("dragStart", [t, e]);
        }),
        (o.dragMove = function (t, e, i) {
          this.emitEvent("dragMove", [t, e, i]);
        }),
        (o.onmouseup = function (t) {
          this.pointerUp(t, t);
        }),
        (o.onpointerup = function (t) {
          this.withPointer("pointerUp", t);
        }),
        (o.ontouchend = function (t) {
          this.withTouch("pointerUp", t);
        }),
        (o.pointerUp = function (t, e) {
          this.pointerDone(),
            this.emitEvent("pointerUp", [t, e]),
            this.isDragging ? this.dragEnd(t, e) : this.staticClick(t, e);
        }),
        (o.dragEnd = function (t, e) {
          (this.isDragging = !1),
            setTimeout(() => delete this.isPreventingClicks),
            this.emitEvent("dragEnd", [t, e]);
        }),
        (o.pointerDone = function () {
          (this.isPointerDown = !1),
            delete this.pointerIdentifier,
            this.unbindActivePointerEvents(),
            this.emitEvent("pointerDone");
        }),
        (o.onpointercancel = function (t) {
          this.withPointer("pointerCancel", t);
        }),
        (o.ontouchcancel = function (t) {
          this.withTouch("pointerCancel", t);
        }),
        (o.pointerCancel = function (t, e) {
          this.pointerDone(), this.emitEvent("pointerCancel", [t, e]);
        }),
        (o.onclick = function (t) {
          this.isPreventingClicks && t.preventDefault();
        }),
        (o.staticClick = function (t, e) {
          let i = "mouseup" === t.type;
          (i && this.isIgnoringMouseUp) ||
            (this.emitEvent("staticClick", [t, e]),
            i &&
              ((this.isIgnoringMouseUp = !0),
              setTimeout(() => {
                delete this.isIgnoringMouseUp;
              }, 400)));
        }),
        i
      );
    });
  })(C),
    (function (t) {
      !(function (e, i) {
        t.exports
          ? (t.exports = i(e, v.exports, C.exports, w.exports))
          : (e.Flickity = i(e, e.Flickity, e.Unidragger, e.fizzyUIUtils));
      })("undefined" != typeof window ? window : p, function (t, e, i, n) {
        Object.assign(e.defaults, { draggable: ">1", dragThreshold: 3 });
        let s = e.prototype;
        function o() {
          return { x: t.pageXOffset, y: t.pageYOffset };
        }
        return (
          Object.assign(s, i.prototype),
          (s.touchActionValue = ""),
          (e.create.drag = function () {
            this.on("activate", this.onActivateDrag),
              this.on("uiChange", this._uiChangeDrag),
              this.on("deactivate", this.onDeactivateDrag),
              this.on("cellChange", this.updateDraggable),
              this.on("pointerDown", this.handlePointerDown),
              this.on("pointerUp", this.handlePointerUp),
              this.on("pointerDown", this.handlePointerDone),
              this.on("dragStart", this.handleDragStart),
              this.on("dragMove", this.handleDragMove),
              this.on("dragEnd", this.handleDragEnd),
              this.on("staticClick", this.handleStaticClick);
          }),
          (s.onActivateDrag = function () {
            (this.handles = [this.viewport]),
              this.bindHandles(),
              this.updateDraggable();
          }),
          (s.onDeactivateDrag = function () {
            this.unbindHandles(), this.element.classList.remove("is-draggable");
          }),
          (s.updateDraggable = function () {
            ">1" === this.options.draggable
              ? (this.isDraggable = this.slides.length > 1)
              : (this.isDraggable = this.options.draggable),
              this.element.classList.toggle("is-draggable", this.isDraggable);
          }),
          (s._uiChangeDrag = function () {
            delete this.isFreeScrolling;
          }),
          (s.handlePointerDown = function (e) {
            if (!this.isDraggable) return void this.bindActivePointerEvents(e);
            let i = "touchstart" === e.type,
              n = "touch" === e.pointerType,
              s = e.target.matches("input, textarea, select");
            i || n || s || e.preventDefault(),
              s || this.focus(),
              document.activeElement !== this.element &&
                document.activeElement.blur(),
              (this.dragX = this.x),
              this.viewport.classList.add("is-pointer-down"),
              (this.pointerDownScroll = o()),
              t.addEventListener("scroll", this),
              this.bindActivePointerEvents(e);
          }),
          (s.hasDragStarted = function (t) {
            return Math.abs(t.x) > this.options.dragThreshold;
          }),
          (s.handlePointerUp = function () {
            delete this.isTouchScrolling,
              this.viewport.classList.remove("is-pointer-down");
          }),
          (s.handlePointerDone = function () {
            t.removeEventListener("scroll", this),
              delete this.pointerDownScroll;
          }),
          (s.handleDragStart = function () {
            this.isDraggable &&
              ((this.dragStartPosition = this.x),
              this.startAnimation(),
              t.removeEventListener("scroll", this));
          }),
          (s.handleDragMove = function (t, e, i) {
            if (!this.isDraggable) return;
            t.preventDefault(), (this.previousDragX = this.dragX);
            let n = this.options.rightToLeft ? -1 : 1;
            this.isWrapping && (i.x %= this.slideableWidth);
            let s = this.dragStartPosition + i.x * n;
            if (!this.isWrapping) {
              let t = Math.max(-this.slides[0].target, this.dragStartPosition);
              s = s > t ? 0.5 * (s + t) : s;
              let e = Math.min(
                -this.getLastSlide().target,
                this.dragStartPosition
              );
              s = s < e ? 0.5 * (s + e) : s;
            }
            (this.dragX = s), (this.dragMoveTime = new Date());
          }),
          (s.handleDragEnd = function () {
            if (!this.isDraggable) return;
            let { freeScroll: t } = this.options;
            t && (this.isFreeScrolling = !0);
            let e = this.dragEndRestingSelect();
            if (t && !this.isWrapping) {
              let t = this.getRestingPosition();
              this.isFreeScrolling =
                -t > this.slides[0].target && -t < this.getLastSlide().target;
            } else
              t || e !== this.selectedIndex || (e += this.dragEndBoostSelect());
            delete this.previousDragX,
              (this.isDragSelect = this.isWrapping),
              this.select(e),
              delete this.isDragSelect;
          }),
          (s.dragEndRestingSelect = function () {
            let t = this.getRestingPosition(),
              e = Math.abs(this.getSlideDistance(-t, this.selectedIndex)),
              i = this._getClosestResting(t, e, 1),
              n = this._getClosestResting(t, e, -1);
            return i.distance < n.distance ? i.index : n.index;
          }),
          (s._getClosestResting = function (t, e, i) {
            let n = this.selectedIndex,
              s = 1 / 0,
              o =
                this.options.contain && !this.isWrapping
                  ? (t, e) => t <= e
                  : (t, e) => t < e;
            for (
              ;
              o(e, s) &&
              ((n += i), (s = e), null !== (e = this.getSlideDistance(-t, n)));

            )
              e = Math.abs(e);
            return { distance: s, index: n - i };
          }),
          (s.getSlideDistance = function (t, e) {
            let i = this.slides.length,
              s = this.options.wrapAround && i > 1,
              o = s ? n.modulo(e, i) : e,
              r = this.slides[o];
            if (!r) return null;
            let l = s ? this.slideableWidth * Math.floor(e / i) : 0;
            return t - (r.target + l);
          }),
          (s.dragEndBoostSelect = function () {
            if (
              void 0 === this.previousDragX ||
              !this.dragMoveTime ||
              new Date() - this.dragMoveTime > 100
            )
              return 0;
            let t = this.getSlideDistance(-this.dragX, this.selectedIndex),
              e = this.previousDragX - this.dragX;
            return t > 0 && e > 0 ? 1 : t < 0 && e < 0 ? -1 : 0;
          }),
          (s.onscroll = function () {
            let t = o(),
              e = this.pointerDownScroll.x - t.x,
              i = this.pointerDownScroll.y - t.y;
            (Math.abs(e) > 3 || Math.abs(i) > 3) && this.pointerDone();
          }),
          e
        );
      });
    })({ exports: {} });
  !(function (t) {
    !(function (e, i) {
      t.exports ? (t.exports = i(v.exports)) : i(e.Flickity);
    })("undefined" != typeof window ? window : p, function (t) {
      const e = "http://www.w3.org/2000/svg";
      function i(t, e, i) {
        (this.increment = t),
          (this.direction = e),
          (this.isPrevious = "previous" === t),
          (this.isLeft = "left" === e),
          this._create(i);
      }
      (i.prototype._create = function (t) {
        let e = (this.element = document.createElement("button"));
        e.className = `flickity-button flickity-prev-next-button ${this.increment}`;
        let i = this.isPrevious ? "Previous" : "Next";
        e.setAttribute("type", "button"),
          e.setAttribute("aria-label", i),
          this.disable();
        let n = this.createSVG(i, t);
        e.append(n);
      }),
        (i.prototype.createSVG = function (t, i) {
          let n = document.createElementNS(e, "svg");
          n.setAttribute("class", "flickity-button-icon"),
            n.setAttribute("viewBox", "0 0 100 100");
          let s = document.createElementNS(e, "title");
          s.append(t);
          let o = document.createElementNS(e, "path"),
            r = (function (t) {
              if ("string" == typeof t) return t;
              let { x0: e, x1: i, x2: n, x3: s, y1: o, y2: r } = t;
              return `M ${e}, 50\n    L ${i}, ${o + 50}\n    L ${n}, ${
                r + 50
              }\n    L ${s}, 50\n    L ${n}, ${50 - r}\n    L ${i}, ${
                50 - o
              }\n    Z`;
            })(i);
          return (
            o.setAttribute("d", r),
            o.setAttribute("class", "arrow"),
            this.isLeft ||
              o.setAttribute("transform", "translate(100, 100) rotate(180)"),
            n.append(s, o),
            n
          );
        }),
        (i.prototype.enable = function () {
          this.element.removeAttribute("disabled");
        }),
        (i.prototype.disable = function () {
          this.element.setAttribute("disabled", !0);
        }),
        Object.assign(t.defaults, {
          prevNextButtons: !0,
          arrowShape: { x0: 10, x1: 60, y1: 50, x2: 70, y2: 40, x3: 30 },
        }),
        (t.create.prevNextButtons = function () {
          if (!this.options.prevNextButtons) return;
          let { rightToLeft: t, arrowShape: e } = this.options,
            n = t ? "right" : "left",
            s = t ? "left" : "right";
          (this.prevButton = new i("previous", n, e)),
            (this.nextButton = new i("next", s, e)),
            this.focusableElems.push(this.prevButton.element),
            this.focusableElems.push(this.nextButton.element),
            (this.handlePrevButtonClick = () => {
              this.uiChange(), this.previous();
            }),
            (this.handleNextButtonClick = () => {
              this.uiChange(), this.next();
            }),
            this.on("activate", this.activatePrevNextButtons),
            this.on("select", this.updatePrevNextButtons);
        });
      let n = t.prototype;
      return (
        (n.updatePrevNextButtons = function () {
          let t = this.slides.length ? this.slides.length - 1 : 0;
          this.updatePrevNextButton(this.prevButton, 0),
            this.updatePrevNextButton(this.nextButton, t);
        }),
        (n.updatePrevNextButton = function (t, e) {
          if (this.isWrapping && this.slides.length > 1) return void t.enable();
          let i = this.selectedIndex !== e;
          t[i ? "enable" : "disable"](),
            !i && document.activeElement === t.element && this.focus();
        }),
        (n.activatePrevNextButtons = function () {
          this.prevButton.element.addEventListener(
            "click",
            this.handlePrevButtonClick
          ),
            this.nextButton.element.addEventListener(
              "click",
              this.handleNextButtonClick
            ),
            this.element.append(
              this.prevButton.element,
              this.nextButton.element
            ),
            this.on("deactivate", this.deactivatePrevNextButtons);
        }),
        (n.deactivatePrevNextButtons = function () {
          this.prevButton.element.remove(),
            this.nextButton.element.remove(),
            this.prevButton.element.removeEventListener(
              "click",
              this.handlePrevButtonClick
            ),
            this.nextButton.element.removeEventListener(
              "click",
              this.handleNextButtonClick
            ),
            this.off("deactivate", this.deactivatePrevNextButtons);
        }),
        (t.PrevNextButton = i),
        t
      );
    });
  })({ exports: {} });
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(v.exports, w.exports))
        : i(e.Flickity, e.fizzyUIUtils);
    })("undefined" != typeof window ? window : p, function (t, e) {
      function i() {
        (this.holder = document.createElement("div")),
          (this.holder.className = "flickity-page-dots"),
          (this.dots = []);
      }
      (i.prototype.setDots = function (t) {
        let e = t - this.dots.length;
        e > 0 ? this.addDots(e) : e < 0 && this.removeDots(-e);
      }),
        (i.prototype.addDots = function (t) {
          let e = new Array(t).fill().map((t, e) => {
            let i = document.createElement("button");
            i.setAttribute("type", "button");
            let n = e + 1 + this.dots.length;
            return (
              (i.className = "flickity-page-dot"),
              (i.textContent = `View slide ${n}`),
              i
            );
          });
          this.holder.append(...e), (this.dots = this.dots.concat(e));
        }),
        (i.prototype.removeDots = function (t) {
          this.dots.splice(this.dots.length - t, t).forEach((t) => t.remove());
        }),
        (i.prototype.updateSelected = function (t) {
          this.selectedDot &&
            (this.selectedDot.classList.remove("is-selected"),
            this.selectedDot.removeAttribute("aria-current")),
            this.dots.length &&
              ((this.selectedDot = this.dots[t]),
              this.selectedDot.classList.add("is-selected"),
              this.selectedDot.setAttribute("aria-current", "step"));
        }),
        (t.PageDots = i),
        Object.assign(t.defaults, { pageDots: !0 }),
        (t.create.pageDots = function () {
          this.options.pageDots &&
            ((this.pageDots = new i()),
            (this.handlePageDotsClick = this.onPageDotsClick.bind(this)),
            this.on("activate", this.activatePageDots),
            this.on("select", this.updateSelectedPageDots),
            this.on("cellChange", this.updatePageDots),
            this.on("resize", this.updatePageDots),
            this.on("deactivate", this.deactivatePageDots));
        });
      let n = t.prototype;
      return (
        (n.activatePageDots = function () {
          this.pageDots.setDots(this.slides.length),
            this.focusableElems.push(...this.pageDots.dots),
            this.pageDots.holder.addEventListener(
              "click",
              this.handlePageDotsClick
            ),
            this.element.append(this.pageDots.holder);
        }),
        (n.onPageDotsClick = function (t) {
          let e = this.pageDots.dots.indexOf(t.target);
          -1 !== e && (this.uiChange(), this.select(e));
        }),
        (n.updateSelectedPageDots = function () {
          this.pageDots.updateSelected(this.selectedIndex);
        }),
        (n.updatePageDots = function () {
          this.pageDots.dots.forEach((t) => {
            e.removeFrom(this.focusableElems, t);
          }),
            this.pageDots.setDots(this.slides.length),
            this.focusableElems.push(...this.pageDots.dots);
        }),
        (n.deactivatePageDots = function () {
          this.pageDots.holder.remove(),
            this.pageDots.holder.removeEventListener(
              "click",
              this.handlePageDotsClick
            );
        }),
        (t.PageDots = i),
        t
      );
    });
  })({ exports: {} });
  !(function (t) {
    !(function (e, i) {
      t.exports ? (t.exports = i(v.exports)) : i(e.Flickity);
    })("undefined" != typeof window ? window : p, function (t) {
      function e(t, e) {
        (this.autoPlay = t),
          (this.onTick = e),
          (this.state = "stopped"),
          (this.onVisibilityChange = this.visibilityChange.bind(this)),
          (this.onVisibilityPlay = this.visibilityPlay.bind(this));
      }
      (e.prototype.play = function () {
        if ("playing" === this.state) return;
        document.hidden
          ? document.addEventListener("visibilitychange", this.onVisibilityPlay)
          : ((this.state = "playing"),
            document.addEventListener(
              "visibilitychange",
              this.onVisibilityChange
            ),
            this.tick());
      }),
        (e.prototype.tick = function () {
          if ("playing" !== this.state) return;
          let t = "number" == typeof this.autoPlay ? this.autoPlay : 3e3;
          this.clear(),
            (this.timeout = setTimeout(() => {
              this.onTick(), this.tick();
            }, t));
        }),
        (e.prototype.stop = function () {
          (this.state = "stopped"),
            this.clear(),
            document.removeEventListener(
              "visibilitychange",
              this.onVisibilityChange
            );
        }),
        (e.prototype.clear = function () {
          clearTimeout(this.timeout);
        }),
        (e.prototype.pause = function () {
          "playing" === this.state && ((this.state = "paused"), this.clear());
        }),
        (e.prototype.unpause = function () {
          "paused" === this.state && this.play();
        }),
        (e.prototype.visibilityChange = function () {
          this[document.hidden ? "pause" : "unpause"]();
        }),
        (e.prototype.visibilityPlay = function () {
          this.play(),
            document.removeEventListener(
              "visibilitychange",
              this.onVisibilityPlay
            );
        }),
        Object.assign(t.defaults, { pauseAutoPlayOnHover: !0 }),
        (t.create.player = function () {
          (this.player = new e(this.options.autoPlay, () => {
            this.next(!0);
          })),
            this.on("activate", this.activatePlayer),
            this.on("uiChange", this.stopPlayer),
            this.on("pointerDown", this.stopPlayer),
            this.on("deactivate", this.deactivatePlayer);
        });
      let i = t.prototype;
      return (
        (i.activatePlayer = function () {
          this.options.autoPlay &&
            (this.player.play(),
            this.element.addEventListener("mouseenter", this));
        }),
        (i.playPlayer = function () {
          this.player.play();
        }),
        (i.stopPlayer = function () {
          this.player.stop();
        }),
        (i.pausePlayer = function () {
          this.player.pause();
        }),
        (i.unpausePlayer = function () {
          this.player.unpause();
        }),
        (i.deactivatePlayer = function () {
          this.player.stop(),
            this.element.removeEventListener("mouseenter", this);
        }),
        (i.onmouseenter = function () {
          this.options.pauseAutoPlayOnHover &&
            (this.player.pause(),
            this.element.addEventListener("mouseleave", this));
        }),
        (i.onmouseleave = function () {
          this.player.unpause(),
            this.element.removeEventListener("mouseleave", this);
        }),
        (t.Player = e),
        t
      );
    });
  })({ exports: {} });
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(v.exports, w.exports))
        : i(e.Flickity, e.fizzyUIUtils);
    })("undefined" != typeof window ? window : p, function (t, e) {
      let i = t.prototype;
      return (
        (i.insert = function (t, e) {
          let i = this._makeCells(t);
          if (!i || !i.length) return;
          let n = this.cells.length;
          e = void 0 === e ? n : e;
          let s = (function (t) {
              let e = document.createDocumentFragment();
              return t.forEach((t) => e.appendChild(t.element)), e;
            })(i),
            o = e === n;
          if (o) this.slider.appendChild(s);
          else {
            let t = this.cells[e].element;
            this.slider.insertBefore(s, t);
          }
          if (0 === e) this.cells = i.concat(this.cells);
          else if (o) this.cells = this.cells.concat(i);
          else {
            let t = this.cells.splice(e, n - e);
            this.cells = this.cells.concat(i).concat(t);
          }
          this._sizeCells(i),
            this.cellChange(e),
            this.positionSliderAtSelected();
        }),
        (i.append = function (t) {
          this.insert(t, this.cells.length);
        }),
        (i.prepend = function (t) {
          this.insert(t, 0);
        }),
        (i.remove = function (t) {
          let i = this.getCells(t);
          if (!i || !i.length) return;
          let n = this.cells.length - 1;
          i.forEach((t) => {
            t.remove();
            let i = this.cells.indexOf(t);
            (n = Math.min(i, n)), e.removeFrom(this.cells, t);
          }),
            this.cellChange(n),
            this.positionSliderAtSelected();
        }),
        (i.cellSizeChange = function (t) {
          let e = this.getCell(t);
          if (!e) return;
          e.getSize();
          let i = this.cells.indexOf(e);
          this.cellChange(i);
        }),
        (i.cellChange = function (t) {
          let e = this.selectedElement;
          this._positionCells(t),
            this._updateWrapShiftCells(),
            this.setGallerySize();
          let i = this.getCell(e);
          i && (this.selectedIndex = this.getCellSlideIndex(i)),
            (this.selectedIndex = Math.min(
              this.slides.length - 1,
              this.selectedIndex
            )),
            this.emitEvent("cellChange", [t]),
            this.select(this.selectedIndex);
        }),
        t
      );
    });
  })({ exports: {} });
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(v.exports, w.exports))
        : i(e.Flickity, e.fizzyUIUtils);
    })("undefined" != typeof window ? window : p, function (t, e) {
      const i = "data-flickity-lazyload",
        n = `${i}-src`,
        s = `${i}-srcset`,
        o = `img[${i}], img[${n}], img[${s}], source[${s}]`;
      t.create.lazyLoad = function () {
        this.on("select", this.lazyLoad),
          (this.handleLazyLoadComplete = this.onLazyLoadComplete.bind(this));
      };
      let r = t.prototype;
      function l(t) {
        if (t.matches("img")) {
          let e = t.getAttribute(i),
            o = t.getAttribute(n),
            r = t.getAttribute(s);
          if (e || o || r) return t;
        }
        return [...t.querySelectorAll(o)];
      }
      function a(t, e) {
        (this.img = t), (this.onComplete = e), this.load();
      }
      return (
        (r.lazyLoad = function () {
          let { lazyLoad: t } = this.options;
          if (!t) return;
          let e = "number" == typeof t ? t : 0;
          this.getAdjacentCellElements(e)
            .map(l)
            .flat()
            .forEach((t) => new a(t, this.handleLazyLoadComplete));
        }),
        (r.onLazyLoadComplete = function (t, e) {
          let i = this.getParentCell(t),
            n = i && i.element;
          this.cellSizeChange(n), this.dispatchEvent("lazyLoad", e, n);
        }),
        (a.prototype.handleEvent = e.handleEvent),
        (a.prototype.load = function () {
          this.img.addEventListener("load", this),
            this.img.addEventListener("error", this);
          let t = this.img.getAttribute(i) || this.img.getAttribute(n),
            e = this.img.getAttribute(s);
          (this.img.src = t),
            e && this.img.setAttribute("srcset", e),
            this.img.removeAttribute(i),
            this.img.removeAttribute(n),
            this.img.removeAttribute(s);
        }),
        (a.prototype.onload = function (t) {
          this.complete(t, "flickity-lazyloaded");
        }),
        (a.prototype.onerror = function (t) {
          this.complete(t, "flickity-lazyerror");
        }),
        (a.prototype.complete = function (t, e) {
          this.img.removeEventListener("load", this),
            this.img.removeEventListener("error", this),
            (this.img.parentNode.matches("picture")
              ? this.img.parentNode
              : this.img
            ).classList.add(e),
            this.onComplete(this.img, t);
        }),
        (t.LazyLoader = a),
        t
      );
    });
  })({ exports: {} });
  var k = { exports: {} };
  /*!
   * imagesLoaded v5.0.0
   * JavaScript is all like "You images are done yet or what?"
   * MIT License
   */
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(e, y.exports))
        : (e.imagesLoaded = i(e, e.EvEmitter));
    })("undefined" != typeof window ? window : p, function (t, e) {
      let i = t.jQuery,
        n = t.console;
      function s(t, e, o) {
        if (!(this instanceof s)) return new s(t, e, o);
        let r = t;
        var l;
        ("string" == typeof t && (r = document.querySelectorAll(t)), r)
          ? ((this.elements =
              ((l = r),
              Array.isArray(l)
                ? l
                : "object" == typeof l && "number" == typeof l.length
                ? [...l]
                : [l])),
            (this.options = {}),
            "function" == typeof e ? (o = e) : Object.assign(this.options, e),
            o && this.on("always", o),
            this.getImages(),
            i && (this.jqDeferred = new i.Deferred()),
            setTimeout(this.check.bind(this)))
          : n.error(`Bad element for imagesLoaded ${r || t}`);
      }
      (s.prototype = Object.create(e.prototype)),
        (s.prototype.getImages = function () {
          (this.images = []),
            this.elements.forEach(this.addElementImages, this);
        });
      const o = [1, 9, 11];
      s.prototype.addElementImages = function (t) {
        "IMG" === t.nodeName && this.addImage(t),
          !0 === this.options.background && this.addElementBackgroundImages(t);
        let { nodeType: e } = t;
        if (!e || !o.includes(e)) return;
        let i = t.querySelectorAll("img");
        for (let t of i) this.addImage(t);
        if ("string" == typeof this.options.background) {
          let e = t.querySelectorAll(this.options.background);
          for (let t of e) this.addElementBackgroundImages(t);
        }
      };
      const r = /url\((['"])?(.*?)\1\)/gi;
      function l(t) {
        this.img = t;
      }
      function a(t, e) {
        (this.url = t), (this.element = e), (this.img = new Image());
      }
      return (
        (s.prototype.addElementBackgroundImages = function (t) {
          let e = getComputedStyle(t);
          if (!e) return;
          let i = r.exec(e.backgroundImage);
          for (; null !== i; ) {
            let n = i && i[2];
            n && this.addBackground(n, t), (i = r.exec(e.backgroundImage));
          }
        }),
        (s.prototype.addImage = function (t) {
          let e = new l(t);
          this.images.push(e);
        }),
        (s.prototype.addBackground = function (t, e) {
          let i = new a(t, e);
          this.images.push(i);
        }),
        (s.prototype.check = function () {
          if (
            ((this.progressedCount = 0),
            (this.hasAnyBroken = !1),
            !this.images.length)
          )
            return void this.complete();
          let t = (t, e, i) => {
            setTimeout(() => {
              this.progress(t, e, i);
            });
          };
          this.images.forEach(function (e) {
            e.once("progress", t), e.check();
          });
        }),
        (s.prototype.progress = function (t, e, i) {
          this.progressedCount++,
            (this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
            this.emitEvent("progress", [this, t, e]),
            this.jqDeferred &&
              this.jqDeferred.notify &&
              this.jqDeferred.notify(this, t),
            this.progressedCount === this.images.length && this.complete(),
            this.options.debug && n && n.log(`progress: ${i}`, t, e);
        }),
        (s.prototype.complete = function () {
          let t = this.hasAnyBroken ? "fail" : "done";
          if (
            ((this.isComplete = !0),
            this.emitEvent(t, [this]),
            this.emitEvent("always", [this]),
            this.jqDeferred)
          ) {
            let t = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[t](this);
          }
        }),
        (l.prototype = Object.create(e.prototype)),
        (l.prototype.check = function () {
          this.getIsImageComplete()
            ? this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
            : ((this.proxyImage = new Image()),
              this.img.crossOrigin &&
                (this.proxyImage.crossOrigin = this.img.crossOrigin),
              this.proxyImage.addEventListener("load", this),
              this.proxyImage.addEventListener("error", this),
              this.img.addEventListener("load", this),
              this.img.addEventListener("error", this),
              (this.proxyImage.src = this.img.currentSrc || this.img.src));
        }),
        (l.prototype.getIsImageComplete = function () {
          return this.img.complete && this.img.naturalWidth;
        }),
        (l.prototype.confirm = function (t, e) {
          this.isLoaded = t;
          let { parentNode: i } = this.img,
            n = "PICTURE" === i.nodeName ? i : this.img;
          this.emitEvent("progress", [this, n, e]);
        }),
        (l.prototype.handleEvent = function (t) {
          let e = "on" + t.type;
          this[e] && this[e](t);
        }),
        (l.prototype.onload = function () {
          this.confirm(!0, "onload"), this.unbindEvents();
        }),
        (l.prototype.onerror = function () {
          this.confirm(!1, "onerror"), this.unbindEvents();
        }),
        (l.prototype.unbindEvents = function () {
          this.proxyImage.removeEventListener("load", this),
            this.proxyImage.removeEventListener("error", this),
            this.img.removeEventListener("load", this),
            this.img.removeEventListener("error", this);
        }),
        (a.prototype = Object.create(l.prototype)),
        (a.prototype.check = function () {
          this.img.addEventListener("load", this),
            this.img.addEventListener("error", this),
            (this.img.src = this.url),
            this.getIsImageComplete() &&
              (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
              this.unbindEvents());
        }),
        (a.prototype.unbindEvents = function () {
          this.img.removeEventListener("load", this),
            this.img.removeEventListener("error", this);
        }),
        (a.prototype.confirm = function (t, e) {
          (this.isLoaded = t),
            this.emitEvent("progress", [this, this.element, e]);
        }),
        (s.makeJQueryPlugin = function (e) {
          (e = e || t.jQuery) &&
            ((i = e),
            (i.fn.imagesLoaded = function (t, e) {
              return new s(this, t, e).jqDeferred.promise(i(this));
            }));
        }),
        s.makeJQueryPlugin(),
        s
      );
    });
  })(k),
    (function (t) {
      !(function (e, i) {
        t.exports
          ? (t.exports = i(v.exports, k.exports))
          : i(e.Flickity, e.imagesLoaded);
      })("undefined" != typeof window ? window : p, function (t, e) {
        return (
          (t.create.imagesLoaded = function () {
            this.on("activate", this.imagesLoaded);
          }),
          (t.prototype.imagesLoaded = function () {
            if (!this.options.imagesLoaded) return;
            e(this.slider).on("progress", (t, e) => {
              let i = this.getParentCell(e.img);
              this.cellSizeChange(i && i.element),
                this.options.freeScroll || this.positionSliderAtSelected();
            });
          }),
          t
        );
      });
    })({ exports: {} }),
    /*!
     * Flickity v3.0.0
     * Touch, responsive, flickable carousels
     *
     * Licensed GPLv3 for open source use
     * or Flickity Commercial License for commercial use
     *
     * https://flickity.metafizzy.co
     * Copyright 2015-2022 Metafizzy
     */
    (function (t) {
      if (t.exports) {
        const e = v.exports;
        t.exports = e;
      }
    })(m);
  var A = m.exports,
    L = { exports: {} };
  !(function (t) {
    !(function (e, i) {
      t.exports
        ? (t.exports = i(m.exports, w.exports))
        : i(e.Flickity, e.fizzyUIUtils);
    })("undefined" != typeof window ? window : p, function (t, e) {
      let i = t.Slide;
      (i.prototype.renderFadePosition = function () {}),
        (i.prototype.setOpacity = function (t) {
          this.cells.forEach((e) => {
            e.element.style.opacity = t;
          });
        }),
        (t.create.fade = function () {
          (this.fadeIndex = this.selectedIndex),
            (this.prevSelectedIndex = this.selectedIndex),
            this.on("select", this.onSelectFade),
            this.on("dragEnd", this.onDragEndFade),
            this.on("settle", this.onSettleFade),
            this.on("activate", this.onActivateFade),
            this.on("deactivate", this.onDeactivateFade);
        });
      let n = t.prototype,
        s = n.updateSlides;
      (n.updateSlides = function () {
        s.apply(this, arguments),
          this.options.fade &&
            this.slides.forEach((t, e) => {
              let i = t.target - t.x,
                n = t.cells[0].x;
              t.cells.forEach((t) => {
                let e = t.x - n - i;
                this._renderCellPosition(t, e);
              });
              let s = e === this.selectedIndex ? 1 : 0;
              t.setOpacity(s);
            });
      }),
        (n.onSelectFade = function () {
          (this.fadeIndex = Math.min(
            this.prevSelectedIndex,
            this.slides.length - 1
          )),
            (this.prevSelectedIndex = this.selectedIndex);
        }),
        (n.onSettleFade = function () {
          if ((delete this.didDragEnd, !this.options.fade)) return;
          this.selectedSlide.setOpacity(1),
            this.slides[this.fadeIndex] &&
              this.fadeIndex !== this.selectedIndex &&
              this.slides[this.fadeIndex].setOpacity(0);
        }),
        (n.onDragEndFade = function () {
          this.didDragEnd = !0;
        }),
        (n.onActivateFade = function () {
          this.options.fade && this.element.classList.add("is-fade");
        }),
        (n.onDeactivateFade = function () {
          this.options.fade &&
            (this.element.classList.remove("is-fade"),
            this.slides.forEach((t) => {
              t.setOpacity("");
            }));
        });
      let o = n.positionSlider;
      n.positionSlider = function () {
        this.options.fade
          ? (this.fadeSlides(), this.dispatchScrollEvent())
          : o.apply(this, arguments);
      };
      let r = n.positionSliderAtSelected;
      (n.positionSliderAtSelected = function () {
        this.options.fade && this.setTranslateX(0), r.apply(this, arguments);
      }),
        (n.fadeSlides = function () {
          if (this.slides.length < 2) return;
          let t = this.getFadeIndexes(),
            e = this.slides[t.a],
            i = this.slides[t.b],
            n = this.wrapDifference(e.target, i.target),
            s = this.wrapDifference(e.target, -this.x);
          (s /= n), e.setOpacity(1 - s), i.setOpacity(s);
          let o = t.a;
          this.isDragging && (o = s > 0.5 ? t.a : t.b),
            void 0 !== this.fadeHideIndex &&
              this.fadeHideIndex !== o &&
              this.fadeHideIndex !== t.a &&
              this.fadeHideIndex !== t.b &&
              this.slides[this.fadeHideIndex].setOpacity(0),
            (this.fadeHideIndex = o);
        }),
        (n.getFadeIndexes = function () {
          return this.isDragging || this.didDragEnd
            ? this.options.wrapAround
              ? this.getFadeDragWrapIndexes()
              : this.getFadeDragLimitIndexes()
            : { a: this.fadeIndex, b: this.selectedIndex };
        }),
        (n.getFadeDragWrapIndexes = function () {
          let t = this.slides.map(function (t, e) {
              return this.getSlideDistance(-this.x, e);
            }, this),
            i = t.map(function (t) {
              return Math.abs(t);
            }),
            n = Math.min(...i),
            s = i.indexOf(n),
            o = t[s],
            r = this.slides.length,
            l = o >= 0 ? 1 : -1;
          return { a: s, b: e.modulo(s + l, r) };
        }),
        (n.getFadeDragLimitIndexes = function () {
          let t = 0;
          for (let e = 0; e < this.slides.length - 1; e++) {
            let i = this.slides[e];
            if (-this.x < i.target) break;
            t = e;
          }
          return { a: t, b: t + 1 };
        }),
        (n.wrapDifference = function (t, e) {
          let i = e - t;
          if (!this.options.wrapAround) return i;
          let n = i + this.slideableWidth,
            s = i - this.slideableWidth;
          return (
            Math.abs(n) < Math.abs(i) && (i = n),
            Math.abs(s) < Math.abs(i) && (i = s),
            i
          );
        });
      let l = n._updateWrapShiftCells;
      n._updateWrapShiftCells = function () {
        this.options.fade
          ? (this.isWrapping = this.getIsWrapping())
          : l.apply(this, arguments);
      };
      let a = n.shiftWrapCells;
      return (
        (n.shiftWrapCells = function () {
          this.options.fade || a.apply(this, arguments);
        }),
        t
      );
    });
  })(L);
  var D = L.exports,
    P = { exports: {} };
  !(function (t) {
    var e, i;
    (e = "undefined" != typeof window ? window : p),
      (i = function () {
        var t = function (e, i) {
          var n = Object.create(t.prototype),
            s = 0,
            o = 0,
            r = 0,
            l = 0,
            a = [],
            c = !0,
            h =
              window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              function (t) {
                return setTimeout(t, 1e3 / 60);
              },
            d = null,
            u = !1;
          try {
            var p = Object.defineProperty({}, "passive", {
              get: function () {
                u = !0;
              },
            });
            window.addEventListener("testPassive", null, p),
              window.removeEventListener("testPassive", null, p);
          } catch (t) {}
          var f =
              window.cancelAnimationFrame ||
              window.mozCancelAnimationFrame ||
              clearTimeout,
            g =
              window.transformProp ||
              (function () {
                var t = document.createElement("div");
                if (null === t.style.transform) {
                  var e = ["Webkit", "Moz", "ms"];
                  for (var i in e)
                    if (void 0 !== t.style[e[i] + "Transform"])
                      return e[i] + "Transform";
                }
                return "transform";
              })();
          (n.options = {
            speed: -2,
            center: !1,
            wrapper: null,
            relativeToWrapper: !1,
            round: !0,
            vertical: !0,
            frame: null,
            horizontal: !1,
            callback: function () {},
          }),
            i &&
              Object.keys(i).forEach(function (t) {
                n.options[t] = i[t];
              }),
            e || (e = ".rellax");
          var m = "string" == typeof e ? document.querySelectorAll(e) : [e];
          if (m.length > 0) {
            if (
              ((n.elems = m), n.options.wrapper && !n.options.wrapper.nodeType)
            ) {
              var v = document.querySelector(n.options.wrapper);
              if (!v)
                return void console.warn(
                  "Rellax: The wrapper you're trying to use doesn't exist."
                );
              n.options.wrapper = v;
            }
            if (n.options.frame && !n.options.frame.nodeType) {
              var y = document.querySelector(n.options.frame);
              if (!y)
                return void console.warn(
                  "Rellax: The frame you're trying to use doesn't exist."
                );
              n.options.frame = y;
            }
            var b = function () {
                for (var t = 0; t < a.length; t++)
                  n.elems[t].style.cssText = a[t].style;
                (a = []),
                  (o = window.innerHeight),
                  (l = window.innerWidth),
                  x(),
                  (function () {
                    for (var t = 0; t < n.elems.length; t++) {
                      var e = w(n.elems[t]);
                      a.push(e);
                    }
                  })(),
                  k(),
                  c && (window.addEventListener("resize", b), (c = !1), C());
              },
              w = function (t) {
                var e = t.getAttribute("data-rellax-percentage"),
                  i = t.getAttribute("data-rellax-speed"),
                  s = t.getAttribute("data-rellax-zindex") || 0,
                  r = t.getAttribute("data-rellax-min"),
                  a = t.getAttribute("data-rellax-max"),
                  c = n.options.wrapper
                    ? n.options.wrapper.scrollTop
                    : window.pageYOffset ||
                      document.documentElement.scrollTop ||
                      document.body.scrollTop;
                n.options.relativeToWrapper &&
                  (c =
                    (window.pageYOffset ||
                      document.documentElement.scrollTop ||
                      document.body.scrollTop) - n.options.wrapper.offsetTop);
                var h = n.options.vertical && (e || n.options.center) ? c : 0,
                  d =
                    n.options.horizontal && (e || n.options.center)
                      ? n.options.wrapper
                        ? n.options.wrapper.scrollLeft
                        : window.pageXOffset ||
                          document.documentElement.scrollLeft ||
                          document.body.scrollLeft
                      : 0,
                  u = h + t.getBoundingClientRect().top,
                  p = t.clientHeight || t.offsetHeight || t.scrollHeight,
                  f = d + t.getBoundingClientRect().left,
                  g = t.clientWidth || t.offsetWidth || t.scrollWidth,
                  m = e || (h - u + o) / (p + o),
                  v = e || (d - f + l) / (g + l);
                n.options.center && ((v = 0.5), (m = 0.5));
                var y = i || n.options.speed;
                if (n.options.frame) {
                  var b = n.options.frame,
                    w =
                      p - (b.clientHeight || b.offsetHeight || b.scrollHeight);
                  (y = (w / 100) * -1), (r = (w / 2) * -1), (a = w / 2);
                }
                var x = S(v, m, y),
                  E = t.style.cssText,
                  C = "",
                  k = /transform\s*:/i.exec(E);
                if (k) {
                  var A = k.index,
                    L = E.slice(A),
                    D = L.indexOf(";");
                  C = D
                    ? " " + L.slice(11, D).replace(/\s/g, "")
                    : " " + L.slice(11).replace(/\s/g, "");
                }
                return {
                  baseX: x.x,
                  baseY: x.y,
                  top: u,
                  left: f,
                  height: p,
                  width: g,
                  speed: y,
                  style: E,
                  transform: C,
                  zindex: s,
                  min: r,
                  max: a,
                };
              },
              x = function () {
                var t = s,
                  e = r;
                if (
                  ((s = n.options.wrapper
                    ? n.options.wrapper.scrollTop
                    : (
                        document.documentElement ||
                        document.body.parentNode ||
                        document.body
                      ).scrollTop || window.pageYOffset),
                  (r = n.options.wrapper
                    ? n.options.wrapper.scrollLeft
                    : (
                        document.documentElement ||
                        document.body.parentNode ||
                        document.body
                      ).scrollLeft || window.pageXOffset),
                  n.options.relativeToWrapper)
                ) {
                  var i =
                    (
                      document.documentElement ||
                      document.body.parentNode ||
                      document.body
                    ).scrollTop || window.pageYOffset;
                  s = i - n.options.wrapper.offsetTop;
                }
                return (
                  !(t == s || !n.options.vertical) ||
                  !(e == r || !n.options.horizontal)
                );
              },
              S = function (t, e, i) {
                var s = {},
                  o = i * (100 * (1 - t)),
                  r = i * (100 * (1 - e));
                return (
                  (s.x = n.options.round
                    ? Math.round(o)
                    : Math.round(100 * o) / 100),
                  (s.y = n.options.round
                    ? Math.round(r)
                    : Math.round(100 * r) / 100),
                  s
                );
              },
              E = function () {
                window.removeEventListener("resize", E),
                  window.removeEventListener("orientationchange", E),
                  (n.options.wrapper
                    ? n.options.wrapper
                    : window
                  ).removeEventListener("scroll", E),
                  (n.options.wrapper
                    ? n.options.wrapper
                    : document
                  ).removeEventListener("touchmove", E),
                  (d = h(C));
              },
              C = function () {
                x() && !1 === c
                  ? (k(), (d = h(C)))
                  : ((d = null),
                    window.addEventListener("resize", E),
                    window.addEventListener("orientationchange", E),
                    (n.options.wrapper
                      ? n.options.wrapper
                      : window
                    ).addEventListener("scroll", E, !!u && { passive: !0 }),
                    (n.options.wrapper
                      ? n.options.wrapper
                      : document
                    ).addEventListener("touchmove", E, !!u && { passive: !0 }));
              },
              k = function () {
                for (var t, e = 0; e < n.elems.length; e++) {
                  var i = (s - a[e].top + o) / (a[e].height + o),
                    c = (r - a[e].left + l) / (a[e].width + l),
                    h = (t = S(c, i, a[e].speed)).y - a[e].baseY,
                    d = t.x - a[e].baseX;
                  null !== a[e].min &&
                    (n.options.vertical &&
                      !n.options.horizontal &&
                      (h = h <= a[e].min ? a[e].min : h),
                    n.options.horizontal &&
                      !n.options.vertical &&
                      (d = d <= a[e].min ? a[e].min : d)),
                    null !== a[e].max &&
                      (n.options.vertical &&
                        !n.options.horizontal &&
                        (h = h >= a[e].max ? a[e].max : h),
                      n.options.horizontal &&
                        !n.options.vertical &&
                        (d = d >= a[e].max ? a[e].max : d));
                  var u = a[e].zindex,
                    p =
                      "translate3d(" +
                      (n.options.horizontal ? d : "0") +
                      "px," +
                      (n.options.vertical ? h : "0") +
                      "px," +
                      u +
                      "px) " +
                      a[e].transform;
                  n.elems[e].style[g] = p;
                }
                n.options.callback(t);
              };
            return (
              (n.destroy = function () {
                for (var t = 0; t < n.elems.length; t++)
                  n.elems[t].style.cssText = a[t].style;
                c || (window.removeEventListener("resize", b), (c = !0)),
                  f(d),
                  (d = null);
              }),
              b(),
              (n.refresh = b),
              n
            );
          }
          console.warn(
            "Rellax: The elements you're trying to select don't exist."
          );
        };
        return t;
      }),
      t.exports ? (t.exports = i()) : (e.Rellax = i());
  })(P);
  var T = P.exports,
    I = { exports: {} };
  !(function (t, e) {
    var i;
    (i = function () {
      return (function (t) {
        var e = {};
        function i(n) {
          if (e[n]) return e[n].exports;
          var s = (e[n] = { i: n, l: !1, exports: {} });
          return t[n].call(s.exports, s, s.exports, i), (s.l = !0), s.exports;
        }
        return (
          (i.m = t),
          (i.c = e),
          (i.d = function (t, e, n) {
            i.o(t, e) ||
              Object.defineProperty(t, e, { enumerable: !0, get: n });
          }),
          (i.r = function (t) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(t, "__esModule", { value: !0 });
          }),
          (i.t = function (t, e) {
            if ((1 & e && (t = i(t)), 8 & e)) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var n = Object.create(null);
            if (
              (i.r(n),
              Object.defineProperty(n, "default", { enumerable: !0, value: t }),
              2 & e && "string" != typeof t)
            )
              for (var s in t)
                i.d(
                  n,
                  s,
                  function (e) {
                    return t[e];
                  }.bind(null, s)
                );
            return n;
          }),
          (i.n = function (t) {
            var e =
              t && t.__esModule
                ? function () {
                    return t.default;
                  }
                : function () {
                    return t;
                  };
            return i.d(e, "a", e), e;
          }),
          (i.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
          }),
          (i.p = ""),
          i((i.s = 0))
        );
      })([
        function (t, e, i) {
          i.r(e);
          var n = function (t) {
              return Array.isArray(t) ? t : [t];
            },
            s = function (t) {
              return t instanceof Node;
            },
            o = function (t, e) {
              if (t && e) {
                t = (function (t) {
                  return t instanceof NodeList;
                })(t)
                  ? t
                  : [t];
                for (
                  var i = 0;
                  i < t.length && !0 !== e(t[i], i, t.length);
                  i++
                );
              }
            },
            r = function (t) {
              return console.error("[scroll-lock] ".concat(t));
            },
            l = function (t) {
              if (Array.isArray(t)) return t.join(", ");
            },
            a = function (t) {
              var e = [];
              return (
                o(t, function (t) {
                  return e.push(t);
                }),
                e
              );
            },
            c = function (t, e) {
              var i =
                  !(arguments.length > 2 && void 0 !== arguments[2]) ||
                  arguments[2],
                n =
                  arguments.length > 3 && void 0 !== arguments[3]
                    ? arguments[3]
                    : document;
              if (i && -1 !== a(n.querySelectorAll(e)).indexOf(t)) return t;
              for (
                ;
                (t = t.parentElement) &&
                -1 === a(n.querySelectorAll(e)).indexOf(t);

              );
              return t;
            },
            h = function (t, e) {
              var i =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : document,
                n = -1 !== a(i.querySelectorAll(e)).indexOf(t);
              return n;
            },
            d = function (t) {
              if (t) return "hidden" === getComputedStyle(t).overflow;
            },
            u = function (t) {
              if (t) return !!d(t) || t.scrollTop <= 0;
            },
            p = function (t) {
              if (t) {
                if (d(t)) return !0;
                var e = t.scrollTop,
                  i = t.scrollHeight;
                return e + t.offsetHeight >= i;
              }
            },
            f = function (t) {
              if (t) return !!d(t) || t.scrollLeft <= 0;
            },
            g = function (t) {
              if (t) {
                if (d(t)) return !0;
                var e = t.scrollLeft,
                  i = t.scrollWidth;
                return e + t.offsetWidth >= i;
              }
            },
            m = function (t) {
              return h(t, 'textarea, [contenteditable="true"]');
            },
            v = function (t) {
              return h(t, 'input[type="range"]');
            };
          function y(t, e, i) {
            return (
              e in t
                ? Object.defineProperty(t, e, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = i),
              t
            );
          }
          i.d(e, "disablePageScroll", function () {
            return x;
          }),
            i.d(e, "enablePageScroll", function () {
              return S;
            }),
            i.d(e, "getScrollState", function () {
              return E;
            }),
            i.d(e, "clearQueueScrollLocks", function () {
              return C;
            }),
            i.d(e, "getTargetScrollBarWidth", function () {
              return k;
            }),
            i.d(e, "getCurrentTargetScrollBarWidth", function () {
              return A;
            }),
            i.d(e, "getPageScrollBarWidth", function () {
              return L;
            }),
            i.d(e, "getCurrentPageScrollBarWidth", function () {
              return D;
            }),
            i.d(e, "addScrollableTarget", function () {
              return P;
            }),
            i.d(e, "removeScrollableTarget", function () {
              return T;
            }),
            i.d(e, "addScrollableSelector", function () {
              return I;
            }),
            i.d(e, "removeScrollableSelector", function () {
              return z;
            }),
            i.d(e, "addLockableTarget", function () {
              return W;
            }),
            i.d(e, "addLockableSelector", function () {
              return _;
            }),
            i.d(e, "setFillGapMethod", function () {
              return F;
            }),
            i.d(e, "addFillGapTarget", function () {
              return O;
            }),
            i.d(e, "removeFillGapTarget", function () {
              return M;
            }),
            i.d(e, "addFillGapSelector", function () {
              return B;
            }),
            i.d(e, "removeFillGapSelector", function () {
              return j;
            }),
            i.d(e, "refillGaps", function () {
              return N;
            });
          var b = ["padding", "margin", "width", "max-width", "none"],
            w = {
              scroll: !0,
              queue: 0,
              scrollableSelectors: ["[data-scroll-lock-scrollable]"],
              lockableSelectors: ["body", "[data-scroll-lock-lockable]"],
              fillGapSelectors: [
                "body",
                "[data-scroll-lock-fill-gap]",
                "[data-scroll-lock-lockable]",
              ],
              fillGapMethod: b[0],
              startTouchY: 0,
              startTouchX: 0,
            },
            x = function (t) {
              w.queue <= 0 && ((w.scroll = !1), G(), Y()), P(t), w.queue++;
            },
            S = function (t) {
              w.queue > 0 && w.queue--,
                w.queue <= 0 && ((w.scroll = !0), H(), X()),
                T(t);
            },
            E = function () {
              return w.scroll;
            },
            C = function () {
              w.queue = 0;
            },
            k = function (t) {
              var e =
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
              if (s(t)) {
                var i = t.style.overflowY;
                e
                  ? E() ||
                    (t.style.overflowY = t.getAttribute(
                      "data-scroll-lock-saved-overflow-y-property"
                    ))
                  : (t.style.overflowY = "scroll");
                var n = A(t);
                return (t.style.overflowY = i), n;
              }
              return 0;
            },
            A = function (t) {
              if (s(t)) {
                if (t === document.body) {
                  var e = document.documentElement.clientWidth;
                  return window.innerWidth - e;
                }
                var i = t.style.borderLeftWidth,
                  n = t.style.borderRightWidth;
                (t.style.borderLeftWidth = "0px"),
                  (t.style.borderRightWidth = "0px");
                var o = t.offsetWidth - t.clientWidth;
                return (
                  (t.style.borderLeftWidth = i),
                  (t.style.borderRightWidth = n),
                  o
                );
              }
              return 0;
            },
            L = function () {
              var t =
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
              return k(document.body, t);
            },
            D = function () {
              return A(document.body);
            },
            P = function (t) {
              t &&
                n(t).map(function (t) {
                  o(t, function (t) {
                    s(t)
                      ? t.setAttribute("data-scroll-lock-scrollable", "")
                      : r('"'.concat(t, '" is not a Element.'));
                  });
                });
            },
            T = function (t) {
              t &&
                n(t).map(function (t) {
                  o(t, function (t) {
                    s(t)
                      ? t.removeAttribute("data-scroll-lock-scrollable")
                      : r('"'.concat(t, '" is not a Element.'));
                  });
                });
            },
            I = function (t) {
              t &&
                n(t).map(function (t) {
                  w.scrollableSelectors.push(t);
                });
            },
            z = function (t) {
              t &&
                n(t).map(function (t) {
                  w.scrollableSelectors = w.scrollableSelectors.filter(
                    function (e) {
                      return e !== t;
                    }
                  );
                });
            },
            W = function (t) {
              t &&
                (n(t).map(function (t) {
                  o(t, function (t) {
                    s(t)
                      ? t.setAttribute("data-scroll-lock-lockable", "")
                      : r('"'.concat(t, '" is not a Element.'));
                  });
                }),
                E() || G());
            },
            _ = function (t) {
              t &&
                (n(t).map(function (t) {
                  w.lockableSelectors.push(t);
                }),
                E() || G(),
                B(t));
            },
            F = function (t) {
              if (t)
                if (-1 !== b.indexOf(t)) (w.fillGapMethod = t), N();
                else {
                  var e = b.join(", ");
                  r(
                    '"'
                      .concat(
                        t,
                        '" method is not available!\nAvailable fill gap methods: '
                      )
                      .concat(e, ".")
                  );
                }
            },
            O = function (t) {
              t &&
                n(t).map(function (t) {
                  o(t, function (t) {
                    s(t)
                      ? (t.setAttribute("data-scroll-lock-fill-gap", ""),
                        w.scroll || V(t))
                      : r('"'.concat(t, '" is not a Element.'));
                  });
                });
            },
            M = function (t) {
              t &&
                n(t).map(function (t) {
                  o(t, function (t) {
                    s(t)
                      ? (t.removeAttribute("data-scroll-lock-fill-gap"),
                        w.scroll || K(t))
                      : r('"'.concat(t, '" is not a Element.'));
                  });
                });
            },
            B = function (t) {
              t &&
                n(t).map(function (t) {
                  -1 === w.fillGapSelectors.indexOf(t) &&
                    (w.fillGapSelectors.push(t), w.scroll || Q(t));
                });
            },
            j = function (t) {
              t &&
                n(t).map(function (t) {
                  (w.fillGapSelectors = w.fillGapSelectors.filter(function (e) {
                    return e !== t;
                  })),
                    w.scroll || J(t);
                });
            },
            N = function () {
              w.scroll || Y();
            },
            G = function () {
              var t = l(w.lockableSelectors);
              q(t);
            },
            H = function () {
              var t = l(w.lockableSelectors);
              U(t);
            },
            q = function (t) {
              var e = document.querySelectorAll(t);
              o(e, function (t) {
                $(t);
              });
            },
            U = function (t) {
              var e = document.querySelectorAll(t);
              o(e, function (t) {
                R(t);
              });
            },
            $ = function (t) {
              if (
                s(t) &&
                "true" !== t.getAttribute("data-scroll-lock-locked")
              ) {
                var e = window.getComputedStyle(t);
                t.setAttribute(
                  "data-scroll-lock-saved-overflow-y-property",
                  e.overflowY
                ),
                  t.setAttribute(
                    "data-scroll-lock-saved-inline-overflow-property",
                    t.style.overflow
                  ),
                  t.setAttribute(
                    "data-scroll-lock-saved-inline-overflow-y-property",
                    t.style.overflowY
                  ),
                  (t.style.overflow = "hidden"),
                  t.setAttribute("data-scroll-lock-locked", "true");
              }
            },
            R = function (t) {
              s(t) &&
                "true" === t.getAttribute("data-scroll-lock-locked") &&
                ((t.style.overflow = t.getAttribute(
                  "data-scroll-lock-saved-inline-overflow-property"
                )),
                (t.style.overflowY = t.getAttribute(
                  "data-scroll-lock-saved-inline-overflow-y-property"
                )),
                t.removeAttribute("data-scroll-lock-saved-overflow-property"),
                t.removeAttribute(
                  "data-scroll-lock-saved-inline-overflow-property"
                ),
                t.removeAttribute(
                  "data-scroll-lock-saved-inline-overflow-y-property"
                ),
                t.removeAttribute("data-scroll-lock-locked"));
            },
            Y = function () {
              w.fillGapSelectors.map(function (t) {
                Q(t);
              });
            },
            X = function () {
              w.fillGapSelectors.map(function (t) {
                J(t);
              });
            },
            Q = function (t) {
              var e = document.querySelectorAll(t),
                i = -1 !== w.lockableSelectors.indexOf(t);
              o(e, function (t) {
                V(t, i);
              });
            },
            V = function (t) {
              var e =
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
              if (s(t)) {
                var i;
                if ("" === t.getAttribute("data-scroll-lock-lockable") || e)
                  i = k(t, !0);
                else {
                  var n = c(t, l(w.lockableSelectors));
                  i = k(n, !0);
                }
                "true" === t.getAttribute("data-scroll-lock-filled-gap") &&
                  K(t);
                var o = window.getComputedStyle(t);
                if (
                  (t.setAttribute("data-scroll-lock-filled-gap", "true"),
                  t.setAttribute(
                    "data-scroll-lock-current-fill-gap-method",
                    w.fillGapMethod
                  ),
                  "margin" === w.fillGapMethod)
                ) {
                  var r = parseFloat(o.marginRight);
                  t.style.marginRight = "".concat(r + i, "px");
                } else if ("width" === w.fillGapMethod)
                  t.style.width = "calc(100% - ".concat(i, "px)");
                else if ("max-width" === w.fillGapMethod)
                  t.style.maxWidth = "calc(100% - ".concat(i, "px)");
                else if ("padding" === w.fillGapMethod) {
                  var a = parseFloat(o.paddingRight);
                  t.style.paddingRight = "".concat(a + i, "px");
                }
              }
            },
            J = function (t) {
              var e = document.querySelectorAll(t);
              o(e, function (t) {
                K(t);
              });
            },
            K = function (t) {
              if (
                s(t) &&
                "true" === t.getAttribute("data-scroll-lock-filled-gap")
              ) {
                var e = t.getAttribute(
                  "data-scroll-lock-current-fill-gap-method"
                );
                t.removeAttribute("data-scroll-lock-filled-gap"),
                  t.removeAttribute("data-scroll-lock-current-fill-gap-method"),
                  "margin" === e
                    ? (t.style.marginRight = "")
                    : "width" === e
                    ? (t.style.width = "")
                    : "max-width" === e
                    ? (t.style.maxWidth = "")
                    : "padding" === e && (t.style.paddingRight = "");
              }
            };
          "undefined" != typeof window &&
            window.addEventListener("resize", function (t) {
              N();
            }),
            "undefined" != typeof document &&
              (document.addEventListener("touchstart", function (t) {
                w.scroll ||
                  ((w.startTouchY = t.touches[0].clientY),
                  (w.startTouchX = t.touches[0].clientX));
              }),
              document.addEventListener(
                "touchmove",
                function (t) {
                  if (!w.scroll) {
                    var e = w.startTouchY,
                      i = w.startTouchX,
                      n = t.touches[0].clientY,
                      s = t.touches[0].clientX;
                    if (t.touches.length < 2) {
                      var o = l(w.scrollableSelectors),
                        r = {
                          up: e < n,
                          down: e > n,
                          left: i < s,
                          right: i > s,
                        },
                        a = {
                          up: e + 3 < n,
                          down: e - 3 > n,
                          left: i + 3 < s,
                          right: i - 3 > s,
                        };
                      !(function e(i) {
                        var n =
                          arguments.length > 1 &&
                          void 0 !== arguments[1] &&
                          arguments[1];
                        if (i) {
                          var s = c(i, o, !1);
                          if (v(i)) return !1;
                          if (n || (m(i) && c(i, o)) || h(i, o)) {
                            var l = !1;
                            f(i) && g(i)
                              ? ((r.up && u(i)) || (r.down && p(i))) && (l = !0)
                              : u(i) && p(i)
                              ? ((r.left && f(i)) || (r.right && g(i))) &&
                                (l = !0)
                              : ((a.up && u(i)) ||
                                  (a.down && p(i)) ||
                                  (a.left && f(i)) ||
                                  (a.right && g(i))) &&
                                (l = !0),
                              l &&
                                (s
                                  ? e(s, !0)
                                  : t.cancelable && t.preventDefault());
                          } else e(s);
                        } else t.cancelable && t.preventDefault();
                      })(t.target);
                    }
                  }
                },
                { passive: !1 }
              ),
              document.addEventListener("touchend", function (t) {
                w.scroll || ((w.startTouchY = 0), (w.startTouchX = 0));
              }));
          var Z = {
              hide: function (t) {
                r(
                  '"hide" is deprecated! Use "disablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#disablepagescrollscrollabletarget'
                ),
                  x(t);
              },
              show: function (t) {
                r(
                  '"show" is deprecated! Use "enablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#enablepagescrollscrollabletarget'
                ),
                  S(t);
              },
              toggle: function (t) {
                r('"toggle" is deprecated! Do not use it.'), E() ? x() : S(t);
              },
              getState: function () {
                return (
                  r(
                    '"getState" is deprecated! Use "getScrollState" instead. \n https://github.com/FL3NKEY/scroll-lock#getscrollstate'
                  ),
                  E()
                );
              },
              getWidth: function () {
                return (
                  r(
                    '"getWidth" is deprecated! Use "getPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getpagescrollbarwidth'
                  ),
                  L()
                );
              },
              getCurrentWidth: function () {
                return (
                  r(
                    '"getCurrentWidth" is deprecated! Use "getCurrentPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getcurrentpagescrollbarwidth'
                  ),
                  D()
                );
              },
              setScrollableTargets: function (t) {
                r(
                  '"setScrollableTargets" is deprecated! Use "addScrollableTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addscrollabletargetscrollabletarget'
                ),
                  P(t);
              },
              setFillGapSelectors: function (t) {
                r(
                  '"setFillGapSelectors" is deprecated! Use "addFillGapSelector" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgapselectorfillgapselector'
                ),
                  B(t);
              },
              setFillGapTargets: function (t) {
                r(
                  '"setFillGapTargets" is deprecated! Use "addFillGapTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgaptargetfillgaptarget'
                ),
                  O(t);
              },
              clearQueue: function () {
                r(
                  '"clearQueue" is deprecated! Use "clearQueueScrollLocks" instead. \n https://github.com/FL3NKEY/scroll-lock#clearqueuescrolllocks'
                ),
                  C();
              },
            },
            tt = (function (t) {
              for (var e = 1; e < arguments.length; e++) {
                var i = null != arguments[e] ? arguments[e] : {},
                  n = Object.keys(i);
                "function" == typeof Object.getOwnPropertySymbols &&
                  (n = n.concat(
                    Object.getOwnPropertySymbols(i).filter(function (t) {
                      return Object.getOwnPropertyDescriptor(i, t).enumerable;
                    })
                  )),
                  n.forEach(function (e) {
                    y(t, e, i[e]);
                  });
              }
              return t;
            })(
              {
                disablePageScroll: x,
                enablePageScroll: S,
                getScrollState: E,
                clearQueueScrollLocks: C,
                getTargetScrollBarWidth: k,
                getCurrentTargetScrollBarWidth: A,
                getPageScrollBarWidth: L,
                getCurrentPageScrollBarWidth: D,
                addScrollableSelector: I,
                removeScrollableSelector: z,
                addScrollableTarget: P,
                removeScrollableTarget: T,
                addLockableSelector: _,
                addLockableTarget: W,
                addFillGapSelector: B,
                removeFillGapSelector: j,
                addFillGapTarget: O,
                removeFillGapTarget: M,
                setFillGapMethod: F,
                refillGaps: N,
                _state: w,
              },
              Z
            );
          e.default = tt;
        },
      ]).default;
    }),
      (t.exports = i());
  })(I);
  var z = e({ __proto__: null, default: f(I.exports) }, [I.exports]);
  return (
    (t.Flickity = A),
    (t.FlickityFade = D),
    (t.Rellax = T),
    (t.ScrollLock = z),
    (t.themeAddresses = l),
    (t.themeCurrency = a),
    (t.themeImages = u),
    Object.defineProperty(t, "__esModule", { value: !0 }),
    t
  );
})({});
