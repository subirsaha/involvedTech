//script in teacher_login.html

    (function ($) {
        $(window).on("load", function () {
            var whiteUrls = ['/', '/login','/lab3/involved/','/lab3/involved/login'];
            setTimeout(function () {
                initmScroller();
                if ($.inArray(window.location.pathname, whiteUrls) > -1) {
                    $("head").append("<script type='text/javascript' src='js/particles.js'></script>").append("<script type='text/javascript' src='js/app.js'></script>");
                }
                //$(window).trigger('load.bs.select.data-api');
                initDropdown();
            }, 700);

            function initmScroller () {
                console.log('initmScroller');
                $("#content-1").mCustomScrollbar({
                    axis: "y",
                    theme: "3d",
                    scrollInertia: 550,
                    scrollbarPosition: "outside"
                });
                $("#content-2").mCustomScrollbar({
                    axis: "y",
                    theme: "3d",
                    scrollInertia: 550,
                    scrollbarPosition: "outside"
                });

                $(".right_srl").mCustomScrollbar({
                    axis: "x",
                    theme: "3d",
                    scrollInertia: 550,
                    scrollbarPosition: "outside"
                });
                $(".content").mCustomScrollbar({
                    axis: "y",
                    theme: "3d",
                    scrollInertia: 550,
                    scrollbarPosition: "outside"
                });
            }


            //script in login.html

            //var count_particles, stats, update;
            //stats = new Stats;
            //stats.setMode(0);
            //stats.domElement.style.position = 'absolute';
            //stats.domElement.style.left = '0px';
            //stats.domElement.style.top = '0px';
            //document.body.appendChild(stats.domElement);
            //count_particles = document.querySelector('.js-count-particles');
            //update = function() {
            //    stats.begin();
            //    stats.end();
            //    if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
            //        count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
            //    }
            //    requestAnimationFrame(update);
            //};
            //requestAnimationFrame(update);

        });
    })(jQuery);

