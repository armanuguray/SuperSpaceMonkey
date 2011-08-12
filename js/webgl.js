/**
 * J3DIVector3 additions.
 */

J3DIVector3.prototype.normalize = function() {
    var len = this.vectorLength();
    this.load(this[0] / len, this[1] / len, this[2] / len);
    return this;
};

J3DIVector3.prototype.multVecW0Matrix = function(matrix)
{
    var x = this[0];
    var y = this[1];
    var z = this[2];

    this[0] = x * matrix.$matrix.m11 + y * matrix.$matrix.m21 + z * matrix.$matrix.m31;
    this[1] = x * matrix.$matrix.m12 + y * matrix.$matrix.m22 + z * matrix.$matrix.m32;
    this[2] = x * matrix.$matrix.m13 + y * matrix.$matrix.m23 + z * matrix.$matrix.m33;
    var w = x * matrix.$matrix.m14 + y * matrix.$matrix.m24 + z * matrix.$matrix.m34;
    if (w != 1 && w != 0) {
        this[0] /= w;
        this[1] /= w;
        this[2] /= w;
    }
}

/**
 * This is an object that encapsulates initializing a WebGL context and shader programs.
 */
WebGLUtils = new function() {

    /**
     * Creates and returns the WebGL context for the given canvas. Returns null, if no context can be created.
     */
    this.initWebGLContext = function(canvas) {
        var names = [ "webgl", "experimental-webgl", "webkit-3d", "moz-webgl" ];
        var context = null;
        for (var i = 0; i < names.length; i++) {
            try {
                context = canvas.getContext(names[i]);
                context.viewportWidth = canvas.width;
                context.viewportHeight = canvas.height;
            } catch(e) {}
            if (context) {
                break;
            }
        }
        return context;
    };

    /**
     * Compiles and links a shader program object with the given sources for a fragment and vertex shader.
     * @param gl:  WebGL context
     * @param vertex: vertex shader source
     * @param fragment: fragment shader source
     */
    this.loadShaderProgram = function(gl, vertex, fragment) {
        // compile vertex shader        
        var vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vshader, vertex);
        gl.compileShader(vshader);
        if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
            alert("Failed compiling vertex shader: " + gl.getShaderInfoLog(vshader));
            gl.deleteShader(vshader);
            return null;
        }

        // compile fragment shader        
        var fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fshader, fragment);
        gl.compileShader(fshader);
        if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
            alert("Failed compiling fragment shader: " + gl.getShaderInfoLog(fshader));
            gl.deleteShader(vshader);
            gl.deleteShader(fshader);
            return null;
        }

        // create and link the program
        var prog = gl.createProgram();
        gl.attachShader(prog, vshader);
        gl.attachShader(prog, fshader);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            alert("Failed linking program: " + gl.getProgramInfoLog(prog));
            gl.deleteShader(vshader);
            gl.deleteShader(fshader);
            gl.deleteProgram(prog);
            return null;
        }
        return prog;
    };
};

/**
 * This class represents a camera used for rendering.
 */
function Camera() {
    this.modelview = new J3DIMatrix4();
    this.projection = new J3DIMatrix4();
    this.modelview.makeIdentity();
    this.projection.makeIdentity();

    this.eye = new J3DIVector3(0,0,0);
    this.look = new J3DIVector3(0,0,0);
    this.up = new J3DIVector3(0,0,0);
}

Camera.prototype.lookAt = function(eyex, eyey, eyez, centerx, centery, centerz, upx, upy, upz) {
    this.eye.load(eyex, eyey, eyez);
    this.look.load(centerx - eyex, centery - eyey, centerz - eyez);
    this.look.normalize();
    this.up.load(upx, upy, upz);

    this.modelview.makeIdentity();
    this.modelview.lookat(eyex, eyey, eyez, centerx, centery, centerz, upx, upy, upz);
};

Camera.prototype.perspective = function(fovy, aspect, near, far) {
    this.projection.makeIdentity();
    this.projection.perspective(fovy, aspect, near, far);
};

Camera.prototype.originOrbitingLookVectorTranslate = function(delta) {
    var x = this.eye[0] + delta * this.look[0],
        y = this.eye[1] + delta * this.look[1],
        z = this.eye[2] + delta * this.look[2];

    var dist = Math.sqrt(x*x + y*y + z*z);
    if (dist >= 1.0 && dist <= 16.0) {
        this.lookAt(x,y,z,
                    0,0,0,
                    0,1,0);
    }
};

Camera.prototype.originOrbitingRotate = function(deltaX, deltaY) {
    // TODO: fix this
    var mv = new J3DIMatrix4(this.modelview);
    var matrix = new J3DIMatrix4(this.projection);
    matrix.multiply(mv);
    matrix.invert();

    vec = new J3DIVector3(deltaX, deltaY, 0);
    vec.normalize();
    vec.multVecMatrix(matrix);
    vec.load(-this.eye[0] + vec[0], -this.eye[1] + vec[1], -this.eye[2] + vec[2]);
    vec.normalize();

    vec.cross(this.look);
    vec.normalize();
    matrix.makeIdentity();
    matrix.rotate(0.1 * Math.sqrt(deltaX*deltaX + deltaY*deltaY), vec[0], vec[1], vec[2]);
    this.eye.multVecMatrix(matrix);
    this.lookAt(this.eye[0], this.eye[1], this.eye[2],
                0,0,0,
                0,1,0);
};

/**
 * This is a camera that maintains individual camera matrices to demo individual transformation steps
 */
function DemoFrustumCamera() {
    this.eye = new J3DIVector3(0,0,0);
    this.look = new J3DIVector3(0,0,0);
    this.up = new J3DIVector3(0,0,0);
    this.u = new J3DIVector3(0,0,0);
    this.v = new J3DIVector3(0,0,0);
    this.w = new J3DIVector3(0,0,0);
    this.matrices = [ new J3DIMatrix4(), 
                      new J3DIMatrix4(),
                      new J3DIMatrix4(),
                      new J3DIMatrix4(),
                      new J3DIMatrix4() ];
    for (var i = 0; i < 5; i++)
        this.matrices[i].makeIdentity();
}

DemoFrustumCamera.prototype.lookAt = function(eye, center, up) {
    this.eye = eye;
    this.look = J3DIVector3(center.x - eye.x, center.y - eye.y, center.z - eye.z).normalize();
    this.up = up.normalize();
};

DemoFrustumCamera.prototype.perspective = function(fovy, aspect, near, far) {
    // TODO:
};

/**
 * Returns the composite transformation matrix up until given level, where level is a number between [0 - 5].
 */
DemoFrustumCamera.prototype.getFinalTransform = function(level) {
    // TODO:
};

/**
 * Renderer class maintains the two canvases and draws on them.
 * TODO: first get one canvas working, later do both
 */
function Renderer(canvas1, canvas2) {

    // Crate the contexts
    this.contexts = [];
    this.contexts.push(WebGLUtils.initWebGLContext(canvas1));
    //contexts.push(WebGLUtils.initWebGLContext(canvas2));
    if (!this.contexts[0]) {// TODO: contexts[1]
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    } else {
        setInterval(tick, 1000/30);
    }

    // initialize the shader program for each context
    var loadShaderProgram = function(context) {

        var vertex = "attribute vec3 a_position;" +
                     "attribute vec3 a_color;" +
                     "uniform mat4 u_modelview;" +
                     "uniform mat4 u_projection;" +
                     "uniform mat4 u_ctm;" +
                     "varying vec3 color;" +
                     "void main() {" +
                     "  color = a_color;" +
                     "  gl_Position = u_projection * u_modelview * u_ctm * vec4(a_position, 1.0);" +
                     "}";
        var frag = "#ifdef GL_ES\n" +
                   "precision highp float;\n" +
                   "#endif\n" +
                   "varying vec3 color;" +
                   "void main() {" +
                   "    gl_FragColor = vec4(color, 1.0);" +
                   "}";
        context.program = WebGLUtils.loadShaderProgram(context, vertex, frag);
        var prog = context.program;
        context.useProgram(prog);
        prog.position_handle = context.getAttribLocation(prog, "a_position");
        prog.color_handle = context.getAttribLocation(prog, "a_color");
        context.enableVertexAttribArray(prog.position_handle);
        prog.modelview_handle = context.getUniformLocation(prog, "u_modelview");
        prog.projection_handle = context.getUniformLocation(prog, "u_projection");
        prog.ctm_handle = context.getUniformLocation(prog, "u_ctm");
    };

    var initializeGL = function(context) {
        context.clearColor(1.0, 1.0, 1.0, 1.0);
        // TODO: depth test, blending  and stuff
        context.enable(context.DEPTH_TEST);
        loadShaderProgram(context);
        context.viewport(0, 0, context.viewportWidth, context.viewportHeight);
    };

    var initializeBuffers1 = function(renderer) {
        var gl = renderer.contexts[0];

        // create the buffer that holds the grid
        renderer.grid = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, renderer.grid);
        var grid = [];
        var x, z;
        var width = 2.0;
        var segments = 12.0;
        x = -width * segments/2.0;
        z = x;
        for (var i = 0; i <= segments; i++) {
            grid.push(x, 0, z);
            grid.push(0, 0, 0);
            grid.push(x + segments*width, 0, z);
            grid.push(0, 0, 0);
            z += width;
        }
        z = x;
        for (var i = 0; i <= segments; i++) {
            grid.push(x, 0, z);
            grid.push(0, 0, 0);
            grid.push(x, 0, z + segments*width);
            grid.push(0, 0, 0);
            x += width;
        }

        // add major axes
        // x-axis
        grid.push(0,0,0); grid.push(0,0,1);
        grid.push(3,0,0); grid.push(0,0,1);

        // y-axis
        grid.push(0,0,0); grid.push(0,1,0);
        grid.push(0,3,0); grid.push(0,1,0);

        // z-axis
        grid.push(0,0,0); grid.push(1,0,0);
        grid.push(0,0,3); grid.push(1,0,0);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid), gl.STATIC_DRAW);
        renderer.grid.itemSize = 6;
        renderer.grid.numItems = grid.length/6;
    };

    this.initializeCameras = function() {
        this.dolleyCamera = new Camera();
        this.dolleyCamera.lookAt(4,4,4, 0,0,0, 0,1,0);
        this.resize();
    };

    this.identity = new J3DIMatrix4();
    this.identity.makeIdentity();
    // renders to the primary canvas
    this.renderContext1 = function() {
        var gl = this.contexts[0];
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(gl.program);

        // render grid
        gl.disable(gl.DEPTH_TEST);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.grid);
        gl.vertexAttribPointer(gl.program.position_handle, 3, gl.FLOAT, false, 4 * renderer.grid.itemSize, 0);
        gl.enableVertexAttribArray(gl.program.position_handle);
        gl.vertexAttribPointer(gl.program.color_handle, 3, gl.FLOAT, false, 4 * renderer.grid.itemSize, 4*3);
        gl.enableVertexAttribArray(gl.program.color_handle);
        gl.uniformMatrix4fv(gl.program.modelview_handle, false, this.dolleyCamera.modelview.getAsFloat32Array());
        gl.uniformMatrix4fv(gl.program.projection_handle, false, this.dolleyCamera.projection.getAsFloat32Array());
        gl.uniformMatrix4fv(gl.program.ctm_handle, false, this.identity.getAsFloat32Array());
        gl.drawArrays(gl.LINES, 0, this.grid.numItems);
        gl.enable(gl.DEPTH_TEST);

        gl.flush();
    };

    // renders to the secondary canvas
    this.renderContext2 = function() {

    };

    this.render = function() {
        this.renderContext1();
        this.renderContext2();
    };

    this.resize = function() {
        var cw1 = $('#frustum-canvas')[0].clientWidth,
            ch1 = $('#frustum-canvas')[0].clientHeight;
        
        $('#frustum-canvas')[0].width = cw1;
        $('#frustum-canvas')[0].height = ch1;

        this.contexts[0].viewportWidth = cw1;
        this.contexts[0].viewportHeight = ch1;
        this.contexts[0].viewport(0, 0, cw1, ch1);
        this.dolleyCamera.perspective(45, cw1/ch1, 0.1, 1000);
    };

    this.mouseIsDown = false;
    this.handleMouseDown = function(event) {
        this.oldMouseX = event.x;
        this.oldMouseY = event.y;
        this.mouseIsDown = true;
    };

    this.handleMouseMove = function(event) {
        if (this.oldMouseX != undefined && this.mouseIsDown) {
            this.dolleyCamera.originOrbitingRotate(event.x - this.oldMouseX, -event.y + this.oldMouseY);
            this.oldMouseX = event.x;
            this.oldMouseY = event.y;
        }
    };

    this.handleMouseUp = function(event) {
        this.mouseIsDown = false;
    };

    this.handleMouseWheel = function(event) {
        this.dolleyCamera.originOrbitingLookVectorTranslate(0.0005 * event.wheelDelta);
    };

    initializeGL(this.contexts[0]);
    initializeBuffers1(this);
    // TODO: initializeBuffers2
    this.initializeCameras();
}

var timeAtLastFrame = new Date().getTime();
var idealTimePerFrame = 1000 / 30;
var leftover = 0.0;
var frames = 0;

function tick() {

    var timeAtThisFrame = new Date().getTime();
    var timeSinceLastDoLogic = (timeAtThisFrame - timeAtLastFrame) + leftover;
    var catchUpFrameCount = Math.floor(timeSinceLastDoLogic / idealTimePerFrame);
/*
    for(i = 0 ; i < catchUpFrameCount; i++){
        controller.doLogic();
        frames++;
    }
*/
    renderer.render();

    leftover = timeSinceLastDoLogic - (catchUpFrameCount * idealTimePerFrame);
    timeAtLastFrame = timeAtThisFrame;
}

