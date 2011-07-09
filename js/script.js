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
        var ids = [ 'frustum-view', 'camera-view', 'camtrans-slider-panel', 'control-panel' ];
        var classes = [ '', 'ui-widget-content', 'ui-widget-content', '' ];
        var markup = '';
        for (var i = 0; i < 4; i++) {
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
        var section_titles = [ 'Field of View', 'Clipping' ];
        var content_titles = [[ 'Width:', 'Height:' ], [ 'Near:', 'Far:' ]];
        var content_ids = [[ 'width', 'height' ], [ 'near', 'far' ]];
        for (var i = 0; i < 2; i++) {
            markup += '<div><h3><a href="#">' + section_titles[i] + '</a></h3><div class="content">';
            var titles = content_titles[i];
            var ids = content_ids[i];
            for (var j = 0; j < 2; j++) {
                var id = ids[j];
                markup += '<div class="region"';
                if (j == 0) markup += 'style="margin-bottom: 20px"';
                markup += '><label for="' + id + '-amount">' + titles[j] + '</label> \
                            <input type="text" id="' + id + '-amount" class="amount" readonly="readonly"/> \
                            <div id="' + id + '-slider" class="slider"/></div>';
            }
            markup += '</div></div>';
        }
        
        $( "#control-panel" ).html(markup);

        // setup accordion
        $( "#control-panel" ).accordion({ header: "h3" });
        
        // sliders
        var default_value = 1.0;
        var slider_options = { range: 'min',
                               min: 0.1,
                               max: 4.0,
                               step: 0.1,
                               value: default_value,
                               slide: function (event, ui) {
                                          $("#width-amount").val(ui.value);
                               }};
        $( "#width-amount" ).val(default_value);
        $( "#height-amount" ).val(default_value);
        $( "#near-amount" ).val(default_value);
        $( "#far-amount" ).val(default_value);
        $( "#width-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#height-amount").val(ui.value); };
        $( "#height-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#near-amount").val(ui.value); };
        $( "#near-slider" ).slider(slider_options);
        slider_options['slide'] = function (event, ui) { $("#far-amount").val(ui.value); };
        $( "#far-slider" ).slider(slider_options);

        /* Transformation Slider Panel */
        $("#camtrans-slider-panel").draggable(dr_options);
        $("#camtrans-slider-panel").html('<p id="trans-step"></p> \
                                          <div class="slider"/>');
        var trans_steps = [ 'World-Space',
                            'Translate to origin',
                            'Align to the negative Z axis',
                            'Square up the view volume',
                            'Bring the far clipping plane to z = -1',
                            'Unhinge the viewing volume' ];
        slider_options = { range: 'min',
                           min: 0,
                           max: 5,
                           value: 0,
                           slide: function (event, ui) {
                                $("#trans-step").html(trans_steps[ui.value]);
                           }};
        $("#camtrans-slider-panel .slider").slider(slider_options);
        $("#trans-step").html(trans_steps[0]);

        ///TODO: Setup the gl contexts, change markup to show a message if WebGL is not available
        $('#frustum-view').html('<canvas id="frustum-canvas"></canvas>');
        $('#camera-view').append('<canvas id="camera-canvas"></canvas>');
        $('#frustum-canvas')[0].width = $('#frustum-canvas')[0].clientWidth;
        $('#frustum-canvas')[0].height = $('#frustum-canvas')[0].clientHeight;
        renderer = new Renderer($('#frustum-canvas')[0], $('#camera-canvas')[0]);

        window.onresize = function() { renderer.resize(); };
    });
}
