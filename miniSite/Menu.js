function init (proto) {
  return function () {
    return Object.assign
      ? Object.assign({}, proto)
      : $.extend({}, proto);
  };
}

var _Callbacks = {
  hamburger: function () {
    var dropDown = $('#dropDown');
    var isVisible = dropDown.is(':visible');
    dropDown[isVisible ? 'hide' : 'show']();
  }
};

var Callbacks = init(_Callbacks);

var _Menu = {
  build: function (isMobile, menuItems) {
    try {
      if (isMobile) this.buildMobileMenu(menuItems);
      else this.buildDesktopMenu(menuItems);
    } catch (e) {
      console.error(e.stack);
    }
  },
  buildMobileMenu: function (menuItems) {
    var hamburger = $('<button id="hamburger"><img class="hamburger" src="./miniSite/hamburger.svg?sanitize=true"></button>');
    hamburger.promise().done(function () {
      var callback = Callbacks();
      this.click(callback.hamburger);
    });
    $('#menu').append(hamburger);
    $('#topRibbon').addClass('topRibbonMobile');
    var dropDown = $('<div id="dropDown"></div>');
    $('#topRibbon').after(dropDown);
    this.renderLinks(menuItems, function (item) {
      item.addClass('mobileLink');
      dropDown.append(item);
    });
  },
  buildDesktopMenu: function (menuItems) {
    var menu = $('#menu');
    this.renderLinks(
      menuItems,
      function (item) {
        menu.append(item);
      });
  },
  renderLinks: function (menuItems, callback) {
    for (var i in menuItems) {
      var span = $('<span class="link">' + i + '</span>');
      var link = $('<a class="anchor link" href="' + menuItems[i] + '"></a>').html(span);
      callback(link);
    }
  }
};

var Menu = init(_Menu);
