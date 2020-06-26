var gl;

function testGLError(functionLastCalled) {
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}



var shaderProgram;
var vertexData = [
    // Backface (RED/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  0.0,  0.0,  
     0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  1.0,  1.0, 
     0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  1.0, -0.0,
    -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0, -0.0, -0.0, 
    -0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0, -0.0,  1.0, 
     0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
    // Front (BLUE/WHITE) -> z = 0.5      
    -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  1.0, 1.0, 
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  0.0, 0.0, 
     0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  0.0, 1.0, 
    -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  1.0, 1.0, 
    -0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  1.0,  0.0, 
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  0.0,  0.0,  
    // LEFT (GREEN/WHITE) -> z = 0.5     
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
    -0.5,  0.5,  0.5,  0.0, 1.0, 0.0, 1.0,  1.0,  1.0, 
    -0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0,  1.0,  0.0, 
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
    -0.5, -0.5,  0.5,  0.0, 1.0, 0.0, 1.0, -0.0,  1.0, 
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
    // RIGHT (YELLOE/WHITE) -> z = 0.5    
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
     0.5,  0.5,  0.5,  1.0, 1.0, 0.0, 1.0,  1.0,  1.0, 
     0.5,  0.5, -0.5,  1.0, 1.0, 0.0, 1.0,  1.0,  0.0, 
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0, -0.0,  1.0, 
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
    // BOTTON (MAGENTA/WHITE) -> z = 0.5 
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, -0.0, -0.0, 
     0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0,  1.0,  1.0, 
     0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,  1.0,  0.0, 
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, -0.0, -0.0, 
    -0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, -0.0,  1.0, 
     0.5, -0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
    // TOP (CYAN/WHITE) -> z = 0.5       
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, -0.0, -0.0, 
     0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0, 
     0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  0.0, 
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, -0.0, -0.0, 
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0, -0.0,  1.0, 
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0 
];
var elementData = [ 0,1,2,3,4,5];

function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        var image = new Image();
        image.src = "s.png";
        //image.crossOrigin="http";
        image.addEventListener('load', function() {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                });




    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
            varying highp vec4 color; \
            varying mediump vec2 texCoord;\
			uniform sampler2D sampler2d;\
			void main(void) \
			{ \
				gl_FragColor = 0.3 * color + 0.7 * texture2D(sampler2d,texCoord);\
			}';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = '\
			attribute highp vec4 myVertex; \
            attribute highp vec4 myColor; \
            attribute highp vec2 myUV; \
			uniform mediump mat4 mMat; \
			uniform mediump mat4 vMat; \
			uniform mediump mat4 pMat; \
            varying  highp vec4 color;\
            uniform mediump mat4 projMatrix; \
            varying mediump vec2 texCoord;\
	     void main(void)  \
	     {\
		gl_Position = pMat * vMat * mMat * myVertex; \
		gl_PointSize = 8.0; \
                color = myColor; \
                texCoord = myUV*3.0; \
        	}';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    gl.bindAttribLocation(gl.programObject, 2, "myUV");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);
    // console.log("myVertex Location is: ", gl.getAttribLocation(gl.programObject, "myColor"));

    return testGLError("initialiseShaders");
}



var mMat = [1.0, 0.0, 0.0, 0.0, 
			0.0, 1.0, 0.0, 0.0, 
			0.0, 0.0, 1.0, 0.0, 
			0.0, 0.0, 0.0, 1.0]; 
rotX = 0.0;
rotY = 0.0;
xAxis = [1.0, 0.0, 0.0];
yAxis = [0.0, 1.0, 0.0];

btnRotPlus = 0; 
function Rotate()
{
	btnRotPlus = 1; 
}

btnRotmius = 0; 
function inverseR()
{
	btnRotmius= 1; 
}


function Stop()
{
    btnRotPlus = 0; 
	btnRotmius= 0; 
}
var move=0.3;

function Right(){
    mMat[0] = 1;
    mMat[1] = 0;
    mMat[2] = 0;
    mMat[3] = 0;
    mMat[4] = 0;
    mMat[5] = 1;
    mMat[6] = 0;
    mMat[7] = 0;
    mMat[8] = 0;
    mMat[9] = 0;
    mMat[10] = 1;
    mMat[11] = 0;
    mMat[12] = move;
    mMat[13] = 0;
    mMat[14] = 0;
    mMat[15] = 1;

    move+=0.3;
}

function Left(){
    move-=0.3;
    mMat[0] = 1;
    mMat[1] = 0;
    mMat[2] = 0;
    mMat[3] = 0;
    mMat[4] = 0;
    mMat[5] = 1;
    mMat[6] = 0;
    mMat[7] = 0;
    mMat[8] = 0;
    mMat[9] = 0;
    mMat[10] = 1;
    mMat[11] = 0;
    mMat[12] = move;
    mMat[13] = 0;
    mMat[14] = 0;
    mMat[15] = 1;
}
var EPSILON = 0.000001;
function rotaY(out, rad) {
    var x = 1,
        y = 1,
        z = 0;
    var len = Math.hypot(x, y, z);
    var s, c, t;

    if (len < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c; // Perform rotation-specific matrix multiplication

    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}


// q = quat.create(); // q = [ 0.0, 0.0, 0.0, 1.0]; 
// q = [0.26, 0.0, 0.0, 0.97];

dragging = false; 

function renderScene() {

	var prevx,prevy;
	function doMouseDown(evt) {
		if (dragging)
           return;
		dragging = true;
        document.addEventListener("mousemove", doMouseDrag, false);
        document.addEventListener("mouseup", doMouseUp, false);
        var box = canvas.getBoundingClientRect();
        prevx = window.pageXOffset + evt.clientX - box.left;
        prevy = window.pageYOffset + evt.clientY - box.top;
	}
	function doMouseDrag(evt) {
        if (!dragging)
           return;
		console.log("Here");
        var box = canvas.getBoundingClientRect();
        var x = window.pageXOffset + evt.clientX - box.left;
        var y = window.pageYOffset + evt.clientY - box.top;
		console.log(x,y, prevx, prevy); 
		rotY = (x-prevx)/100.0; 
		rotX = (y-prevy)/100.0;

		// vec3.transformMat4(xAxis, xAxis, mMat); 
		// vec3.transformMat4(yAxis, yAxis, mMat); 
		console.log(yAxis, xAxis);
		mat4.rotate(mMat, mMat, rotY, yAxis); 
		mat4.rotate(mMat, mMat, rotX, xAxis); 

        prevx = x;
        prevy = y;
	}
	function doMouseUp(evt) {
		 if (dragging) {
            document.removeEventListener("mousemove", doMouseDrag, false);
            document.removeEventListener("mouseup", doMouseUp, false);
		 }
		dragging = false; 
	}

    var canvas = document.getElementById("helloapicanvas");
	canvas.addEventListener("mousedown", doMouseDown, false);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);										// Added for depth Test 

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	// Added for depth Test 
	gl.enable(gl.DEPTH_TEST);								// Added for depth Test 

    var mMatLocation = gl.getUniformLocation(gl.programObject, "mMat");
    var vMatLocation = gl.getUniformLocation(gl.programObject, "vMat");
    var pMatLocation = gl.getUniformLocation(gl.programObject, "pMat");
	var q = [];
	console.log(rotX, rotY); 

	if ( btnRotPlus ){
        rotY += 0.01;
        rotaY(mMat, rotY);
    }
    
    if ( btnRotmius ){
        rotY -= 0.01;
        rotaY(mMat, rotY);
	}

var check_count = document.getElementsByName("wrap_s").length;
 var wS=gl.REPEAT ; var wT=gl.REPEAT;
	for (var i=0; i<check_count; i++) {
		if (document.getElementsByName("wrap_s")[i].checked == true) {
			if(i==0) wS=gl.REPEAT;
			else if(i==1) wS=gl.CLAMP_TO_EDGE;
			else wS=gl.MIRRORED_REPEAT;
		}
	}

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wS);

var check_count = document.getElementsByName("wrap_t").length;

	for (var i=0; i<check_count; i++) {
    if (document.getElementsByName("wrap_t")[i].checked == true) {
        if(i==0) wT=gl.REPEAT;
        else if(i==1) wT=gl.CLAMP_TO_EDGE;
        else wT=gl.MIRRORED_REPEAT;
    }
}
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wT);

    
	var vMat = [];
	mat4.lookAt(vMat, [0.0, 0.0, 2.0], [0.0,0.0,0.0], [0.0, 1.0, 0.0]);
	var pMat = [];
	mat4.identity(pMat); 
	mat4.perspective(pMat, 3.14/2.0, 800.0/600.0, 0.5, 5);
	// console.log("pMAT:", pMat);

    gl.uniformMatrix4fv(mMatLocation, gl.FALSE, mMat );
    gl.uniformMatrix4fv(vMatLocation, gl.FALSE, vMat );
    gl.uniformMatrix4fv(pMatLocation, gl.FALSE, pMat );

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }
	//vertexData[0] += 0.01; 

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 36, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);
	//gl.vertexAttrib4f(1, 1.0, 0.0, 1.0, 1.0);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

	gl.drawArrays(gl.TRIANGLES, 0, 36); 
	// gl.drawArrays(gl.LINE_STRIP, 0, 36); 
    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

	// renderScene();
    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
