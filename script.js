/**
 * Main method.
 */
function main() {
    // setup the UI
    $(function() {
        // Camera View
        $( "#camera-view" ).draggable();
        $( "#camera-view" ).resizable();

        // Control Panel
        $( "#control-panel" ).draggable();
    });
}
