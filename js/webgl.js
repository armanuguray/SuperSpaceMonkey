/**
 * This is an object that encapsulates initializing a WebGL context and shader programs.
 */
WebGLUtils = new function() {

    /**
     * Creates and returns the WebGL context for the given canvas. Returns null, if no context can be created.
     */
    var getWebGLContext = function(canvas) {
        var names = [ "webgl", "experimental-webgl", "webkit-3d", "moz-webgl" ];
        var context = null;
        for (var i = 0; i < names.length; i++) {
            try {
                context = canvas.getContext(names[i]);
            } catch(e) {}
            if (context) {
                break;
            }
        }
        return context;
    };

    // TODO: write functions for loading shaders
};

// TODO: write a Camera class
