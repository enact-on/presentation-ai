'use client';

import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import BlockSidebar from './BlockSidebar';
import { useBuilderStore } from '@/states/builder-state';
import type { BuilderBlock } from '@/states/builder-state';

const snap = (v: number) => Math.round(v / 10) * 10;

function DraggableBlock({ block }: { block: BuilderBlock }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  return (
    <div
      ref={setNodeRef}
      style={{
        top: block.y,
        left: block.x,
        position: 'absolute',
        transform: CSS.Translate.toString(transform),
        color: block.color,
      }}
      className={`cursor-move px-2 py-1 border rounded bg-white transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
      {...listeners}
      {...attributes}
      onClick={() => selectBlock(block.id)}
    >
      {block.text}
    </div>
  );
}

export default function BuilderCanvas() {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const blocks = useBuilderStore((s) => s.blocks);
  const addBlock = useBuilderStore((s) => s.addBlock);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const selected = useBuilderStore((s) => s.blocks.find((b) => b.id === s.selectedId));
  const updateBlock = useBuilderStore((s) => s.updateBlock);
  const selectBlock = useBuilderStore((s) => s.selectBlock);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta, activatorEvent } = event;
    if (!over || over.id !== 'canvas') return;

    if (String(active.id).startsWith('sidebar-')) {
      const type = active.data.current?.type as string;
      const { clientX, clientY } = activatorEvent as MouseEvent;
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      const x = snap(clientX - canvasRect.left);
      const y = snap(clientY - canvasRect.top);
      addBlock({ id: nanoid(), type, x, y, text: 'New block', color: '#000000' });
    } else {
      const id = active.id as string;
      const block = blocks.find((b) => b.id === id);
      if (!block) return;
      const x = snap(block.x + delta.x);
      const y = snap(block.y + delta.y);
      moveBlock(id, x, y);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex w-full h-full">
        <BlockSidebar />
        <div
          ref={(el) => {
            setNodeRef(el);
            canvasRef.current = el;
          }}
          className={`relative flex-1 bg-gray-50 min-h-[400px] border ${
            isOver ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          {blocks.map((block) => (
            <DraggableBlock key={block.id} block={block} />
          ))}
          {selected && (
            <div className="absolute top-2 right-2 w-48 bg-white p-2 border rounded shadow">
              <div className="mb-2">
                <label className="block text-sm">Text</label>
                <input
                  className="border w-full px-1"
                  value={selected.text ?? ''}
                  onChange={(e) => updateBlock(selected.id, { text: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm">Color</label>
                <input
                  type="color"
                  value={selected.color ?? '#000000'}
                  onChange={(e) => updateBlock(selected.id, { color: e.target.value })}
                />
              </div>
              <button
                className="text-sm text-red-500"
                onClick={() => selectBlock(undefined)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
