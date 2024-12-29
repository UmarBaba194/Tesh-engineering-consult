/*!
 * Documenter 2.0
 * Updated to fix #! issue
 */

$(document).ready(function () {
  var timeout,
    sections = [],
    sectionscount = 0,
    win = $(window),
    sidebar = $("#documenter_sidebar"),
    nav = $("#documenter_nav"),
    navanchors = nav.find("a"),
    timeoffset = 50,
    hash = location.hash || null;

  // Handle external links (open in a new tab)
  $("a[href^=http]").on("click", function () {
    window.open($(this).attr("href"));
    return false;
  });

  // Smooth scroll for internal links
  $("a[href^='#']").on("click", function (event) {
    hash = $(this).attr("href");
    if (hash) {
      event.preventDefault(); // Prevent default behavior
      goTo(hash);
    }
  });

  // If a hash is already set, navigate to it on page load
  if (hash) {
    setTimeout(function () {
      goTo(hash, false); // False prevents setting the hash again
    }, 500);
  }

  // Gather section positions after page load
  win.on("load", function () {
    var sectionselector = "section";

    // Include subcategories in navigation if applicable
    if (nav.find("ol").length) {
      sectionselector = "section, h4";
    }

    // Save section positions
    $(sectionselector).each(function () {
      var _this = $(this);
      sections.push({
        id: this.id,
        pos: _this.offset().top,
      });
    });

    // Track scrolling and update navigation
    sectionscount = sections.length;

    win
      .on("scroll", function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          const pos = win.scrollTop();
          activateNav(pos);
        }, timeoffset);
      })
      .trigger("scroll");
  });

  // Scroll to a section and optionally update the hash
  function goTo(hash, updateHash = true) {
    hash = hash.replace(/^#!\//, "#");
    const target = $(hash);
    if (target.length) {
      $("html, body").stop().animate(
        {
          scrollTop: target.offset().top,
        },
        800
      );

      if (updateHash) {
        history.pushState(null, null, hash); // Update URL without reload
      }
    }
  }

  // Update navigation based on current scroll position
  function activateNav(pos) {
    const offset = 100;
    let current;

    for (let i = sectionscount - 1; i >= 0; i--) {
      if (sections[i].pos <= pos + offset) {
        navanchors.removeClass("current");
        current = navanchors.filter(`[href="#${sections[i].id}"]`);
        current.addClass("current");
        break;
      }
    }
  }
});
