'use client';

import { useDraggable } from '@dnd-kit/core';

const blocks = [{ type: 'text', label: 'Text Block' }];

function SidebarItem({ type, label }: { type: string; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, from: 'sidebar' },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2 border rounded bg-white cursor-grab transition-opacity ${isDragging ? 'opacity-50' : ''}`}
    >
      {label}
    </div>
  );
}

export default function BlockSidebar() {
  return (
    <aside className="w-48 shrink-0 border-r p-2 space-y-2 bg-gray-100">
      {blocks.map((b) => (
        <SidebarItem key={b.type} {...b} />
      ))}
    </aside>
  );
}
