/**
 * Main method.
 */
function main() {
    // setup the UI
    $(function () {
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
        // add widgets
        $( "#control-panel" ).html(
                        '<div> \
                            <h3><a href="#">Field of View</a></h3> \
                            <div>Width <div id="slider" /></div> \
                        </div> \
                        <div> \
                            <h3><a href="#">Clipping</a></h3> \
                            <div>Phasellus mattis tincidunt nibh.</div> \
                        </div>');
        $( "#control-panel" ).accordion({ header: "h3" });
        $( "#slider" ).slider(); 
    });
}
