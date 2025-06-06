import { useEffect, useRef } from "react";

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Neural network nodes
    const nodes = [
      { x: 0.1, y: 0.2, radius: 3, color: "#00FFFF", opacity: 0.8 },
      { x: 0.3, y: 0.15, radius: 4, color: "#8B5CF6", opacity: 0.6 },
      { x: 0.6, y: 0.25, radius: 2, color: "#06FFA5", opacity: 0.9 },
      { x: 0.8, y: 0.3, radius: 3, color: "#FF00FF", opacity: 0.7 },
      { x: 0.9, y: 0.5, radius: 4, color: "#00FFFF", opacity: 0.5 },
      { x: 0.7, y: 0.7, radius: 3, color: "#8B5CF6", opacity: 0.8 },
      { x: 0.4, y: 0.8, radius: 2, color: "#06FFA5", opacity: 0.6 },
      { x: 0.2, y: 0.6, radius: 4, color: "#FF00FF", opacity: 0.7 },
    ];

    // Neural connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
      [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 0], [7, 1]
    ];

    let animationTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      animationTime += 0.01;

      // Draw connections
      connections.forEach(([startIdx, endIdx]) => {
        const start = nodes[startIdx];
        const end = nodes[endIdx];
        
        const startX = start.x * canvas.width + Math.sin(animationTime + startIdx) * 20;
        const startY = start.y * canvas.height + Math.cos(animationTime + startIdx) * 15;
        const endX = end.x * canvas.width + Math.sin(animationTime + endIdx) * 20;
        const endY = end.y * canvas.height + Math.cos(animationTime + endIdx) * 15;

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, start.color + "80");
        gradient.addColorStop(0.5, "#06FFA560");
        gradient.addColorStop(1, end.color + "40");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Create curved line
        const midX = (startX + endX) / 2 + Math.sin(animationTime * 2) * 30;
        const midY = (startY + endY) / 2 + Math.cos(animationTime * 2) * 30;
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, index) => {
        const x = node.x * canvas.width + Math.sin(animationTime + index) * 20;
        const y = node.y * canvas.height + Math.cos(animationTime + index) * 15;
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, node.radius * 4);
        glowGradient.addColorStop(0, node.color + "60");
        glowGradient.addColorStop(1, node.color + "00");
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner node
        const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, node.radius);
        nodeGradient.addColorStop(0, node.color);
        nodeGradient.addColorStop(1, node.color + "80");
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(x, y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="neural-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        opacity: 0.3,
        pointerEvents: "none"
      }}
    />
  );
}
