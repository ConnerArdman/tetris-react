import { useEffect, useState } from 'react';
import { Block, EmptyCell } from '../types';

interface Props {
  rowIndex: number;
  blocks: (Block | EmptyCell)[];
}

export default function ParticleEffect({ rowIndex, blocks }: Props) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    tx: number;
    ty: number;
    block: Block;
  }>>([]);

  useEffect(() => {
    const newParticles = blocks.flatMap((block, colIndex) => 
      Array.from({ length: 3 }).map((_, i) => ({
        id: colIndex * 3 + i,
        x: colIndex * 32,
        y: rowIndex * 32,
        tx: (Math.random() - 0.5) * 60,
        ty: (Math.random() - 0.5) * 60,
        block
      }))
    );
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [blocks, rowIndex]);

  return (
    <div className="particle-effect-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle cell ${particle.block}`}
          style={{
            left: particle.x + 'px',
            top: particle.y + 'px',
            ['--tx' as string]: particle.tx + 'px',
            ['--ty' as string]: particle.ty + 'px'
          }}
        />
      ))}
    </div>
  );
}

export default ParticleEffect;
