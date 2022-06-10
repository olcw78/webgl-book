let gl;
let canvas;
let shaderProgram;
let vertexBuffer;

function createGLContext(canvas) {
  const names = ["webgl", "experimental-webgl"];
  let context = null;
  names.forEach(name => {
    try {
      context = canvas.getContext(name);
    } catch (error) {
      throw error;
    }

    if (context) return;
  });

  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("failed to create WebGL context!");
  }

  return context;
}

function loadShader(type, shaderSrc) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error compiling shader! " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

function setupShaders() {
  const vtxShaderSrc = `
            attribute vec3 aVtxPos;
            void main() {
                gl_Position = vec4(aVtxPos, 1.0);
            }
        `;

  const fragShaderSrc = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `;

  const vtxShader = loadShader(gl.VERTEX_SHADER, vtxShaderSrc);
  const fragShader = loadShader(gl.FRAGMENT_SHADER, fragShaderSrc);
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vtxShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVtxPos"
  );
}

function setupBuffers() {
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const triangleVertices = [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  );

  vertexBuffer.itemSize = 3;
  vertexBuffer.numberOfItems = 3;
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    vertexBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
}

function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders();
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  draw();
}
