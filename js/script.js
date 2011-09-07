/**
 * @author Arman Uguray
 */

/**
 * gl1: WebGL context for the main canvas that displays the frustum.
 * gl2: WebGL context for the secondary canvas that displays the camera preview.
 */


/**
 * Main method.
 */
function main() {
    // setup the UI
    $(function () {
        // reset body content
        var ids = [ 'frustum-view', 'camera-view', 'camtrans-slider-panel', 'control-panel', 'warning-view' ];
        var classes = [ '', 'ui-widget-content', 'ui-widget-content', '', '' ];
        var markup = '';
        for (var i = 0; i < 5; i++) {
            markup += '<div id="' + ids[i] +'"';
            var c = classes[i];
            if (c != '') markup += 'class="' + c + '"';
            markup += '/>';
        }
        $('body').html(markup);
        var dr_options = { containment: 'window' };
        var rs_options = { minWidth: 300,
                           minHeight: 200,
                           containment: 'document' };

        /* Camera View */
        $( "#camera-view" ).draggable(dr_options);
        $( "#camera-view" ).resizable(rs_options);

        /* Control Panel */
        // make draggable
        $( "#control-panel" ).draggable(dr_options);

        // create markup          
        markup = '';
        var section_titles = [ 'Field of View', 'Clipping', 'Eye', 'Look', 'Up' ];
        var content_titles = [[ 'Width:', 'Height:' ],
                              [ 'Near:', 'Far:' ],
                              ['X:', 'Y:', 'Z:'],
                              ['X:', 'Y:', 'Z:'],
                              ['X:', 'Y:', 'Z:']];
        var content_ids = [[ 'width', 'height' ],
                           [ 'near', 'far' ],
                           ['eye-x', 'eye-y', 'eye-z'],
                           ['look-x', 'look-y', 'look-z'],
                           ['up-x', 'up-y', 'up-z']];
        for (var i = 0; i < section_titles.length; i++) {
            markup += '<div><h3><a href="#">' + section_titles[i] + '</a></h3><div class="content">';
            var titles = content_titles[i];
            var ids = content_ids[i];
            for (var j = 0; j < titles.length; j++) {
                var id = ids[j];
                markup += '<div class="region"';
                markup += '><label for="' + id + '-amount">' + titles[j] + '</label> \
                            <input type="text" id="' + id + '-amount" class="amount" readonly="readonly"/> \
                            <div id="' + id + '-slider" class="slider"/></div>';
            }
            markup += '</div></div>';
        }
        
        $( "#control-panel" ).html(markup);

        // setup accordion
        $( "#control-panel" ).accordion({ header: "h3",
                                          autoHeight: false,
                                          changestart: function(event, ui) { ui.newContent.css('height', 'auto'); },
                                          change: function(event, ui) { ui.newContent.css('height', 'auto'); }});
        
        // sliders
        var default_value = 1.0;
        var slider_options = { range: 'min',
                               min: 0.1,
                               max: 4.0,
                               step: 0.1,
                               value: default_value,
                               slide: function (event, ui) {
                                          $("#width-amount").val(ui.value);
                                          renderer.demoCamera.setWidth(ui.value);
                               }};
        // defaults
        $( "#width-amount" ).val(default_value);
        $( "#height-amount" ).val(default_value);
        $( "#near-amount" ).val(1);
        $( "#far-amount" ).val(6);
        $( "#eye-x-amount" ).val(-1.4);
        $( "#eye-y-amount" ).val(1.5);
        $( "#eye-z-amount" ).val(0.8);
        $( "#look-x-amount" ).val(0.3);
        $( "#look-y-amount" ).val(-0.1);
        $( "#look-z-amount" ).val(-1);
        $( "#up-x-amount" ).val(0);
        $( "#up-y-amount" ).val(1);
        $( "#up-z-amount" ).val(0);

        // sliders
        $( "#width-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#height-amount").val(ui.value); renderer.demoCamera.setHeight(ui.value); };
        $( "#height-slider" ).slider(slider_options);
        slider_options.value = 1;
        slider_options.min = 0.1;
        slider_options.max = 8.0;
        slider_options['slide'] = function (event, ui) { $("#near-amount").val(ui.value); renderer.demoCamera.setNear(ui.value); };
        $( "#near-slider" ).slider(slider_options);
        slider_options.value = 6;
        slider_options.min = 0.1;
        slider_options.max = 8.0;
        slider_options['slide'] = function (event, ui) { $("#far-amount").val(ui.value); renderer.demoCamera.setFar(ui.value); };
        $( "#far-slider" ).slider(slider_options);

        slider_options.min = -1.0;
        slider_options.max = 1.0;
        slider_options.value = -1.4;
        slider_options.min = -8.0;
        slider_options.max = 8.0;
        slider_options['slide'] = function (event, ui) { $("#eye-x-amount").val(ui.value); renderer.demoCamera.setEyeX(ui.value); };
        $( "#eye-x-slider" ).slider(slider_options);
        slider_options.value = 1.5;
        slider_options['slide'] = function (event, ui) { $("#eye-y-amount").val(ui.value); renderer.demoCamera.setEyeY(ui.value); };;
        $( "#eye-y-slider" ).slider(slider_options);
        slider_options.value = 0.8;
        slider_options['slide'] = function (event, ui) { $("#eye-z-amount").val(ui.value); renderer.demoCamera.setEyeZ(ui.value); };
        $( "#eye-z-slider" ).slider(slider_options);
        slider_options.min = -1.0;
        slider_options.max = 1.0;
        slider_options['slide'] = function (event, ui) { $("#look-x-amount").val(ui.value); renderer.demoCamera.setLookX(ui.value); };
        slider_options.value = 0.3;
        $( "#look-x-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#look-y-amount").val(ui.value); renderer.demoCamera.setLookY(ui.value); };
        slider_options.value = -0.1;
        $( "#look-y-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#look-z-amount").val(ui.value); renderer.demoCamera.setLookZ(ui.value); };
        slider_options.value = -1;
        $( "#look-z-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#up-x-amount").val(ui.value); renderer.demoCamera.setUpX(ui.value); };
        slider_options.value = 0;
        $( "#up-x-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#up-z-amount").val(ui.value); renderer.demoCamera.setUpZ(ui.value); };
        $( "#up-z-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#up-y-amount").val(ui.value); renderer.demoCamera.setUpY(ui.value); };
        slider_options.value = 1;
        $( "#up-y-slider" ).slider(slider_options);

        /* Transformation Slider Panel */
        $("#camtrans-slider-panel").draggable(dr_options);
        $("#camtrans-slider-panel").html('<p id="trans-step"></p> \
                                          <div class="slider"/>');
        var trans_steps = [ 'World-Space',
                            'Translate to origin',
                            'Align to the negative Z axis',
                            'Scale and unitize the view volume',
                            'Unhinge the viewing volume' ];
        slider_options = { range: 'min',
                           min: 0,
                           max: 4,
                           value: 0,
                           slide: function (event, ui) {
                                $("#trans-step").html(trans_steps[ui.value]);
                                renderer.demoCamera.updateFrustumTransform(ui.value);
                           }};
        $("#camtrans-slider-panel .slider").slider(slider_options);
        $("#trans-step").html(trans_steps[0]);

        $('#frustum-view').html('<canvas id="frustum-canvas" onmousedown="return renderer.handleMouseDown(event)"' +
                                                            'onmousemove="return renderer.handleMouseMove(event)"' +
                                                            'onmouseup="return renderer.handleMouseUp(event)"' +
                                                            'onmouseout="return renderer.handleMouseUp(event)"' +
                                                            'oncontextmenu="if (event.preventDefault) event.preventDefault(); else return false;"' +
                                                            'DOMMouseScroll="return renderer.handleMouseWheel(event)"' +
                                                            'onmousewheel="return renderer.handleMouseWheel(event)"></canvas>');
        $('#camera-view').append('<canvas id="camera-canvas"></canvas>');
        $('#frustum-canvas')[0].width = $('#frustum-canvas')[0].clientWidth;
        $('#frustum-canvas')[0].height = $('#frustum-canvas')[0].clientHeight;
        renderer = new Renderer($('#frustum-canvas')[0], $('#camera-canvas')[0]);

        window.onresize = function() { renderer.resize(); };

        // make things work with firefox
        var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" // Firefox doesn't recognize mousewheel as of FF3.x
        if (document.addEventListener) //WC3 browsers
            document.addEventListener(mousewheelevt, renderer.handleMouseWheel, false);
    });
}
