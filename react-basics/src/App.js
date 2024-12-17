import "./App.css";
import { useEffect, useRef, useState } from "react";

const handleContextMenu = (e) => {
  e.preventDefault();
};

const sendToBackById = (elements, targetId) => {
  const index = elements.findIndex((obj) => obj.id === targetId);
  if (index > -1) {
    const [item] = elements.splice(index, 1);
    elements.push(item);
  }
  return elements;
};

function App() {
  const canvasRef = useRef(null);
  // remove context menu
  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const [circles, setCircles] = useState([
    {
      id: "left",
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      backgroundColor: "blue",
    },
    {
      id: "right",
      startX: 0,
      startY: 0,
      height: 0,
      width: 0,
      backgroundColor: "blue",
    },
  ]);

  const [currentCircle, setCurrentCircle] = useState(null);

  const doElementsOverlap = (circle1, circle2) => {
    const r1 = circle1.width / 2;
    const r2 = circle2.width / 2;

    const center1 = { x: circle1.x + r1, y: circle1.y + r1 };
    const center2 = { x: circle2.x + r2, y: circle2.y + r2 };

    const dis = Math.sqrt(
      Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2)
    );

    if (dis < r1 + r2) return true;

    return false;
  };

  const onMouseDownHandler = (e) => {
    const currentId = e.button === 0 ? "left" : "right";
    setCurrentCircle(currentId);
    const { clientX, clientY } = e;

    // set the initial circle size
    let newCircles = circles.map((circle) => {
      if (circle.id === currentId)
        return {
          ...circle,
          startX: clientX,
          startY: clientY,
          x: clientX,
          y: clientY,
          height: 0,
          width: 0,
        };

      return circle;
    });

    const doCirclesOverlap = doElementsOverlap(newCircles[0], newCircles[1]);

    newCircles = newCircles.map((circle) => ({
      ...circle,
      backgroundColor: doCirclesOverlap ? "red" : "blue",
    }));

    setCircles(newCircles);
  };

  const onMouseDragHandler = (event) => {
    if (currentCircle === null) return;

    // get the radius of the circle
    const { clientX, clientY } = event;

    const updated = circles.map((circle) => {
      if (circle.id === currentCircle) {
        const dx = clientX - circle.startX;
        const dy = clientY - circle.startY;
        const diameter = Math.max(Math.abs(dx), Math.abs(dy));

        const left = dx < 0 ? circle.startX - diameter : circle.startX;
        const top = dy < 0 ? circle.startY - diameter : circle.startY;

        return {
          ...circle,
          height: diameter,
          width: diameter,
          x: left,
          y: top,
          backgroundColor: "blue",
        };
      }

      return circle;
    });

    const doCirclesOverlap = doElementsOverlap(updated[0], updated[1]);

    let newCircles = updated.map((circle) => {
      if (circle.id == currentCircle)
        return {
          ...circle,
          backgroundColor: doCirclesOverlap ? "red" : "blue",
        };
      return circle;
    });
    newCircles = sendToBackById(newCircles, currentCircle);
    setCircles(newCircles);
  };

  const onMouseLeaveHandler = () => {
    setCurrentCircle(null);
  };

  return (
    <canvas ref={canvasRef}
      onMouseDown={onMouseDownHandler}
      onMouseMove={onMouseDragHandler}
      onMouseUp={onMouseLeaveHandler}
    >
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="circle"
          style={{
            height: `${circle.height}px`,
            width: `${circle.width}px`,
            left: circle.x,
            top: circle.y,
            backgroundColor: circle.backgroundColor,
          }}
        ></div>
      ))}
    </canvas>
  );
}

export default App;
