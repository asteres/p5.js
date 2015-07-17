'use strict';

var p5 = require('../core/core');

p5.Renderer3D.prototype.primitives2D = function(arr){

  var gl = this.GL;
  var shaderProgram = this.getColorVertexShader();

  //create vertice buffer
  var vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  //create vertexcolor buffer
  var vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var color = this.colorStack[this.colorStack.length-1] || [0.5, 0.5, 0.5, 1.0];
  var colors = [];
  for(var i = 0; i < arr.length / 3; i++){
    colors = colors.concat(color);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
    4, gl.FLOAT, false, 0, 0);

  //matrix
  var mId = 'vertexColorVert|vertexColorFrag';
  this.setMatrixUniforms(mId);
};

p5.Renderer3D.prototype.point = function(x, y, z){
  var gl = this.GL;
  this.primitives2D([x, y, z]);
  gl.drawArrays(gl.POINTS, 0, 1);
  return this;
};

p5.Renderer3D.prototype.line = function(x1, y1, z1, x2, y2, z2){
  var gl = this.GL;
  this.primitives2D([x1, y1, z1, x2, y2, z2]);
  gl.drawArrays(gl.LINES, 0, 2);
  return this;
};

p5.Renderer3D.prototype.triangle = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3){
  var gl = this.GL;
  this.primitives2D([x1, y1, z1, x2, y2, z2, x3, y3, z3]);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  return this;
};

p5.Renderer3D.prototype.quad = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4){
  var gl = this.GL;
  this.primitives2D(
    [x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4]);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return this;
};

p5.Renderer3D.prototype.beginShape = function(mode){
  this.modeStack.push(mode);
  this.verticeStack = [];
  return this;
};

p5.Renderer3D.prototype.vertex = function(x, y, z){
  this.verticeStack.push(x, y, z);
  return this;
};

p5.Renderer3D.prototype.endShape = function(){
  var gl = this.GL;
  this.primitives2D(this.verticeStack);
  this.verticeStack = [];
  var mode = this.modeStack.pop();
  switch(mode){
    case 'POINTS':
      gl.drawArrays(gl.POINTS, 0, 1);
      break;
    case 'LINES':
      gl.drawArrays(gl.LINES, 0, 2);
      break;
    case 'TRIANGLES':
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      break;
    case 'TRIANGLE_STRIP':
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      break;
    default:
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      break;
  }
  return this;
};

module.exports = p5.Renderer3D;