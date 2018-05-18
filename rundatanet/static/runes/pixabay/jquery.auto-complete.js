/*
    jQuery autoComplete v1.0.7-fralik.1
    Copyright (c) 2014 Simon Steinberger / Pixabay
              (c) 2018 Vadim Frolov
    License: http://www.opensource.org/licenses/mit-license.php
    @preserve (for uglifyjs)
*/

(function($){
    $.fn.autoComplete = function(options) {
        var o = $.extend({}, $.fn.autoComplete.defaults, options);
        // public methods
        if (typeof options == 'string') {
            this.each(function(){
                var that = $(this);
                if (options == 'destroy') {
                    that.clusterize.destroy(true);
                    $(window).off('resize.autocomplete', that.updateSC);
                    that.off('blur.autocomplete focus.autocomplete keydown.autocomplete keyup.autocomplete');
                    if (that.data('autocomplete'))
                        that.attr('autocomplete', that.data('autocomplete'));
                    else
                        that.removeAttr('autocomplete');
                    $(that.data('sc')).remove();
                    that.removeData('sc').removeData('autocomplete');
                }
            });
            return this;
        }

        return this.each(function(){
            var that = $(this);
            // unique ID for the container
            that.contentId = o.id || 'autocomplete-cont-' + Math.random().toString(36).substring(2, 7);
            // sc = 'suggestions container'
            that.sc = $('<div id="'+that.contentId+'" class="autocomplete-suggestions '+o.menuClass+'"></div>');
            that.data('sc', that.sc).data('autocomplete', that.attr('autocomplete'));
            that.attr('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';
            that.submitting = false;
            that.attachedToBody = false;

            that.updateSC = function(resize, next){
                if (that.attachedToBody) {
                    that.sc.css({
                        width: that.outerWidth(),
                        top: that.offset().top - that.sc.outerHeight(),
                        left: that.offset().left,
                    });
                } else {
                    that.sc.css({
                        width: that.outerWidth(),
                        top: -that.sc.outerHeight() + 2,
                    });
                }
                if (!resize) {
                    that.sc.show();
                    if (!that.sc.maxHeight) that.sc.maxHeight = parseInt(that.sc.css('max-height'));
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = $('.autocomplete-suggestion', that.sc).first().outerHeight();
                    if (that.sc.suggestionHeight)
                        if (!next) that.sc.scrollTop(0);
                        else {
                            var scrTop = that.sc.scrollTop(), selTop = next.offset().top - that.sc.offset().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop(selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight);
                            else if (selTop < 0)
                                that.sc.scrollTop(selTop + scrTop);
                        }
                }
                that.clusterize.refresh();
            }
            $(window).on('resize.autocomplete', that.updateSC);

            if (that.parent()) {
                that.sc.appendTo(that.parent());
            } else {
                that.sc.appendTo('body');
                that.attachedToBody = true;
            }
            that.clusterize = new Clusterize({
                scrollElem: that.sc[0],
                contentElem: that.sc[0],
            });

            that.sc.on('mouseleave', '.autocomplete-suggestion', function (){
                $('.autocomplete-suggestion.selected').removeClass('selected');
            });

            that.sc.on('mouseenter', '.autocomplete-suggestion', function (){
                $('.autocomplete-suggestion.selected').removeClass('selected');
                $(this).addClass('selected');
            });

            that.sc.on('mousedown click', '.autocomplete-suggestion', function (e){
                var item = $(this), v = item.attr('data-val');
                if (v || item.hasClass('autocomplete-suggestion')) { // else outside click
                    that.val(v);
                    o.onSelect(e, v, item);
                    that.sc.hide();
                }
                return false;
            });

            that.on('blur.autocomplete', function(){
                try { over_sb = $('.autocomplete-suggestions:hover').length; } catch(e){ over_sb = 0; } // IE7 fix :hover
                if (!over_sb) {
                    that.last_val = that.val();
                    that.sc.hide();
                    setTimeout(function(){ that.sc.hide(); }, 350); // hide suggestions on fast input
                } else if (!that.is(':focus')) setTimeout(function(){ that.focus(); }, 20);
            });

            if (!o.minChars) that.on('focus.autocomplete', function(){ that.last_val = '\n'; that.trigger('keyup.autocomplete'); });

            function suggest(data, val) {
                that.cache[val] = data;
                if (! data.length) {
                    that.sc.hide();
                } else if (
                    // protect against races between completers
                    val === that.val() &&
                    // protect against completions after tabbing away
                    that.is(':focus') &&
                    // protect against completions after submit
                    ! that.submitting
                ) {
                    var s = [];
                    for (var i=0;i<data.length;i++) {
                        s.push(o.renderItem(data[i], val));
                    }
                    that.clusterize.update(s);
                    that.updateSC(0);
                }
            }

            that.on('keydown.autocomplete', function(e){
                // always clear the submitting flag on keyboard input
                that.submitting = false;

                // down (40), up (38)
                if ((e.which == 40 || e.which == 38) && that.sc.html()) {
                    var next, sel = $('.autocomplete-suggestion.selected', that.sc);
                    if (!sel.length) {
                        next = (e.which == 40) ? $('.autocomplete-suggestion', that.sc).first() : $('.autocomplete-suggestion', that.sc).last();
                        next.addClass('selected');
                    } else {
                        next = (e.which == 40) ? sel.next('.autocomplete-suggestion') : sel.prev('.autocomplete-suggestion');
                        if (next.length) { sel.removeClass('selected'); next.addClass('selected'); }
                        else { sel.removeClass('selected'); next = 0; }
                    }
                    if (o.liveValue) {
                        that.val(next ? next.attr('data-val') : that.last_val);
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (e.which == 27) {
                    var sel = $('.autocomplete-suggestion.selected', that.sc);
                    if (that.sc.is(':visible')) {
                        if (sel.length) that.val(that.last_val);
                        that.sc.hide();
                        return false;
                    }
                }
                // enter or tab
                else if (e.which == 13 || e.which == 9) {
                    var sel = $('.autocomplete-suggestion.selected', that.sc), v = sel.attr('data-val');
                    if (that.sc.is(':visible')) {
                        if (sel.length) {
                            that.val(v);
                            o.onSelect(e, v, sel);
                        }
                        that.sc.hide();
                        if (sel.length) {
                            if (e.which == 13 && !o.propagateEnter) return false;
                            if (e.which == 9 && !o.propagateTab) return false;
                        }
                    }
                    if (e.which == 13) {
                        // there can be a race if we are fetching
                        // completions at the same time that the user
                        // ajax-submits the form with the enter key. Ensure
                        // that submitting the form isn't shortly followed
                        // by showing the completions box.
                        that.submitting = true;
                    }
                }
            });

            that.on('keyup.autocomplete', function(e){
                if (!~$.inArray(e.which, [13, 27, 35, 36, 37, 38, 39, 40])) {
                    var val = that.val();
                    if (val.length >= o.minChars) {
                        if (val != that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) {
                                    suggest(that.cache[val], val);
                                    return;
                                }
                                // no requests if previous suggestions were empty
                                for (var i=1; i<val.length-o.minChars; i++) {
                                    var part = val.slice(0, val.length-i);
                                    if (part in that.cache && !that.cache[part].length) {
                                        suggest([], val);
                                        return;
                                    }
                                }
                            }
                            that.timer = setTimeout(function(){
                                o.source(val, function(data){suggest(data, val)}, o.delay);
                            });
                        }
                    } else {
                        that.last_val = val;
                        that.sc.hide();
                    }
                }
            });
        });
    }

    $.fn.autoComplete.defaults = {
        source: 0,
        minChars: 3,
        delay: 150,
        cache: 1,
        liveValue: 1,
        propagateTab: 1,
        propagateEnter: 1,
        menuClass: '',
        // User-defined ID of the auto-complete container. If empty, ID will be generated.
        id: '',
        renderItem: function (item, search){
            // escape special characters
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
        },
        onSelect: function(e, term, item){}
    };
}(jQuery));
