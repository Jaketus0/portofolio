'use client';
import { NodeViewWrapper } from '@tiptap/react';
import { Node } from '@tiptap/core';
import React, { useState } from 'react';
import { ImageCropper } from './ImageCropper';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (attrs: { src: string; width?: string }) => ReturnType;
    };
  }
}

export const ResizableImage = Node.create({
  name: 'resizableImage',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: '100%' },
    };
  },
  parseHTML() {
    return [
      { tag: 'img[src]' },
      { tag: 'div[data-type="resizable-image"]' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', { ...HTMLAttributes, style: `width:${HTMLAttributes.width}; max-width:100%; height:auto; display:block;` }];
  },
  addCommands() {
    return {
      setResizableImage: (attrs) => ({ chain }) => chain().insertContent({ type: this.name, attrs }).run(),
    };
  },
  addNodeView() {
    return ({ node, selected, deleteNode, editor, getPos }: any) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'resizable-image');
      dom.style.position = 'relative';
      dom.style.display = 'inline-block';
      dom.style.maxWidth = '100%';
      const updateWidth = (w: string) => {
        if (typeof getPos === 'function') editor.chain().setNodeSelection(getPos()).updateAttributes('resizableImage', { width: w }).run();
      };
      const render = () => {
        dom.innerHTML = '';
        const wrap = document.createElement('div');
        wrap.style.position = 'relative';
        wrap.style.width = node.attrs.width || '100%';
        wrap.style.maxWidth = '100%';
        wrap.style.border = selected ? '2px solid #3b82f6' : '2px solid transparent';
        wrap.style.display = 'inline-block';
        const img = document.createElement('img');
        img.src = node.attrs.src;
        img.alt = node.attrs.alt || '';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.draggable = false;
        wrap.appendChild(img);
        if (selected) {
          const handles = ['nw','ne','sw','se','n','s','e','w'] as const;
          handles.forEach((h) => {
            const dot = document.createElement('span');
            const isCorner = ['nw','ne','sw','se'].includes(h);
            Object.assign(dot.style, {
              position: 'absolute',
              width: '10px', height: '10px', background: '#fff', border: '1.5px solid #3b82f6',
              borderRadius: isCorner ? '50%' : '2px',
              cursor: h + '-resize',
              zIndex: '2',
            } as any);
            const pos: any = {
              nw: { left: '-5px', top: '-5px' }, ne: { right: '-5px', top: '-5px' },
              sw: { left: '-5px', bottom: '-5px' }, se: { right: '-5px', bottom: '-5px' },
              n: { left: '50%', top: '-5px', transform: 'translateX(-50%)' },
              s: { left: '50%', bottom: '-5px', transform: 'translateX(-50%)' },
              e: { right: '-5px', top: '50%', transform: 'translateY(-50%)' },
              w: { left: '-5px', top: '50%', transform: 'translateY(-50%)' },
            };
            Object.assign(dot.style, pos[h]);
            dot.addEventListener('mousedown', (e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startW = wrap.getBoundingClientRect().width;
              const parentW = dom.getBoundingClientRect().width || 600;
              const onMove = (ev: MouseEvent) => {
                const dx = ev.clientX - startX;
                let newW = startW + (h.includes('w') || h.includes('nw') || h.includes('sw') ? -dx : dx);
                if (h === 'n' || h === 's') return;
                const pct = Math.round((newW / parentW) * 100);
                const clamped = Math.max(10, Math.min(100, pct));
                wrap.style.width = clamped + '%';
              };
              const onUp = () => {
                const pct = wrap.style.width;
                if (pct) updateWidth(pct);
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
              };
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            });
            wrap.appendChild(dot);
          });
          const toolbar = document.createElement('div');
          Object.assign(toolbar.style, { position: 'absolute', top: '-34px', right: '0', display: 'flex', gap: '4px', background: '#111', borderRadius: '6px', padding: '4px' } as any);
          const cropBtn = document.createElement('button');
          cropBtn.textContent = 'Crop';
          cropBtn.style.cssText = 'font-size:11px;color:#fff;padding:2px 6px;background:#3b82f6;border:none;border-radius:4px;cursor:pointer';
          cropBtn.onclick = () => {
            const ev = new CustomEvent('tiptap-crop-image', { detail: { src: node.attrs.src, pos: getPos() } });
            window.dispatchEvent(ev);
          };
          const delBtn = document.createElement('button');
          delBtn.textContent = '✕';
          delBtn.style.cssText = 'font-size:11px;color:#fff;padding:2px 6px;background:#ef4444;border:none;border-radius:4px;cursor:pointer';
          delBtn.onclick = () => deleteNode();
          toolbar.appendChild(cropBtn);
          toolbar.appendChild(delBtn);
          wrap.appendChild(toolbar);
        }
        wrap.addEventListener('dblclick', () => {
          const ev = new CustomEvent('tiptap-crop-image', { detail: { src: node.attrs.src, pos: getPos() } });
          window.dispatchEvent(ev);
        });
        dom.appendChild(wrap);
      };
      render();
      return { dom, update: (updatedNode: any) => { if (updatedNode.type.name !== 'resizableImage') return false; (node as any).attrs = updatedNode.attrs; render(); return true; } } as any;
    };
  },
});
