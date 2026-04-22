import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";

const CanvasBoard = forwardRef(({ setPoints }, ref) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // ✅ FIXED: define first
  const drawPerfectShape = (shape) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "blue";   // make it visible
    ctx.lineWidth = 3;

    if (shape.type === "line") {
      const [start, end] = shape.points;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }

    if (shape.type === "rectangle") {
      const [p1, p2] = shape.points;
      const width = p2.x - p1.x;
      const height = p2.y - p1.y;
      ctx.rect(p1.x, p1.y, width, height);
    }

    if (shape.type === "circle") {
      ctx.moveTo(shape.center.x + shape.radius, shape.center.y); // ✅ fix
      ctx.arc(
        shape.center.x,
        shape.center.y,
        shape.radius,
        0,
        2 * Math.PI
      );
    }

    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
  };

  // ✅ now safe to expose
  useImperativeHandle(ref, () => ({
    drawPerfectShape,
    clearCanvas
  }));

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));

    setDrawing(true);
  };

  const endDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.closePath();
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = getX(e);
    const y = getY(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    setPoints((prev) => [...prev, { x, y }]);
  };

  const getX = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return e.clientX - rect.left;
  };

  const getY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return e.clientY - rect.top;
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onMouseLeave={endDrawing}
      />
      <br />
      <button onClick={clearCanvas}>Clear</button>
    </div>
  );
});

export default CanvasBoard;