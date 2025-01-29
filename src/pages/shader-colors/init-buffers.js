function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);

  const colorBuffer = initColorBuffer(gl);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

function initPositionBuffer(gl) {
  // 사각형의 위치를 위한 버퍼 생성
  const positionBuffer = gl.createBuffer();

  // positionBuffer를 버퍼 작업에 적용할 대상으로 선택
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 사각형의 위치를 위한 배열 생성
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  // 위치 목록을 WebGL에 전달하여 모양을 빌드
  // 이는 JavaScript 배열에서 Float32Array를 생성하고 현재 버퍼를 채우는 것
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initColorBuffer(gl) {
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

export { initBuffers };
