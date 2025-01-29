import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

main();

//
// 시작
//
function main() {
  const canvas = document.querySelector("#glcanvas");
  // GL 컨텍스트 초기화
  const gl = canvas.getContext("webgl");

  // WebGL 사용 가능 및 작동 여부 확인
  if (!gl) {
    alert(
      "WebGL을 초기화할 수 없습니다. 브라우저 또는 기기가 지원하지 않을 수 있습니다."
    );
    return;
  }

  // 클리어 색상을 검은색, 완전 불투명으로 설정
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 지정된 클리어 색상으로 색상 버퍼 클리어
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 정점 쉐이더 프로그램

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // 프래그먼트 쉐이더 프로그램

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // 쉐이더 프로그램 초기화; 정점 및 그 밖의 모든 조명 설정
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // 쉐이더 프로그램 사용에 필요한 모든 정보 수집
  // 쉐이더 프로그램이 사용하는 속성 조회
  // aVertexPosition, aVertexColor 및 그 밖의 모든 조명 설정
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // 여기서 모든 객체를 그리기 위해 호출되는 루틴
  const buffers = initBuffers(gl);

  // 장면 그리기
  drawScene(gl, programInfo, buffers);
}

//
// 쉐이더 프로그램 초기화, WebGL이 데이터를 그리는 방법 알기
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // 쉐이더 프로그램 생성

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // 쉐이더 프로그램 생성 실패 시 경고, 예외처리

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `쉐이더 프로그램을 초기화할 수 없습니다: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

//
// 주어진 유형의 쉐이더 생성, 소스 업로드 및 컴파일
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // 소스를 쉐이더 객체로 전송

  gl.shaderSource(shader, source);

  // 쉐이더 프로그램 컴파일

  gl.compileShader(shader);

  // 성공적으로 컴파일되었는지 확인

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`쉐이더 컴파일 오류: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
