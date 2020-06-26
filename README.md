## WebGL_Tutorial
**WebGL API for texture**
>  소프트웨어학과 201723274 이서현

*  Texture Mapping vs Geometric Modeling

    Geometric modeling은 각각의 vertex에 color value를 할당한다. 하지만 texture mapping에 비해서는 현실감이 떨어진다.
    Texture mapping은 표면에 image를 두르는 것으로 적은 비용으로 현실감있게 표현이 가능하다.
    
    
    
*  Texture mapping 이용하기

   1.load image
   
        var image = new Image();
        image.src = "s.png";
        image.addEventListener('load', function() {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                });
    
    2.fragment shader에 text coordinate를 정의한다.
    
    
        var fragmentShaderSource = '\
            varying highp vec4 color; \
            varying mediump vec2 texCoord;\
			uniform sampler2D sampler2d;\
			void main(void) \
			{ \
				gl_FragColor = 0.3 * color + 0.7 * texture2D(sampler2d,texCoord);\
			}';

    3.vertex shader에는 text coordinate인 u,v를 선언한다.
    
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

    4.bind texture
     
         gl.bindAttribLocation(gl.programObject, 2, "myUV");
 
    5.Texture filtering and mipmapping
    
     glTexParameter{i,v}(GLenum target, GLenum pname, GL{type}param) 을 이용한다.
        
        target - GL_TEXTURE_2D, GL_TEXTURE_CUBE_MAP
        pname & params
            - GL_TEXTURE_MAG_FILTER : GL_NEAREST, GL_LINEAR
            - GL_TEXTURE_MIN_FILTER : GL_NEAREST, GL_LINEAR, GL_NEAREST_MINMAP_NEAREST
                                     ,GL_NEAREST_MINMAP_LINEAR. GL_LINEAR_MIPMAP_NEAREST
                                     , GL_LINEAR_MIPMAP_LINEAR
            - GL_TEXTURE_WRAP_S, GL_TEXTURE_WRAP_T
                                     : GL_REPEATER, GL_CLAMP_TO_EDGE, GL_MIRRORED_REPEAT
                                     
                                     
        
       화면의 라디오버튼에서 S ,T 각각 다른 타입의 param을 적용할 수 있다.
       ![image](/uploads/6f3c1aa3a16e55bc391a99e4d60b8dfc/image.png)
       
        (1) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
             
             cube의 u,v의 값을 보고 image를 반복한 결과이다.
             ![image](/uploads/414827f0e35888242eba66957cb838ec/image.png)
             
             
        (2) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             
             0보다 작은 것은 0이고 1보다 큰 값은 1이라고 설정한다.
             ![image](/uploads/b9b48719320c7d708a630f0fcdcbd3f4/image.png)
             
        (3) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
              u,v의 값을 반복하여 맵핑한다.
              <img src="/uploads/9b522bec402c1d0bb1bd0e27b7581f2e/image_2.png">
              
        
        (4) 가장 흥미로웠던 image
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              ![image](/uploads/6842e68218834f4338fad7532e2789bd/image.png)
              
              
**Texture mapping을 자세히 관찰하기 위해 구현한 기능들**

   1.  Mouse drag interface 
    

    마우스의 움직임에 따라 큐브를 회전할 수 있다.
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


   2.  Rotation

[1,1,0]인 축을 중심으로 큐브를 회전시킨다.
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



   3.  Translation
              

mMatrix를 cube가 translation할 수 있도록 수정한다.
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
    
**Copyright**
CC-NC-BY) Lee Seohyun 2020

 **Refernece**
 
 -quaternion
 https://git.ajou.ac.kr/hwan/webgl-tutorial/-/tree/master/basic_course/quaternion
 
 -texture information
 https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
 
 -HTML radio button
 https://ungdoli0916.tistory.com/448

 -Image
 https://unsplash.com/photos/whEuq9Fkpy4
 
 -Rotation
  https://git.ajou.ac.kr/hwan/webgl-tutorial/-/blob/master/student2019/201523484/webgl.js     