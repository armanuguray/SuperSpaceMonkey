/**
 * Main method.
 */
function main() {
    // setup the UI
    $(function () {
        // reset body content
        $('body').html('<div id="frustum-view"></div> \
                        <div id="camera-view" class="ui-widget-content"></div> \
                        <div id="control-panel"></div> \
                        <div id="camtrans-panel"></div>');
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
        $( "#control-panel" ).html(
                        '<div> \
                            <h3><a href="#">Field of View</a></h3> \
                            <div class="content"> \
                                <div class="region" style="margin-bottom: 20px"> \
                                    <label for="width-amount">Width:</label> \
	                                <input type="text" id="width-amount" class="amount" readonly="readonly"/> \
                                    <div id="width-slider" class="slider"/> \
                                </div> \
                                <div class="region"> \
                                    <label for="height-amount">Height:</label> \
	                                <input type="text" id="height-amount" class="amount" readonly="readonly"/> \
                                    <div id="height-slider" class="slider"/> \
                                </div> \
                            </div> \
                        </div> \
                        <div> \
                            <h3><a href="#">Clipping</a></h3> \
                            <div class="content"> \
                                <div class="region" style="margin-bottom: 20px"> \
                                    <label for="near-amount">Near:</label> \
	                                <input type="text" id="near-amount" class="amount" readonly="readonly"/> \
                                    <div id="near-slider" class="slider"/> \
                                </div> \
                                <div class="region"> \
                                    <label for="far-amount">Far:</label> \
	                                <input type="text" id="far-amount" class="amount" readonly="readonly"/> \
                                    <div id="far-slider" class="slider"/> \
                                </div> \
                            </div> \
                        </div>');
        // setup accordion
        $( "#control-panel" ).accordion({ header: "h3" });
        
        // sliders
        var default_value = 1.0;
        var slider_options = { range: 'min',
                               min: 0.1,
                               max: 4.0,
                               step: 0.1,
                               value: default_value,
                               slide: function(event, ui) {
                                          $("#width-amount").val(ui.value);
                               }};
        $( "#width-amount" ).val(default_value);
        $( "#height-amount" ).val(default_value);
        $( "#near-amount" ).val(default_value);
        $( "#far-amount" ).val(default_value);
        $( "#width-slider" ).slider(slider_options);
        slider_options['slide'] = function(event, ui) { $("#height-amount").val(ui.value); };
        $( "#height-slider" ).slider(slider_options);
        slider_options['slide'] = function(event, ui) { $("#near-amount").val(ui.value); };
        $( "#near-slider" ).slider(slider_options);
        slider_options['slide'] = function(event, ui) { $("#far-amount").val(ui.value); };
        $( "#far-slider" ).slider(slider_options);
    });
}
