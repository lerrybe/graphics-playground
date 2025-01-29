function drawScene(gl, programInfo, buffers) {
  // 초기화
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 원근 행렬을 생성, 이는 카메라의 원근감 왜곡을 시뮬레이션하는 데 사용되는 특수 행렬
  // 시야각은 45도이며, 종횡비는 캔버스의 표시 크기와 일치
  // 카메라로부터 0.1 단위에서 100 단위 사이에 있는 물체만 보이게 됨
  const fieldOfView = (45 * Math.PI) / 180; // 라디안 단위
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // 참고: glmatrix.js는 항상 첫 번째 인자를 결과를 받을 대상으로 사용
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 그리기 위치를 장면의 중심인 항등 위치로 설정
  const modelViewMatrix = mat4.create();

  // 이제 사각형을 그리기 시작할 위치로 그리기 위치를 이동
  mat4.translate(
    modelViewMatrix, // 대상 행렬
    modelViewMatrix, // 이동할 행렬
    [-0.0, 0.0, -6.0] // 이동할 양
  );

  // WebGL에게 위치 버퍼에서 vertexPosition 속성으로 위치를 가져오는 방법을 알려줌
  setPositionAttribute(gl, buffers, programInfo);
  setColorAttribute(gl, buffers, programInfo);

  // 그리기 시 커스텀 프로그램을 사용하도록 지시
  gl.useProgram(programInfo.program);

  // 셰이더 유니폼 설정
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// WebGL에게 위치 버퍼에서 vertexPosition 속성으로 위치를 가져오는 방법 노티
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2; // 반복당 2개의 값을 가져옴
  const type = gl.FLOAT; // 버퍼의 데이터는 32비트 부동소수점
  const normalize = false; // 정규화하지 않음
  const stride = 0; // 한 세트의 값에서 다음 세트로 가는데 필요한 바이트 수
  // 0 = 위의 type과 numComponents 사용
  const offset = 0; // 버퍼 내에서 시작할 바이트 위치
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// WebGL에게 색상 버퍼에서 vertexColor 속성으로 색상을 가져오는 방법 노티
function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export { drawScene };
