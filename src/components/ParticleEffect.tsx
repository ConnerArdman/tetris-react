import { useEffect, useState } from 'react';
import { Block, EmptyCell } from '../types';

interface Props {
  rowIndex: number;
  blocks: (Block | EmptyCell)[];
}

function ParticleEffect({ rowIndex, blocks }: Props) {
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
      block === EmptyCell.Empty ? [] : Array.from({ length: 3 }).map((_, i) => ({
        id: colIndex * 3 + i,
        x: colIndex * 32 + 16,  // Center of the cell
        y: rowIndex * 32 + 16, // Center of the cell
        tx: (Math.random() - 0.5) * 100, // Wider spread
        ty: (Math.random() - 0.5) * 100, // Wider spread
        block: block as Block
      }))
    );
    console.log('Generated particles:', newParticles);
    console.log('Row index:', rowIndex);
    console.log('Blocks:', blocks);
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [blocks, rowIndex]);

  return (
    <div className="particle-effect-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle cell ${particle.block}`}
          style={{
            left: particle.x + 'px',
            top: particle.y + 'px',
            ['--tx' as string]: particle.tx + 'px',
            ['--ty' as string]: particle.ty + 'px',
            opacity: 1
          }}
          data-block-type={particle.block}
        />
      ))}
    </div>
  );
}

export default ParticleEffect;
